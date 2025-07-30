/**
 * CSRF Protection Implementation
 * Protects against Cross-Site Request Forgery attacks
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export interface CSRFConfig {
  tokenName?: string
  cookieName?: string
  headerName?: string
  excludePaths?: string[]
  secureCookie?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
  maxAge?: number
}

const DEFAULT_CONFIG: Required<CSRFConfig> = {
  tokenName: 'csrf_token',
  cookieName: '__csrf',
  headerName: 'x-csrf-token',
  excludePaths: ['/api/submissions/autosave', '/api/submissions/complete'], // Widget endpoints
  secureCookie: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600 // 1 hour
}

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  // Generate 32 bytes of random data and encode as base64url
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(
  request: NextRequest,
  config: CSRFConfig = {}
): { isValid: boolean; error?: string } {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  // Get token from header or form data
  const headerToken = request.headers.get(cfg.headerName)
  
  // Get expected token from cookie
  const cookieStore = cookies()
  const cookieToken = cookieStore.get(cfg.cookieName)?.value
  
  if (!cookieToken) {
    return { isValid: false, error: 'CSRF cookie not found' }
  }
  
  if (!headerToken) {
    return { isValid: false, error: 'CSRF token not provided' }
  }
  
  if (headerToken !== cookieToken) {
    return { isValid: false, error: 'CSRF token mismatch' }
  }
  
  return { isValid: true }
}

/**
 * Set CSRF token cookie in response
 */
export function setCSRFTokenCookie(
  response: NextResponse,
  token: string,
  config: CSRFConfig = {}
): NextResponse {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  response.cookies.set(cfg.cookieName, token, {
    httpOnly: true,
    secure: cfg.secureCookie,
    sameSite: cfg.sameSite,
    maxAge: cfg.maxAge,
    path: '/'
  })
  
  return response
}

/**
 * Check if path should be excluded from CSRF protection
 */
export function isPathExcluded(pathname: string, config: CSRFConfig = {}): boolean {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  
  return cfg.excludePaths.some(excludePath => {
    if (excludePath.endsWith('*')) {
      const prefix = excludePath.slice(0, -1)
      return pathname.startsWith(prefix)
    }
    return pathname === excludePath
  })
}

/**
 * CSRF middleware for API routes
 */
export function createCSRFMiddleware(config: CSRFConfig = {}) {
  return function csrfMiddleware(request: NextRequest): {
    isValid: boolean
    error?: string
    token?: string
  } {
    const pathname = new URL(request.url).pathname
    
    // Skip CSRF validation for excluded paths (like widget endpoints)
    if (isPathExcluded(pathname, config)) {
      return { isValid: true }
    }
    
    // Skip CSRF validation for GET, HEAD, OPTIONS (safe methods)
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return { isValid: true }
    }
    
    // Validate CSRF token for state-changing requests
    const validation = validateCSRFToken(request, config)
    
    if (!validation.isValid) {
      return {
        isValid: false,
        error: validation.error || 'CSRF validation failed'
      }
    }
    
    return { isValid: true }
  }
}

/**
 * Generate CSRF token for forms
 */
export async function getCSRFToken(config: CSRFConfig = {}): Promise<string> {
  const cfg = { ...DEFAULT_CONFIG, ...config }
  const cookieStore = cookies()
  
  // Check if we already have a valid token
  const existingToken = cookieStore.get(cfg.cookieName)?.value
  if (existingToken) {
    return existingToken
  }
  
  // Generate new token
  return generateCSRFToken()
}

/**
 * CSRF token component helper for React forms
 */
export interface CSRFTokenProps {
  token: string
  fieldName?: string
}

export function getCSRFTokenInput(props: CSRFTokenProps): string {
  const { token, fieldName = 'csrf_token' } = props
  return `<input type="hidden" name="${fieldName}" value="${token}" />`
}

/**
 * Double-submit cookie pattern validation
 * Alternative CSRF protection method
 */
export function validateDoubleSubmitCookie(
  request: NextRequest,
  cookieName: string = '__csrf_token'
): { isValid: boolean; error?: string } {
  const cookieStore = cookies()
  const cookieToken = cookieStore.get(cookieName)?.value
  const headerToken = request.headers.get('x-csrf-token')
  
  if (!cookieToken || !headerToken) {
    return { 
      isValid: false, 
      error: 'CSRF tokens missing' 
    }
  }
  
  if (cookieToken !== headerToken) {
    return { 
      isValid: false, 
      error: 'CSRF token mismatch' 
    }
  }
  
  return { isValid: true }
}

/**
 * Origin-based CSRF protection
 * Validates request origin matches expected origin
 */
export function validateOrigin(
  request: NextRequest,
  allowedOrigins: string[]
): { isValid: boolean; error?: string } {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  
  // For same-origin requests, origin might be null
  if (!origin && !referer) {
    return { isValid: false, error: 'No origin or referer header' }
  }
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : null)
  
  if (!requestOrigin) {
    return { isValid: false, error: 'Could not determine request origin' }
  }
  
  if (!allowedOrigins.includes(requestOrigin)) {
    return { 
      isValid: false, 
      error: `Origin ${requestOrigin} not allowed` 
    }
  }
  
  return { isValid: true }
}

/**
 * Combined CSRF protection with multiple validation methods
 */
export function validateCSRFComprehensive(
  request: NextRequest,
  allowedOrigins: string[],
  config: CSRFConfig = {}
): { isValid: boolean; error?: string; method?: string } {
  // 1. Check if path is excluded
  if (isPathExcluded(new URL(request.url).pathname, config)) {
    return { isValid: true, method: 'excluded' }
  }
  
  // 2. Skip for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return { isValid: true, method: 'safe_method' }
  }
  
  // 3. Try origin validation first (fastest)
  const originValidation = validateOrigin(request, allowedOrigins)
  if (originValidation.isValid) {
    return { isValid: true, method: 'origin' }
  }
  
  // 4. Fall back to token validation
  const tokenValidation = validateCSRFToken(request, config)
  if (tokenValidation.isValid) {
    return { isValid: true, method: 'token' }
  }
  
  // 5. Try double-submit cookie as last resort
  const doubleSubmitValidation = validateDoubleSubmitCookie(request)
  if (doubleSubmitValidation.isValid) {
    return { isValid: true, method: 'double_submit' }
  }
  
  return { 
    isValid: false, 
    error: 'All CSRF validation methods failed',
    method: 'none'
  }
}