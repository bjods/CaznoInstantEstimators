/**
 * Domain Validation Security Module
 * Validates widget embedding domains and tracks usage for security monitoring
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export interface DomainValidationResult {
  isAllowed: boolean
  domain: string | null
  reason?: string
  shouldLog: boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface SecurityEventData {
  eventType: string
  widgetId: string
  businessId?: string
  sourceDomain?: string
  sourceIp?: string
  userAgent?: string
  requestDetails?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Extract domain from various sources (Origin, Referer, Host headers)
 */
export function extractDomain(request: NextRequest): string | null {
  // Try Origin header first (most reliable for CORS requests)
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      return new URL(origin).hostname.toLowerCase()
    } catch {
      // Invalid origin URL
    }
  }

  // Fallback to Referer header
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      return new URL(referer).hostname.toLowerCase()
    } catch {
      // Invalid referer URL
    }
  }

  // Last resort: Host header (for direct access)
  const host = request.headers.get('host')
  if (host) {
    return host.toLowerCase().split(':')[0] // Remove port if present
  }

  return null
}

/**
 * Validate if a domain is allowed to embed a specific widget
 */
export async function validateWidgetDomain(
  widgetId: string,
  domain: string | null,
  request: NextRequest
): Promise<DomainValidationResult> {
  const supabase = createClient()

  // If no domain detected, this is suspicious
  if (!domain) {
    return {
      isAllowed: false,
      domain: null,
      reason: 'No domain detected in request headers',
      shouldLog: true,
      severity: 'medium'
    }
  }

  try {
    // Get widget configuration and check if domain is allowed
    const { data: widget, error } = await supabase
      .from('widgets')
      .select('id, business_id, allowed_domains, security_enabled, embed_restrictions')
      .eq('id', widgetId)
      .eq('is_active', true)
      .single()

    if (error || !widget) {
      return {
        isAllowed: false,
        domain,
        reason: 'Widget not found or inactive',
        shouldLog: true,
        severity: 'high'
      }
    }

    // If security is disabled, allow all domains (legacy widgets)
    if (!widget.security_enabled) {
      return {
        isAllowed: true,
        domain,
        reason: 'Security disabled for widget',
        shouldLog: false,
        severity: 'low'
      }
    }

    // Use database function to check if domain is allowed
    const { data: isAllowed, error: validationError } = await supabase
      .rpc('is_domain_allowed', {
        p_widget_id: widgetId,
        p_domain: domain
      })

    if (validationError) {
      console.error('Domain validation error:', validationError)
      return {
        isAllowed: false,
        domain,
        reason: 'Domain validation failed',
        shouldLog: true,
        severity: 'high'
      }
    }

    // Track domain usage regardless of whether it's allowed
    await trackDomainUsage(widgetId, domain, isAllowed, !isAllowed)

    if (!isAllowed) {
      return {
        isAllowed: false,
        domain,
        reason: 'Domain not in allowed list',
        shouldLog: true,
        severity: 'medium'
      }
    }

    return {
      isAllowed: true,
      domain,
      shouldLog: false,
      severity: 'low'
    }

  } catch (error) {
    console.error('Domain validation error:', error)
    return {
      isAllowed: false,
      domain,
      reason: 'Internal validation error',
      shouldLog: true,
      severity: 'critical'
    }
  }
}

/**
 * Track domain usage for analytics and security monitoring
 */
export async function trackDomainUsage(
  widgetId: string,
  domain: string,
  isAuthorized: boolean,
  wasBlocked: boolean
): Promise<void> {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc('update_widget_domain_usage', {
      p_widget_id: widgetId,
      p_domain: domain,
      p_is_authorized: isAuthorized,
      p_was_blocked: wasBlocked
    })

    if (error) {
      console.error('Failed to track domain usage:', error)
    }
  } catch (error) {
    console.error('Domain usage tracking error:', error)
  }
}

/**
 * Log security events for monitoring and alerting
 */
export async function logSecurityEvent(eventData: SecurityEventData): Promise<void> {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc('log_security_event', {
      p_event_type: eventData.eventType,
      p_widget_id: eventData.widgetId,
      p_business_id: eventData.businessId || null,
      p_source_domain: eventData.sourceDomain || null,
      p_source_ip: eventData.sourceIp || null,
      p_user_agent: eventData.userAgent || null,
      p_request_details: eventData.requestDetails || {},
      p_severity: eventData.severity
    })

    if (error) {
      console.error('Failed to log security event:', error)
    }
  } catch (error) {
    console.error('Security event logging error:', error)
  }
}

