'use client'

import { useEffect, useRef, useCallback } from 'react'

interface PostMessageConfig {
  widgetId: string
  allowedOrigins?: string[]
  debug?: boolean
}

interface MessagePayload {
  widgetId: string
  [key: string]: any
}

export function usePostMessage({ widgetId, allowedOrigins = [], debug = false }: PostMessageConfig) {
  const sentMessages = useRef<Map<string, number>>(new Map())
  const messageQueue = useRef<Array<{ type: string, payload: MessagePayload }>>([])
  const rateLimitWindow = 60 * 1000 // 1 minute
  const maxMessages = {
    'cazno:widget:resize': 10,
    'cazno:form:submitted': 5,
    'cazno:widget:ready': 1
  }

  // Rate limiting check
  const checkRateLimit = useCallback((messageType: string): boolean => {
    const now = Date.now()
    const messageKey = `${messageType}:${Math.floor(now / rateLimitWindow)}`
    const currentCount = sentMessages.current.get(messageKey) || 0
    const limit = maxMessages[messageType as keyof typeof maxMessages] || 10

    if (currentCount >= limit) {
      if (debug) console.warn(`Rate limit exceeded for message type: ${messageType}`)
      return false
    }

    sentMessages.current.set(messageKey, currentCount + 1)
    return true
  }, [debug, rateLimitWindow])

  // Clean up old rate limit entries
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      const cutoff = now - rateLimitWindow * 2
      
      for (const [key, _] of sentMessages.current) {
        const timestamp = parseInt(key.split(':')[1]) * rateLimitWindow
        if (timestamp < cutoff) {
          sentMessages.current.delete(key)
        }
      }
    }, rateLimitWindow)

    return () => clearInterval(cleanup)
  }, [rateLimitWindow])

  const sendMessage = useCallback((type: string, payload: MessagePayload) => {
    // Only send messages if we're in an iframe
    if (window.self === window.top) {
      if (debug) console.log('Not in iframe, skipping message:', type)
      return
    }

    // Check rate limiting
    if (!checkRateLimit(type)) {
      return
    }

    const message = {
      type,
      payload: {
        ...payload,
        widgetId,
        timestamp: Date.now()
      }
    }

    try {
      // Send to all allowed origins, or to all if none specified
      if (allowedOrigins.length > 0) {
        allowedOrigins.forEach(origin => {
          window.parent.postMessage(message, origin)
        })
      } else {
        // Send to parent with wildcard (less secure but works for testing)
        window.parent.postMessage(message, '*')
      }

      if (debug) console.log('Sent message:', message)
    } catch (error) {
      console.error('Failed to send PostMessage:', error)
    }
  }, [widgetId, allowedOrigins, checkRateLimit, debug])

  // Height monitoring
  const sendHeightUpdate = useCallback((height: number) => {
    sendMessage('cazno:widget:resize', {
      height,
      widgetId
    })
  }, [sendMessage, widgetId])

  // Form submission notification
  const sendFormSubmitted = useCallback((submissionData: any) => {
    sendMessage('cazno:form:submitted', {
      success: true,
      submissionId: submissionData.submissionId,
      hasQuote: !!submissionData.pricing,
      widgetId
    })
  }, [sendMessage, widgetId])

  // Widget ready notification
  const sendWidgetReady = useCallback((initialHeight: number) => {
    sendMessage('cazno:widget:ready', {
      initialHeight,
      widgetId
    })
  }, [sendMessage, widgetId])

  return {
    sendHeightUpdate,
    sendFormSubmitted,
    sendWidgetReady,
    sendMessage
  }
}