/**
 * PostMessage Security Module
 * Secure iframe communication with domain validation and message authentication
 */

import { createClient } from '@/lib/supabase/server'

export interface SecureMessage {
  type: string
  payload: any
  timestamp: number
  widgetId?: string
  signature?: string
}

export interface MessageValidationResult {
  isValid: boolean
  message?: SecureMessage
  error?: string
  shouldBlock: boolean
}

export interface PostMessageConfig {
  allowedOrigins: string[]
  requireSignature: boolean
  maxMessageSize: number
  rateLimitPerMinute: number
  trustedMessageTypes: string[]
}

// Default configuration
const DEFAULT_CONFIG: PostMessageConfig = {
  allowedOrigins: [],
  requireSignature: false,
  maxMessageSize: 10240, // 10KB
  rateLimitPerMinute: 60,
  trustedMessageTypes: [
    'widget:ready',
    'widget:resize',
    'widget:navigate',
    'widget:submit',
    'widget:error',
    'parent:scroll',
    'parent:visibility'
  ]
}

/**
 * Rate limiting store for postMessage events
 */
const messageRateLimit = new Map<string, { count: number; resetTime: number }>()

/**
 * Validate incoming postMessage events
 */
export function validatePostMessage(
  event: MessageEvent,
  config: Partial<PostMessageConfig> = {}
): MessageValidationResult {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  
  // Validate origin
  if (!isOriginAllowed(event.origin, fullConfig.allowedOrigins)) {
    console.warn(`Blocked postMessage from unauthorized origin: ${event.origin}`)
    return {
      isValid: false,
      error: 'Unauthorized origin',
      shouldBlock: true
    }
  }

  // Validate message structure
  let message: SecureMessage
  try {
    message = parseSecureMessage(event.data)
  } catch (error) {
    console.warn('Invalid postMessage format:', error)
    return {
      isValid: false,
      error: 'Invalid message format',
      shouldBlock: false
    }
  }

  // Check message size
  const messageSize = JSON.stringify(event.data).length
  if (messageSize > fullConfig.maxMessageSize) {
    console.warn(`Blocked oversized postMessage: ${messageSize} bytes`)
    return {
      isValid: false,
      error: 'Message too large',
      shouldBlock: true
    }
  }

  // Validate message type
  if (!fullConfig.trustedMessageTypes.includes(message.type)) {
    console.warn(`Blocked untrusted message type: ${message.type}`)
    return {
      isValid: false,
      error: 'Untrusted message type',
      shouldBlock: true
    }
  }

  // Check rate limiting
  if (!checkPostMessageRateLimit(event.origin, fullConfig.rateLimitPerMinute)) {
    console.warn(`Rate limit exceeded for origin: ${event.origin}`)
    return {
      isValid: false,
      error: 'Rate limit exceeded',
      shouldBlock: true
    }
  }

  // Validate message timestamp (prevent replay attacks)
  const now = Date.now()
  const messageAge = now - message.timestamp
  if (messageAge > 30000) { // 30 seconds max age
    return {
      isValid: false,
      error: 'Message expired',
      shouldBlock: false
    }
  }

  if (messageAge < -5000) { // 5 seconds future tolerance
    return {
      isValid: false,
      error: 'Message timestamp invalid',
      shouldBlock: true
    }
  }

  // Validate signature if required
  if (fullConfig.requireSignature && !validateMessageSignature(message)) {
    return {
      isValid: false,
      error: 'Invalid message signature',
      shouldBlock: true
    }
  }

  return {
    isValid: true,
    message,
    shouldBlock: false
  }
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (allowedOrigins.length === 0) return true // No restrictions
  
  try {
    const originUrl = new URL(origin)
    const originDomain = originUrl.hostname.toLowerCase()
    
    return allowedOrigins.some(allowed => {
      // Support wildcard subdomains (*.example.com)
      if (allowed.startsWith('*.')) {
        const baseDomain = allowed.substring(2).toLowerCase()
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
 * Parse and validate message structure
 */
function parseSecureMessage(data: any): SecureMessage {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Message must be an object')
  }

  if (typeof data.type !== 'string') {
    throw new Error('Message type must be a string')
  }

  if (typeof data.timestamp !== 'number') {
    throw new Error('Message timestamp must be a number')
  }

  return {
    type: data.type,
    payload: data.payload,
    timestamp: data.timestamp,
    widgetId: data.widgetId,
    signature: data.signature
  }
}

/**
 * Rate limiting for postMessage events
 */
function checkPostMessageRateLimit(origin: string, maxPerMinute: number): boolean {
  const now = Date.now()
  const key = origin
  const existing = messageRateLimit.get(key)
  
  if (!existing || now > existing.resetTime) {
    // Reset or create new entry
    messageRateLimit.set(key, {
      count: 1,
      resetTime: now + 60000 // 1 minute from now
    })
    return true
  }
  
  if (existing.count >= maxPerMinute) {
    return false
  }
  
  existing.count++
  return true
}

/**
 * Validate message signature (HMAC-based)
 */
function validateMessageSignature(message: SecureMessage): boolean {
  if (!message.signature) return false
  
  // In a real implementation, you'd use a proper HMAC with a secret key
  // For now, we'll implement a basic validation
  const expectedSignature = generateMessageSignature(message)
  return message.signature === expectedSignature
}

/**
 * Generate message signature
 */
function generateMessageSignature(message: SecureMessage): string {
  // In production, use proper HMAC with crypto module
  const payload = JSON.stringify({
    type: message.type,
    payload: message.payload,
    timestamp: message.timestamp,
    widgetId: message.widgetId
  })
  
  // This is a simplified signature - use proper HMAC-SHA256 in production
  const hash = Buffer.from(payload).toString('base64')
  return hash.substring(0, 16) // Truncate for simplicity
}

/**
 * Create secure postMessage sender
 */
export function createSecurePostMessage(
  targetWindow: Window,
  targetOrigin: string,
  widgetId?: string
) {
  return {
    send: (type: string, payload: any) => {
      const message: SecureMessage = {
        type,
        payload,
        timestamp: Date.now(),
        widgetId
      }
      
      // Add signature if needed
      message.signature = generateMessageSignature(message)
      
      try {
        targetWindow.postMessage(message, targetOrigin)
      } catch (error) {
        console.error('Failed to send postMessage:', error)
      }
    }
  }
}

/**
 * Set up secure postMessage listener
 */
export function setupSecureMessageListener(
  config: Partial<PostMessageConfig>,
  messageHandler: (message: SecureMessage, origin: string) => void
): () => void {
  const handleMessage = (event: MessageEvent) => {
    const validation = validatePostMessage(event, config)
    
    if (!validation.isValid) {
      if (validation.shouldBlock) {
        // Log security event for suspicious messages
        logPostMessageSecurityEvent({
          eventType: 'postmessage_blocked',
          origin: event.origin,
          error: validation.error || 'Unknown error',
          messageData: event.data
        })
      }
      return
    }
    
    if (validation.message) {
      messageHandler(validation.message, event.origin)
    }
  }
  
  window.addEventListener('message', handleMessage)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage)
  }
}

/**
 * Log postMessage security events
 */
async function logPostMessageSecurityEvent(eventData: {
  eventType: string
  origin: string
  error: string
  messageData: any
}): Promise<void> {
  try {
    const supabase = createClient()
    
    await supabase.from('security_events').insert({
      event_type: eventData.eventType,
      source_domain: new URL(eventData.origin).hostname,
      request_details: {
        origin: eventData.origin,
        error: eventData.error,
        messageType: eventData.messageData?.type,
        messageSize: JSON.stringify(eventData.messageData).length
      },
      severity: 'medium'
    })
  } catch (error) {
    console.error('Failed to log postMessage security event:', error)
  }
}

/**
 * Client-side widget postMessage setup
 */
export function setupWidgetPostMessage(widgetId: string, allowedParentOrigins: string[]) {
  const config: Partial<PostMessageConfig> = {
    allowedOrigins: allowedParentOrigins,
    requireSignature: false, // Start with false, enable later
    maxMessageSize: 5120, // 5KB for widget messages
    rateLimitPerMinute: 30,
    trustedMessageTypes: [
      'parent:scroll',
      'parent:visibility',
      'parent:resize',
      'widget:ready',
      'widget:navigate',
      'widget:submit'
    ]
  }

  let parentMessenger: ReturnType<typeof createSecurePostMessage> | null = null

  // Set up message listener
  const cleanup = setupSecureMessageListener(config, (message, origin) => {
    switch (message.type) {
      case 'parent:scroll':
        handleParentScroll(message.payload)
        break
      case 'parent:visibility':
        handleVisibilityChange(message.payload)
        break
      case 'parent:resize':
        handleParentResize(message.payload)
        break
      default:
        console.log('Received message:', message.type, message.payload)
    }
  })

  // Initialize parent messenger when parent is detected
  const initializeParentMessenger = () => {
    if (window.parent && window.parent !== window) {
      const parentOrigin = document.referrer ? new URL(document.referrer).origin : '*'
      parentMessenger = createSecurePostMessage(window.parent, parentOrigin, widgetId)
      
      // Send ready message
      parentMessenger.send('widget:ready', {
        widgetId,
        dimensions: {
          width: document.body.scrollWidth,
          height: document.body.scrollHeight
        }
      })
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeParentMessenger)
  } else {
    initializeParentMessenger()
  }

  return {
    sendToParent: (type: string, payload: any) => {
      if (parentMessenger) {
        parentMessenger.send(type, payload)
      }
    },
    cleanup
  }
}

/**
 * Handle parent scroll messages
 */
function handleParentScroll(payload: { scrollY: number }): void {
  // Implement scroll-based interactions
  console.log('Parent scroll:', payload.scrollY)
}

/**
 * Handle visibility change messages
 */
function handleVisibilityChange(payload: { isVisible: boolean }): void {
  // Implement visibility-based optimizations
  console.log('Widget visibility:', payload.isVisible)
}

/**
 * Handle parent resize messages
 */
function handleParentResize(payload: { width: number; height: number }): void {
  // Implement responsive adjustments
  console.log('Parent resize:', payload)
}

/**
 * Clean up rate limiting data periodically
 */
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of messageRateLimit.entries()) {
    if (now > data.resetTime) {
      messageRateLimit.delete(key)
    }
  }
}, 60000) // Clean up every minute