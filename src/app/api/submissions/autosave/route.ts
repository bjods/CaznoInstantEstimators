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

// Validation schema for autosave requests
const autosaveSchema = z.object({
  widgetId: z.string().uuid('Invalid widget ID format'),
  sessionId: z.string().uuid().optional(),
  formData: z.record(z.any()).refine(
    (data) => Object.keys(data).length > 0,
    'Form data cannot be empty'
  ),
  currentStep: z.string().min(1, 'Current step is required'),
  isEarlyCapture: z.boolean().optional()
})

interface AutosaveRequest {
  widgetId: string
  sessionId?: string // Optional session ID for tracking
  formData: Record<string, any>
  currentStep: string
  isEarlyCapture?: boolean // First time creating the submission
}

export async function OPTIONS(request: NextRequest) {
  // Apply domain validation even for preflight requests
  const domainValidation = createDomainValidationMiddleware()
  
  // Extract widget ID from URL or body for validation
  const url = new URL(request.url)
  const widgetId = url.searchParams.get('widgetId')
  
  if (widgetId) {
    const validation = await domainValidation(request, widgetId)
    return NextResponse.json({}, { headers: validation.headers })
  }
  
  // Default headers if no widget ID
  return NextResponse.json({}, { 
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Widget-Key',
      'Access-Control-Max-Age': '86400'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Parse and validate request body
    let body: AutosaveRequest
    try {
      const rawBody = await request.json()
      body = autosaveSchema.parse(rawBody)
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
          endpoint: '/api/submissions/autosave'
        },
        severity: 'medium'
      })
      
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
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
        widgetId: body.widgetId,
        sourceDomain: domain || undefined,
        sourceIp: ip || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        requestDetails: {
          error: rateLimit.error,
          endpoint: '/api/submissions/autosave'
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

    // Apply domain validation middleware
    const domainValidation = createDomainValidationMiddleware()
    const validation = await domainValidation(request, body.widgetId)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error?.message || 'Access denied' },
        { 
          status: validation.error?.status || 403,
          headers: { ...validation.headers, ...rateLimit.headers }
        }
      )
    }
    
    const { widgetId, sessionId, formData, currentStep, isEarlyCapture = false } = body
    
    console.log('Autosave request:', {
      widgetId,
      sessionId: sessionId ? '***' : undefined,
      currentStep,
      isEarlyCapture,
      hasFormData: !!formData
    })

    // Get widget configuration
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const submissionFlowConfig = widget.config?.submissionFlow || {
      early_capture: true,
      completion_trigger: 'quote_viewed',
      autosave_enabled: true,
      partial_lead_notifications: true,
      min_fields_for_capture: ['email']
    }

    // Check if early capture is enabled and we have minimum required fields
    if (isEarlyCapture && submissionFlowConfig.early_capture) {
      const hasMinFields = submissionFlowConfig.min_fields_for_capture.every(
        field => formData[field] && formData[field].toString().trim()
      )

      if (!hasMinFields) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required fields for early capture: ${submissionFlowConfig.min_fields_for_capture.join(', ')}`,
            waitForFields: submissionFlowConfig.min_fields_for_capture
          },
          { status: 400, headers: corsHeaders }
        )
      }
    }

    // Extract contact info
    const email = formData.email || null
    const phone = formData.phone || null
    const fullName = formData.name || 
      (formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : null)
    const address = formData.address || null

    let submission
    
    // Try to find existing submission by sessionId or create new one
    if (sessionId) {
      const { data: existingSubmission } = await supabase
        .from('submissions')
        .select('*')
        .eq('session_id', sessionId)
        .eq('widget_id', widgetId)
        .single()

      if (existingSubmission) {
        // Update existing submission
        const updatedData = {
          email: email || existingSubmission.email,
          phone: phone || existingSubmission.phone,
          full_name: fullName || existingSubmission.full_name,
          address: address || existingSubmission.address,
          form_data: { ...existingSubmission.form_data, ...formData },
          contact_data: {
            ...existingSubmission.contact_data,
            firstName: formData.firstName || existingSubmission.contact_data?.firstName,
            lastName: formData.lastName || existingSubmission.contact_data?.lastName,
            email: email || existingSubmission.contact_data?.email,
            phone: phone || existingSubmission.contact_data?.phone,
            address: address || existingSubmission.contact_data?.address
          },
          service_data: { ...existingSubmission.service_data, ...formData },
          current_step: currentStep,
          last_interaction_at: new Date().toISOString()
        }

        const { data: updatedSubmission, error: updateError } = await supabase
          .from('submissions')
          .update(updatedData)
          .eq('id', existingSubmission.id)
          .select()
          .single()

        if (updateError) {
          console.error('Failed to update submission:', updateError)
          return NextResponse.json(
            { success: false, error: 'Failed to update submission' },
            { status: 500, headers: corsHeaders }
          )
        }

        submission = updatedSubmission
      }
    }

    // Create new submission if none exists
    if (!submission) {
      const newSessionId = sessionId || crypto.randomUUID()
      
      const submissionData = {
        session_id: newSessionId,
        widget_id: widgetId,
        business_id: widget.business_id,
        email,
        phone,
        full_name: fullName,
        address,
        form_data: formData,
        contact_data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email,
          phone,
          address
        },
        service_data: formData,
        pricing_data: null,
        completion_status: isEarlyCapture ? 'started' : 'in_progress',
        current_step: currentStep,
        source: 'widget',
        last_interaction_at: new Date().toISOString()
      }

      const { data: newSubmission, error: createError } = await supabase
        .from('submissions')
        .insert(submissionData)
        .select()
        .single()

      if (createError) {
        console.error('Failed to create submission:', createError)
        return NextResponse.json(
          { success: false, error: 'Failed to create submission' },
          { status: 500, headers: corsHeaders }
        )
      }

      submission = newSubmission
    }

    return NextResponse.json({
      success: true,
      data: {
        submissionId: submission.id,
        sessionId: submission.session_id,
        status: submission.completion_status,
        isEarlyCapture,
        currentStep: submission.current_step
      }
    }, { 
      headers: { 
        ...validation.headers, 
        ...rateLimit.headers,
        ...getAPISecurityHeaders()
      } 
    })

  } catch (error) {
    console.error('Autosave error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { 
        status: 500,
        headers: getAPISecurityHeaders()
      }
    )
  }
}