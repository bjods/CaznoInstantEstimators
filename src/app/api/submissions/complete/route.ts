import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

// TODO: Email formatting and queueing functions removed for now
// These can be re-added when email/SMS notifications are implemented

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

    // Get the submission and widget info
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single()
    
    if (submissionError || !submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Get widget info separately
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', submission.widget_id)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const submissionFlowConfig = widget.config?.submissionFlow

    // Check if this trigger should mark the submission as complete
    const shouldComplete = !submissionFlowConfig?.completion_trigger || 
                          submissionFlowConfig.completion_trigger === trigger

    // Update submission with completion data
    const updateData: any = {
      last_interaction_at: new Date().toISOString()
    }

    if (pricing) {
      // Structure pricing data for dashboard display
      updateData.pricing_data = {
        ...pricing,
        calculated_at: new Date().toISOString(),
        display_price: pricing.finalPrice ? `$${pricing.finalPrice.toFixed(2)}` : null,
        trigger_source: trigger,
        // Ensure breakdown is properly structured
        breakdown: pricing.breakdown || {},
        modifiers: pricing.modifiers || [],
        // Add metadata for dashboard filtering/sorting
        metadata: {
          base_price: pricing.basePrice || 0,
          final_price: pricing.finalPrice || 0,
          has_drive_time: !!(pricing.driveTime),
          modifier_count: pricing.modifiers?.length || 0,
          calculation_version: '1.0'
        }
      }
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

    // TODO: Email/SMS notifications disabled for now - implement when ready
    // Notification system ready to be enabled with proper email templates and SMS setup

    return NextResponse.json({
      success: true,
      data: {
        submissionId: updatedSubmission.id,
        status: updatedSubmission.completion_status,
        trigger,
        completed: shouldComplete,
        notificationsSent: false // Disabled for now
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