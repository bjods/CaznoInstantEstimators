/**
 * Simple Rate Limiting System
 * Protects against attacks while being invisible to normal users
 * No configuration needed - just works
 */

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

// In-memory storage (will upgrade to Redis later if needed)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Simple, generous limits that normal users will never hit
const LIMITS = {
  PER_IP_PER_MINUTE: 100,      // 100 requests/minute per IP (very generous)
  PER_DOMAIN_PER_HOUR: 5000,   // 5000 requests/hour per domain (huge limit)
  BURST_ALLOWANCE: 50          // Allow 50 quick requests in a row
}

/**
 * Check if request should be rate limited
 * Returns: { allowed: true } for normal traffic, { allowed: false } for attacks
 */
export function checkRateLimit(
  identifier: string, 
  windowMinutes: number = 1
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowMinutes * 60 * 1000
  const key = `${identifier}:${Math.floor(now / windowMs)}`
  
  // Clean up old entries (simple cleanup)
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k)
      }
    }
  }
  
  const existing = rateLimitStore.get(key)
  const resetTime = Math.floor(now / windowMs) * windowMs + windowMs
  
  if (!existing) {
    // First request in this window
    rateLimitStore.set(key, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: LIMITS.PER_IP_PER_MINUTE - 1,
      resetTime
    }
  }
  
  if (now > existing.resetTime) {
    // Window expired, reset counter
    rateLimitStore.set(key, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: LIMITS.PER_IP_PER_MINUTE - 1,
      resetTime
    }
  }
  
  // Increment counter
  existing.count++
  
  const limit = LIMITS.PER_IP_PER_MINUTE
  const allowed = existing.count <= limit
  const remaining = Math.max(0, limit - existing.count)
  
  return {
    allowed,
    remaining,
    resetTime: existing.resetTime
  }
}

/**
 * Simple IP-based rate limiting
 * 100 requests per minute per IP - generous but stops attacks
 */
export function rateLimitByIP(ip: string): RateLimitResult {
  return checkRateLimit(`ip:${ip}`, 1) // 1 minute window
}

/**
 * Domain-based rate limiting  
 * 5000 requests per hour per domain - huge limit for normal use
 */
export function rateLimitByDomain(domain: string): RateLimitResult {
  return checkRateLimit(`domain:${domain}`, 60) // 60 minute window
}

/**
 * Combined rate limiting check
 * Blocks if EITHER IP or domain exceeds limits
 */
export function rateLimitRequest(ip: string | null, domain: string | null): {
  allowed: boolean
  reason?: string
  retryAfter?: number
} {
  // Check IP limit (if we have IP)
  if (ip) {
    const ipLimit = rateLimitByIP(ip)
    if (!ipLimit.allowed) {
      return {
        allowed: false,
        reason: 'IP rate limit exceeded',
        retryAfter: Math.ceil((ipLimit.resetTime - Date.now()) / 1000)
      }
    }
  }
  
  // Check domain limit (if we have domain)
  if (domain) {
    const domainLimit = rateLimitByDomain(domain)
    if (!domainLimit.allowed) {
      return {
        allowed: false,
        reason: 'Domain rate limit exceeded', 
        retryAfter: Math.ceil((domainLimit.resetTime - Date.now()) / 1000)
      }
    }
  }
  
  return { allowed: true }
}

/**
 * Rate limiting middleware for API routes
 */
export function createRateLimitMiddleware() {
  return function rateLimitMiddleware(
    ip: string | null,
    domain: string | null
  ): { allowed: boolean; headers: Record<string, string>; error?: string } {
    
    const result = rateLimitRequest(ip, domain)
    
    const headers: Record<string, string> = {}
    
    if (!result.allowed) {
      // Add rate limit headers
      if (result.retryAfter) {
        headers['Retry-After'] = result.retryAfter.toString()
      }
      headers['X-RateLimit-Limit'] = LIMITS.PER_IP_PER_MINUTE.toString()
      headers['X-RateLimit-Remaining'] = '0'
      
      return {
        allowed: false,
        headers,
        error: 'Rate limit exceeded. Please try again later.'
      }
    }
    
    // Add informational headers for successful requests
    const ipLimit = ip ? rateLimitByIP(ip) : null
    if (ipLimit) {
      headers['X-RateLimit-Limit'] = LIMITS.PER_IP_PER_MINUTE.toString()
      headers['X-RateLimit-Remaining'] = ipLimit.remaining.toString()
      headers['X-RateLimit-Reset'] = Math.ceil(ipLimit.resetTime / 1000).toString()
    }
    
    return {
      allowed: true,
      headers
    }
  }
}

/**
 * Get current rate limit status for monitoring
 */
export function getRateLimitStats(): {
  totalKeys: number
  memoryUsage: number
  topIPs: Array<{ ip: string; count: number }>
  topDomains: Array<{ domain: string; count: number }>
} {
  const now = Date.now()
  const activeEntries = new Map<string, number>()
  
  // Collect active entries and clean up expired ones
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime > now) {
      activeEntries.set(key, value.count)
    } else {
      rateLimitStore.delete(key)
    }
  }
  
  // Sort by count for top lists
  const entries = Array.from(activeEntries.entries())
  const ips = entries
    .filter(([key]) => key.startsWith('ip:'))
    .map(([key, count]) => ({ ip: key.replace('ip:', '').split(':')[0], count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    
  const domains = entries
    .filter(([key]) => key.startsWith('domain:'))
    .map(([key, count]) => ({ domain: key.replace('domain:', '').split(':')[0], count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  
  return {
    totalKeys: rateLimitStore.size,
    memoryUsage: JSON.stringify(Object.fromEntries(rateLimitStore)).length,
    topIPs: ips,
    topDomains: domains
  }
}

/**
 * Emergency: Clear all rate limits (if needed)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Emergency: Remove rate limit for specific IP/domain
 */
export function removeRateLimit(identifier: string): void {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const currentWindow = Math.floor(now / windowMs)
  
  // Remove current and next few windows
  for (let i = 0; i < 5; i++) {
    const key = `${identifier}:${currentWindow + i}`
    rateLimitStore.delete(key)
  }
}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  let cleaned = 0
  
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key)
      cleaned++
    }
  }
  
  if (cleaned > 0) {
    console.log(`Rate limit cleanup: removed ${cleaned} expired entries`)
  }
}, 5 * 60 * 1000) // Every 5 minutes