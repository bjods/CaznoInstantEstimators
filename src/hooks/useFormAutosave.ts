'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseFormAutosaveProps {
  widgetId: string
  formData: Record<string, any>
  currentStep: string
  submissionFlowConfig?: {
    early_capture: boolean
    autosave_enabled: boolean
    min_fields_for_capture: string[]
  }
  onSubmissionCreated?: (submissionId: string, sessionId: string) => void
}

interface AutosaveState {
  submissionId: string | null
  sessionId: string | null
  status: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null
  error: string | null
}

export function useFormAutosave({
  widgetId,
  formData,
  currentStep,
  submissionFlowConfig,
  onSubmissionCreated
}: UseFormAutosaveProps) {
  const [autosaveState, setAutosaveState] = useState<AutosaveState>({
    submissionId: null,
    sessionId: null,
    status: 'idle',
    lastSaved: null,
    error: null
  })

  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const lastSavedDataRef = useRef<string>('')
  const hasTriggeredEarlyCaptureRef = useRef(false)
  const isSavingRef = useRef(false)

  const saveSubmission = useCallback(async (isEarlyCapture = false) => {
    // Prevent concurrent saves
    if (isSavingRef.current) {
      return
    }

    // Check if autosave is enabled (unless it's early capture)
    if (!submissionFlowConfig?.autosave_enabled && !isEarlyCapture) {
      return
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify({ formData, currentStep })
    if (currentDataString === lastSavedDataRef.current && !isEarlyCapture) {
      return
    }

    isSavingRef.current = true
    setAutosaveState(prev => ({ ...prev, status: 'saving', error: null }))

    try {
      const response = await fetch('/api/submissions/autosave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId,
          sessionId: autosaveState.sessionId,
          formData,
          currentStep,
          isEarlyCapture
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setAutosaveState(prev => ({
          ...prev,
          submissionId: result.data.submissionId,
          sessionId: result.data.sessionId,
          status: 'saved',
          lastSaved: new Date(),
          error: null
        }))

        lastSavedDataRef.current = currentDataString

        if (isEarlyCapture && onSubmissionCreated) {
          onSubmissionCreated(result.data.submissionId, result.data.sessionId)
        }

        if (isEarlyCapture) {
          hasTriggeredEarlyCaptureRef.current = true
        }
      } else {
        if (result.waitForFields) {
          setAutosaveState(prev => ({ ...prev, status: 'idle', error: null }))
        } else {
          setAutosaveState(prev => ({
            ...prev,
            status: 'error',
            error: result.error
          }))
        }
      }
    } catch (error) {
      console.error('Autosave error:', error)
      setAutosaveState(prev => ({
        ...prev,
        status: 'error',
        error: 'Failed to save form data'
      }))
    } finally {
      isSavingRef.current = false
    }
  }, [widgetId, submissionFlowConfig?.autosave_enabled, onSubmissionCreated])

  // Effect to handle form data changes
  useEffect(() => {
    // Skip if already saving
    if (isSavingRef.current) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Check for early capture (only once)
    if (!hasTriggeredEarlyCaptureRef.current && submissionFlowConfig?.early_capture) {
      const hasMinFields = submissionFlowConfig.min_fields_for_capture?.every(
        field => formData[field] && formData[field].toString().trim()
      )

      if (hasMinFields) {
        console.log('Early capture triggered for fields:', submissionFlowConfig.min_fields_for_capture)
        saveSubmission(true)
        return
      }
    }

    // Handle regular autosave (only after early capture is done)
    if (hasTriggeredEarlyCaptureRef.current && submissionFlowConfig?.autosave_enabled) {
      // Debounce the save by 1.5 seconds
      saveTimeoutRef.current = setTimeout(() => {
        saveSubmission(false)
      }, 1500)
    }

    // Cleanup timeout
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData, currentStep])

  const completeSubmission = useCallback(async (
    trigger: 'quote_viewed' | 'meeting_booked' | 'cta_clicked' | 'form_submitted',
    additionalData?: {
      pricing?: any
      appointmentSlot?: any
      ctaButtonId?: string
      [key: string]: any
    }
  ) => {
    if (!autosaveState.submissionId) {
      console.error('Cannot complete submission: no submission ID')
      return { success: false, error: 'No submission to complete' }
    }

    try {
      const response = await fetch('/api/submissions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId: autosaveState.submissionId,
          trigger,
          ...additionalData
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setAutosaveState(prev => ({
          ...prev,
          status: 'saved',
          lastSaved: new Date()
        }))
      }

      return result
    } catch (error) {
      console.error('Submission completion error:', error)
      return { success: false, error: 'Failed to complete submission' }
    }
  }, [autosaveState.submissionId])

  return {
    autosaveState,
    completeSubmission,
    saveSubmission: () => saveSubmission(false)
  }
}