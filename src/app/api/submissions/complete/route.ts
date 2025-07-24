import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface CompleteSubmissionRequest {
  submissionId: string
  trigger: 'quote_viewed' | 'meeting_booked' | 'cta_clicked' | 'form_submitted'
  pricing?: any
  appointmentSlot?: any
  ctaButtonId?: string
  additionalData?: Record<string, any>
}

// Handle CORS preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
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
      subject: template.subject,
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: CompleteSubmissionRequest = await request.json()
    
    const { submissionId, trigger, pricing, appointmentSlot, ctaButtonId, additionalData } = body
    
    console.log('Completing submission:', {
      submissionId,
      trigger,
      hasPricing: !!pricing,
      hasAppointment: !!appointmentSlot,
      ctaButtonId
    })

    // Get the submission with widget and business info
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select(`
        *,
        widgets!inner (
          *,
          businesses (
            id,
            name,
            email,
            phone
          )
        )
      `)
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const widget = submission.widgets
    const business = widget.businesses
    const submissionFlowConfig = widget.config?.submissionFlow

    // Check if this trigger should mark the submission as complete
    const shouldComplete = !submissionFlowConfig?.completion_trigger || 
                          submissionFlowConfig.completion_trigger === trigger

    // Update submission with completion data
    const updateData: any = {
      last_interaction_at: new Date().toISOString()
    }

    if (pricing) {
      updateData.pricing_data = pricing
    }

    if (appointmentSlot) {
      updateData.form_data = { ...submission.form_data, appointmentSlot }
    }

    if (additionalData) {
      updateData.form_data = { ...submission.form_data, ...additionalData }
      updateData.service_data = { ...submission.service_data, ...additionalData }
    }

    if (shouldComplete) {
      updateData.completion_status = 'complete'
      updateData.completed_at = new Date().toISOString()
      
      // Set appropriate completion time based on trigger
      switch (trigger) {
        case 'quote_viewed':
          updateData.quote_viewed_at = new Date().toISOString()
          break
        case 'meeting_booked':
          updateData.appointment_scheduled_at = new Date().toISOString()
          break
        case 'cta_clicked':
          updateData.cta_clicked_at = new Date().toISOString()
          updateData.cta_button_id = ctaButtonId
          break
        case 'form_submitted':
          updateData.estimate_completed_at = new Date().toISOString()
          break
      }
    }

    const { data: updatedSubmission, error: updateError } = await supabase
      .from('submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single()

    if (updateError) {
      console.error('Failed to update submission:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update submission' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Send notifications if completion trigger is met
    if (shouldComplete) {
      const emailConfig = widget.config?.notifications?.email
      if (emailConfig?.enabled) {
        const formattedData = formatFormDataForEmail(updatedSubmission.form_data)
        
        // Add pricing to template data if available
        if (pricing) {
          formattedData.price = pricing.finalPrice ? `$${pricing.finalPrice.toFixed(2)}` : undefined
        }

        // Add trigger context
        formattedData.completionTrigger = trigger
        formattedData.widgetName = widget.name
        formattedData.timestamp = new Date().toLocaleString()

        // Send business notification emails
        if (emailConfig.send_business_alert && emailConfig.business_emails?.length > 0) {
          for (const businessEmail of emailConfig.business_emails) {
            await queueEmail(
              supabase,
              widget.business_id,
              'new_lead_alert',
              businessEmail,
              business.name,
              formattedData
            )
          }
        }

        // Send customer confirmation email
        if (emailConfig.send_customer_confirmation && updatedSubmission.email) {
          await queueEmail(
            supabase,
            widget.business_id,
            'customer_confirmation',
            updatedSubmission.email,
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
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        submissionId: updatedSubmission.id,
        status: updatedSubmission.completion_status,
        trigger,
        completed: shouldComplete,
        notificationsSent: shouldComplete && widget.config?.notifications?.email?.enabled
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Submission completion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}