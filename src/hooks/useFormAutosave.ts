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

  const checkEarlyCapture = useCallback(() => {
    if (!submissionFlowConfig?.early_capture || hasTriggeredEarlyCaptureRef.current) {
      return false
    }

    const hasMinFields = submissionFlowConfig.min_fields_for_capture.every(
      field => formData[field] && formData[field].toString().trim()
    )

    return hasMinFields
  }, [formData, submissionFlowConfig])

  const saveSubmission = useCallback(async (isEarlyCapture = false) => {
    if (!submissionFlowConfig?.autosave_enabled && !isEarlyCapture) {
      return
    }

    // Skip if data hasn't changed
    const currentDataString = JSON.stringify({ formData, currentStep })
    if (currentDataString === lastSavedDataRef.current && !isEarlyCapture) {
      return
    }

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

        // Notify parent component if this is the first save
        if (isEarlyCapture && onSubmissionCreated) {
          onSubmissionCreated(result.data.submissionId, result.data.sessionId)
        }

        if (isEarlyCapture) {
          hasTriggeredEarlyCaptureRef.current = true
        }
      } else {
        // Handle case where we're waiting for required fields
        if (result.waitForFields) {
          setAutosaveState(prev => ({ ...prev, status: 'idle', error: null }))
          return
        }

        setAutosaveState(prev => ({
          ...prev,
          status: 'error',
          error: result.error
        }))
      }
    } catch (error) {
      console.error('Autosave error:', error)
      setAutosaveState(prev => ({
        ...prev,
        status: 'error',
        error: 'Failed to save form data'
      }))
    }
  }, [widgetId, formData, currentStep, autosaveState.sessionId, submissionFlowConfig, onSubmissionCreated])

  // Handle early capture when minimum fields are met
  useEffect(() => {
    if (checkEarlyCapture() && !hasTriggeredEarlyCaptureRef.current) {
      console.log('Triggering early capture with minimum fields')
      saveSubmission(true)
    }
  }, [checkEarlyCapture, saveSubmission])

  // Handle regular autosave with debouncing
  useEffect(() => {
    if (!hasTriggeredEarlyCaptureRef.current || !submissionFlowConfig?.autosave_enabled) {
      return
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Set new timeout for debounced save
    saveTimeoutRef.current = setTimeout(() => {
      saveSubmission(false)
    }, 2000) // 2 second debounce

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [formData, currentStep, saveSubmission, submissionFlowConfig])

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