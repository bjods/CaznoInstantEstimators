'use client'

import { useState } from 'react'
import { Widget } from '@/types'
import { DynamicComponent } from './DynamicComponent'

interface DynamicWidgetProps {
  widget: Widget
}

export default function DynamicWidget({ widget }: DynamicWidgetProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string | number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { config } = widget

  const updateField = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setError(null)
      
      const response = await fetch(`/api/widget-config/${widget.embed_key}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: widget.id,
          businessId: widget.business_id,
          formData
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit estimate')
      }
      
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Thank You!
          </h2>
          <p className="text-gray-700">{config.thankYouMessage}</p>
        </div>
      </div>
    )
  }

  const currentStepConfig = config.steps[currentStep]
  const progress = ((currentStep + 1) / config.steps.length) * 100

  return (
    <div className="max-w-2xl mx-auto p-6">
      {config.showProgressBar && (
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300 bg-blue-600"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep + 1} of {config.steps.length}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6">{currentStepConfig.title}</h2>
        
        <div className="space-y-6">
          {currentStepConfig.components.map((component, idx) => (
            <DynamicComponent
              key={`${currentStep}-${idx}`}
              type={component.type}
              props={component.props}
              value={formData[component.props.name as string]}
              onChange={(value) => updateField(component.props.name as string, value)}
            />
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={submitting}
            className="ml-auto px-6 py-2 text-white bg-blue-600 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 
             currentStep === config.steps.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}