/**
 * Get client IP address from request headers
 */
export function getClientIp(request: NextRequest): string | null {
  // Check various headers for client IP (accounting for proxies)
  const xForwardedFor = request.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim()
  }

  const xRealIp = request.headers.get('x-real-ip')
  if (xRealIp) {
    return xRealIp.trim()
  }

  // Fallback to connection remote address (may not be available in serverless)
  return request.ip || null
}

/**
 * Validate HTTPS requirement for secure widgets
 */
export function validateHttps(request: NextRequest, requireHttps: boolean = true): boolean {
  if (!requireHttps) return true
  
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return protocol === 'https'
}

/**
 * Rate limiting check for domain/IP combinations
 */
export async function checkRateLimit(
  domain: string,
  ip: string | null,
  maxRequestsPerHour: number = 1000
): Promise<{ allowed: boolean; remainingRequests: number }> {
  // This is a simplified implementation
  // In production, you'd use Redis or a dedicated rate limiting service
  const supabase = createClient()

  try {
    // Check recent requests from this domain/IP combination
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    
    const { data: recentRequests, error } = await supabase
      .from('widget_domain_usage')
      .select('total_requests')
      .eq('domain', domain)
      .gte('last_seen_at', oneHourAgo)

    if (error) {
      console.error('Rate limit check error:', error)
      return { allowed: true, remainingRequests: maxRequestsPerHour } // Fail open
    }

    const totalRequests = recentRequests?.reduce((sum, record) => sum + record.total_requests, 0) || 0
    const remainingRequests = Math.max(0, maxRequestsPerHour - totalRequests)

    return {
      allowed: totalRequests < maxRequestsPerHour,
      remainingRequests
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    return { allowed: true, remainingRequests: maxRequestsPerHour } // Fail open
  }
}

/**
 * Create security headers for widget responses
 */
export function createSecurityHeaders(allowedDomains: string[] = []): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }

  // Set CORS headers based on allowed domains
  if (allowedDomains.length > 0) {
    // For specific domains, we'll validate origin in middleware
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Widget-Key'
    headers['Access-Control-Max-Age'] = '86400' // 24 hours
  }

  // Frame options - allow embedding but with restrictions
  headers['X-Frame-Options'] = 'SAMEORIGIN'

  return headers
}

/**
 * Validate origin for CORS requests
 */
export function validateCorsOrigin(origin: string | null, allowedDomains: string[]): boolean {
  if (!origin) return false
  
  try {
    const originDomain = new URL(origin).hostname.toLowerCase()
    
    return allowedDomains.some(allowed => {
      // Support wildcard subdomains (*.example.com)
      if (allowed.startsWith('*.')) {
        const baseDomain = allowed.substring(2)
        return originDomain === baseDomain || originDomain.endsWith('.' + baseDomain)
      }
      // Exact match
      return originDomain === allowed.toLowerCase()
    })
  } catch {
    return false
  }
}

/**
 * Create domain validation middleware for API routes
 */
export function createDomainValidationMiddleware() {
  return async function domainValidationMiddleware(
    request: NextRequest,
    widgetId: string
  ): Promise<{ 
    isValid: boolean
    headers: Record<string, string>
    error?: { message: string; status: number }
  }> {
    const domain = extractDomain(request)
    const ip = getClientIp(request)
    const userAgent = request.headers.get('user-agent') || ''

    // Validate domain
    const validation = await validateWidgetDomain(widgetId, domain, request)

    if (!validation.isAllowed) {
      // Log security event
      if (validation.shouldLog) {
        await logSecurityEvent({
          eventType: 'unauthorized_domain',
          widgetId,
          sourceDomain: domain || 'unknown',
          sourceIp: ip || undefined,
          userAgent,
          requestDetails: {
            reason: validation.reason,
            origin: request.headers.get('origin'),
            referer: request.headers.get('referer'),
            host: request.headers.get('host')
          },
          severity: validation.severity
        })
      }

      return {
        isValid: false,
        headers: createSecurityHeaders(),
        error: {
          message: 'Access denied: Unauthorized domain',
          status: 403
        }
      }
    }

    // Create appropriate headers
    const headers = createSecurityHeaders()
    
    // Add CORS headers for allowed domains
    const origin = request.headers.get('origin')
    if (origin && domain) {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Access-Control-Allow-Credentials'] = 'false'
    }

    return {
      isValid: true,
      headers
    }
  }
}