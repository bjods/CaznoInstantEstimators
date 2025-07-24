import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface LeadSubmission {
  formData: Record<string, any>
  pricing?: any
  timestamp: string
  widgetId: string
}

async function queueEmail(
  supabase: any,
  businessId: string,
  templateKey: string,
  recipientEmail: string,
  recipientName: string | undefined,
  templateData: Record<string, any>
) {
  // Get the template for this business
  const { data: template, error: templateError } = await supabase
    .from('email_templates')
    .select('*')
    .eq('business_id', businessId)
    .eq('template_key', templateKey)
    .eq('is_active', true)
    .single()

  if (templateError || !template) {
    console.error(`Template not found for business ${businessId}, template ${templateKey}:`, templateError)
    return
  }

  // Queue the email
  const { error: queueError } = await supabase
    .from('email_queue')
    .insert({
      business_id: businessId,
      template_id: template.id,
      recipient_email: recipientEmail,
      recipient_name: recipientName,
      subject: template.subject, // Will be processed by edge function
      template_data: templateData,
      status: 'pending',
      next_retry_at: new Date().toISOString()
    })

  if (queueError) {
    console.error('Failed to queue email:', queueError)
  } else {
    console.log(`Queued ${templateKey} email for ${recipientEmail}`)
  }
}

function formatFormDataForEmail(formData: Record<string, any>): Record<string, any> {
  const formatted: Record<string, any> = { ...formData }

  // Format service selection
  if (formData.service) {
    if (Array.isArray(formData.service)) {
      formatted.service = formData.service
        .map((s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()))
        .join(', ')
    } else {
      formatted.service = formData.service.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
    }
  }

  // Format measurements
  const measurements = []
  if (formData.linearFeet) measurements.push(`${formData.linearFeet} linear feet`)
  if (formData.sqft) measurements.push(`${formData.sqft} sq ft`)
  if (formData.rentalDays) measurements.push(`${formData.rentalDays} days`)
  if (measurements.length > 0) {
    formatted.measurements = measurements.join(', ')
  }

  // Format additional options
  const additionalInfo = []
  if (formData.gateCount > 0) additionalInfo.push(`${formData.gateCount} gate${formData.gateCount > 1 ? 's' : ''}`)
  if (formData.hasdifficultAccess) additionalInfo.push('Difficult access')
  if (formData.needsPrepWork) additionalInfo.push('Site preparation required')
  if (formData.wasteType) additionalInfo.push(`Waste type: ${formData.wasteType.replace(/_/g, ' ')}`)
  if (additionalInfo.length > 0) {
    formatted.additionalInfo = additionalInfo.join(', ')
  }

  // Format name
  if (formData.firstName && formData.lastName) {
    formatted.name = `${formData.firstName} ${formData.lastName}`
  } else if (formData.name) {
    formatted.name = formData.name
  }

  return formatted
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: LeadSubmission = await request.json()
    
    const { formData, pricing, timestamp, widgetId } = body

    // Get widget configuration to check email settings
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select(`
        *,
        businesses (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', widgetId)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404 }
      )
    }

    // Save the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        widget_id: widgetId,
        business_id: widget.business_id,
        form_data: formData,
        pricing_data: pricing,
        status: 'new',
        source: 'widget'
      })
      .select()
      .single()

    if (leadError) {
      console.error('Failed to save lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Failed to save lead' },
        { status: 500 }
      )
    }

    // Check if email notifications are enabled
    const emailConfig = widget.config?.notifications?.email
    if (emailConfig?.enabled) {
      const formattedData = formatFormDataForEmail(formData)
      
      // Add pricing to template data if available
      if (pricing) {
        formattedData.price = pricing.finalPrice ? `$${pricing.finalPrice.toFixed(2)}` : undefined
      }

      // Add widget and timestamp info
      formattedData.widgetName = widget.name
      formattedData.timestamp = new Date(timestamp).toLocaleString()

      // Send business notification emails
      if (emailConfig.send_business_alert && emailConfig.business_emails?.length > 0) {
        for (const businessEmail of emailConfig.business_emails) {
          await queueEmail(
            supabase,
            widget.business_id,
            'new_lead_alert',
            businessEmail,
            widget.businesses.name,
            formattedData
          )
        }
      }

      // Send customer confirmation email
      if (emailConfig.send_customer_confirmation && formData.email) {
        await queueEmail(
          supabase,
          widget.business_id,
          'customer_confirmation',
          formData.email,
          formattedData.name,
          formattedData
        )
      }

      // Trigger the email processing function
      try {
        const functionUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-emails`
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          console.error('Failed to trigger email function:', await response.text())
        }
      } catch (triggerError) {
        console.error('Failed to trigger email function:', triggerError)
        // Don't fail the lead submission if email trigger fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        leadId: lead.id,
        emailsQueued: emailConfig?.enabled || false
      }
    })

  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}