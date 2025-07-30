import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  createDomainValidationMiddleware,
  extractDomain,
  getClientIp,
  logSecurityEvent 
} from '@/lib/security/domain-validation'
import { createRateLimitMiddleware } from '@/lib/security/rate-limiting'
import { getAPISecurityHeaders } from '@/lib/security/security-headers'
import { z } from 'zod'

// Validation schema for complete submission requests
const completeSubmissionSchema = z.object({
  submissionId: z.string().uuid('Invalid submission ID format'),
  trigger: z.enum(['quote_viewed', 'meeting_booked', 'cta_clicked', 'form_submitted']),
  pricing: z.any().optional(),
  appointmentSlot: z.any().optional(),
  ctaButtonId: z.string().optional(),
  additionalData: z.record(z.any()).optional()
})

interface CompleteSubmissionRequest {
  submissionId: string
  trigger: 'quote_viewed' | 'meeting_booked' | 'cta_clicked' | 'form_submitted'
  pricing?: any
  appointmentSlot?: any
  ctaButtonId?: string
  additionalData?: Record<string, any>
}

export async function OPTIONS(request: NextRequest) {
  // For this endpoint, we can't validate domain without submission ID
  // Return basic security headers
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Widget-Key',
      'Access-Control-Max-Age': '86400',
      ...getAPISecurityHeaders()
    }
  })
}

// TODO: Email formatting and queueing functions removed for now
// These can be re-added when email/SMS notifications are implemented

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Parse and validate request body
    let body: CompleteSubmissionRequest
    try {
      const rawBody = await request.json()
      body = completeSubmissionSchema.parse(rawBody)
    } catch (error) {
      const domain = extractDomain(request)
      const ip = getClientIp(request)
      
      // Log validation failure
      await logSecurityEvent({
        eventType: 'input_validation_failed',
        widgetId: 'unknown',
        sourceDomain: domain || undefined,
        sourceIp: ip || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        requestDetails: {
          error: error instanceof z.ZodError ? error.errors : 'Invalid JSON',
          endpoint: '/api/submissions/complete'
        },
        severity: 'medium'
      })
      
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
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
        { status: 404 }
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
        { status: 404 }
      )
    }

    // Apply rate limiting first (fast check)
    const domain = extractDomain(request)
    const ip = getClientIp(request)
    
    const rateLimitMiddleware = createRateLimitMiddleware()
    const rateLimit = rateLimitMiddleware(ip, domain)
    
    if (!rateLimit.allowed) {
      await logSecurityEvent({
        eventType: 'rate_limit_exceeded',
        widgetId: submission.widget_id,
        businessId: widget?.business_id,
        sourceDomain: domain || undefined,
        sourceIp: ip || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        requestDetails: {
          error: rateLimit.error,
          endpoint: '/api/submissions/complete'
        },
        severity: 'medium'
      })
      
      return NextResponse.json(
        { success: false, error: rateLimit.error || 'Too many requests' },
        { 
          status: 429,
          headers: rateLimit.headers
        }
      )
    }

    // Apply domain validation middleware now that we have widget ID
    const domainValidation = createDomainValidationMiddleware()
    const validation = await domainValidation(request, submission.widget_id)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error?.message || 'Access denied' },
        { 
          status: validation.error?.status || 403,
          headers: { ...validation.headers, ...rateLimit.headers }
        }
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
        { 
          status: 500, 
          headers: { 
            ...validation.headers, 
            ...rateLimit.headers,
            ...getAPISecurityHeaders()
          } 
        }
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
    }, { 
      headers: { 
        ...validation.headers, 
        ...rateLimit.headers,
        ...getAPISecurityHeaders()
      } 
    })

  } catch (error) {
    console.error('Submission completion error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { 
        status: 500,
        headers: getAPISecurityHeaders()
      }
    )
  }
}