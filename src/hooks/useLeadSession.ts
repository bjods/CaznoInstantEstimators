import { useEffect, useRef, useCallback, useState } from 'react'
import { useDebounce } from './useDebounce'

interface UseLeadSessionProps {
  widgetId: string
  formData: Record<string, any>
  currentStep: string
  onSessionRestored?: (data: Record<string, any>) => void
}

interface SessionData {
  sessionId: string
  lastSaved: number
  formData: Record<string, any>
}

export function useLeadSession({ 
  widgetId, 
  formData, 
  currentStep,
  onSessionRestored 
}: UseLeadSessionProps) {
  const [sessionId, setSessionId] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const hasRestoredRef = useRef(false)

  // Debounced form data for autosave
  const debouncedFormData = useDebounce(formData, 3000)

  // Initialize session
  useEffect(() => {
    const storageKey = `cazno_session_${widgetId}`
    
    // Try to restore existing session
    const storedSession = localStorage.getItem(storageKey)
    if (storedSession && !hasRestoredRef.current) {
      try {
        const parsed: SessionData = JSON.parse(storedSession)
        
        // Check if session is less than 24 hours old
        const isRecent = Date.now() - parsed.lastSaved < 24 * 60 * 60 * 1000
        
        if (isRecent && parsed.formData && Object.keys(parsed.formData).length > 0) {
          setSessionId(parsed.sessionId)
          hasRestoredRef.current = true
          
          // Ask user if they want to restore
          const hasPersonalInfo = parsed.formData.email || parsed.formData.phone
          if (hasPersonalInfo && onSessionRestored) {
            // You could show a modal here asking if they want to continue
            // For now, we'll auto-restore
            onSessionRestored(parsed.formData)
          }
        } else {
          // Create new session
          const newSessionId = crypto.randomUUID()
          setSessionId(newSessionId)
          localStorage.setItem(storageKey, JSON.stringify({
            sessionId: newSessionId,
            lastSaved: Date.now(),
            formData: {}
          }))
        }
      } catch (e) {
        // Create new session on error
        const newSessionId = crypto.randomUUID()
        setSessionId(newSessionId)
      }
    } else if (!sessionId) {
      // Create new session
      const newSessionId = crypto.randomUUID()
      setSessionId(newSessionId)
      localStorage.setItem(storageKey, JSON.stringify({
        sessionId: newSessionId,
        lastSaved: Date.now(),
        formData: {}
      }))
    }
  }, [widgetId, sessionId, onSessionRestored])

  // Save to backend
  const saveToBackend = useCallback(async (
    data: Record<string, any>, 
    stepCompleted: boolean = false
  ) => {
    if (!sessionId || !widgetId) return

    setIsSaving(true)
    
    try {
      const response = await fetch('/api/submissions/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          widgetId,
          formData: data,
          currentStep,
          stepCompleted
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        
        // Update local storage
        const storageKey = `cazno_session_${widgetId}`
        localStorage.setItem(storageKey, JSON.stringify({
          sessionId,
          lastSaved: Date.now(),
          formData: data
        }))
      }
    } catch (error) {
      console.error('Failed to autosave:', error)
    } finally {
      setIsSaving(false)
    }
  }, [sessionId, widgetId, currentStep])

  // Autosave on data change (debounced)
  useEffect(() => {
    if (debouncedFormData && Object.keys(debouncedFormData).length > 0) {
      saveToBackend(debouncedFormData, false)
    }
  }, [debouncedFormData, saveToBackend])

  // Save on step completion
  const saveOnStepComplete = useCallback(() => {
    if (formData && Object.keys(formData).length > 0) {
      saveToBackend(formData, true)
    }
  }, [formData, saveToBackend])

  // Save on page unload
  useEffect(() => {
    const handleUnload = (e: BeforeUnloadEvent) => {
      if (formData && Object.keys(formData).length > 0) {
        // Try to save synchronously (best effort)
        navigator.sendBeacon('/api/submissions/autosave', JSON.stringify({
          sessionId,
          widgetId,
          formData,
          currentStep,
          stepCompleted: false
        }))
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [formData, sessionId, widgetId, currentStep])

  // Save on visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && formData && Object.keys(formData).length > 0) {
        saveToBackend(formData, false)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [formData, saveToBackend])

  // Clear session on completion
  const clearSession = useCallback(() => {
    const storageKey = `cazno_session_${widgetId}`
    localStorage.removeItem(storageKey)
  }, [widgetId])

  return {
    sessionId,
    isSaving,
    lastSaved,
    saveOnStepComplete,
    clearSession,
    saveNow: () => saveToBackend(formData, false)
  }
}