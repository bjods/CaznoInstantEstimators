/**
 * Security Headers Configuration
 * Implements comprehensive security headers for production deployment
 */

export interface SecurityHeadersConfig {
  isDevelopment?: boolean
  allowedFrameAncestors?: string[]
  additionalScriptSources?: string[]
  additionalStyleSources?: string[]
}

/**
 * Generate Content Security Policy (CSP) header value
 */
export function generateCSP(config: SecurityHeadersConfig = {}): string {
  const {
    isDevelopment = false,
    allowedFrameAncestors = [],
    additionalScriptSources = [],
    additionalStyleSources = []
  } = config

  // Base CSP directives
  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDevelopment ? "'unsafe-eval'" : ''} ${additionalScriptSources.join(' ')}`.trim(),
    `style-src 'self' 'unsafe-inline' ${additionalStyleSources.join(' ')}`.trim(),
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.supabase.co https://*.supabase.co wss://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "child-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "base-uri 'self'",
    "form-action 'self'"
  ]

  // Frame ancestors for iframe embedding
  if (allowedFrameAncestors.length > 0) {
    cspDirectives.push(`frame-ancestors 'self' ${allowedFrameAncestors.join(' ')}`)
  } else {
    cspDirectives.push("frame-ancestors 'self'")
  }

  return cspDirectives.join('; ')
}

/**
 * Get all security headers for HTTP responses
 */
export function getSecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  const { isDevelopment = false } = config

  const headers: Record<string, string> = {
    // Content Security Policy
    'Content-Security-Policy': generateCSP(config),
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Frame Options (backup for CSP frame-ancestors)
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Permissions Policy (restrict browser features)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()'
    ].join(', ')
  }

  // HSTS only in production with HTTPS
  if (!isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  }

  return headers
}

/**
 * Widget-specific security headers for iframe embedding
 */
export function getWidgetSecurityHeaders(
  allowedDomains: string[] = [],
  isDevelopment: boolean = false
): Record<string, string> {
  const config: SecurityHeadersConfig = {
    isDevelopment,
    allowedFrameAncestors: allowedDomains,
    // Allow additional sources needed for widgets
    additionalScriptSources: [
      'https://js.stripe.com', // If using Stripe
      'https://www.google.com', // For reCAPTCHA if needed
      'https://www.gstatic.com'
    ],
    additionalStyleSources: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
  }

  return getSecurityHeaders(config)
}

/**
 * Dashboard security headers (more restrictive)
 */
export function getDashboardSecurityHeaders(isDevelopment: boolean = false): Record<string, string> {
  const config: SecurityHeadersConfig = {
    isDevelopment,
    allowedFrameAncestors: [], // No iframe embedding for dashboard
    additionalScriptSources: [],
    additionalStyleSources: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]
  }

  const headers = getSecurityHeaders(config)
  
  // Dashboard should never be embedded
  headers['X-Frame-Options'] = 'DENY'
  headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(
    "frame-ancestors 'self'",
    "frame-ancestors 'none'"
  )

  return headers
}

/**
 * API security headers (minimal, focused on data protection)
 */
export function getAPISecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
  }
}

/**
 * Merge security headers with existing headers
 */
export function mergeSecurityHeaders(
  existingHeaders: Record<string, string>,
  securityHeaders: Record<string, string>
): Record<string, string> {
  return {
    ...existingHeaders,
    ...securityHeaders
  }
}

/**
 * Validate CSP header for testing
 */
export function validateCSP(csp: string): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for required directives
  const requiredDirectives = ['default-src', 'script-src', 'style-src', 'frame-ancestors']
  
  for (const directive of requiredDirectives) {
    if (!csp.includes(directive)) {
      errors.push(`Missing required directive: ${directive}`)
    }
  }

  // Check for unsafe directives in production
  if (csp.includes("'unsafe-eval'")) {
    warnings.push("'unsafe-eval' detected - should only be used in development")
  }

  // Check for overly permissive sources
  if (csp.includes('*') && !csp.includes('data:') && !csp.includes('https:')) {
    errors.push('Wildcard (*) source detected without protocol restriction')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}