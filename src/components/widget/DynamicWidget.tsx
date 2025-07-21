'use client'

import { useState } from 'react'
import { DynamicComponent } from './DynamicComponent'

interface WidgetStep {
  id: string
  title: string
  components: Array<{
    type: string
    props: Record<string, any>
  }>
}

interface WidgetConfig {
  steps: WidgetStep[]
  priceDisplay?: string
  thankYouMessage?: string
  showInstantQuote?: boolean
}

interface DynamicWidgetProps {
  config: WidgetConfig
}

export function DynamicWidget({ config }: DynamicWidgetProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getFieldValue = (name: string, componentType: string) => {
    if (formData[name] !== undefined) {
      return formData[name]
    }
    
    // Set default values based on component type
    switch (componentType) {
      case 'checkbox_group':
        return []
      case 'map_with_drawing':
        return {
          coordinates: [],
          measurements: {}
        }
      case 'toggle_switch':
        return false
      case 'slider_input':
        return 1000
      case 'file_upload':
        return null
      case 'area_measurement':
        return 0
      default:
        return ''
    }
  }

  const handleNext = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData)
    // TODO: Submit to API
  }

  const currentStepConfig = config.steps[currentStep]
  const isLastStep = currentStep === config.steps.length - 1

  if (!currentStepConfig) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Invalid step configuration</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep + 1} of {config.steps.length}</span>
          <span>{Math.round(((currentStep + 1) / config.steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / config.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{currentStepConfig.title}</h2>

      {/* Step Components */}
      <div className="space-y-6 mb-8">
        {currentStepConfig.components.map((component, idx) => (
          <DynamicComponent
            key={`${currentStep}-${idx}`}
            type={component.type}
            props={component.props}
            value={getFieldValue(component.props.name, component.type)}
            onChange={(value) => updateField(component.props.name, value)}
            formData={formData}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        {isLastStep ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Get Quote
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Next
          </button>
        )}
      </div>

      {/* Debug Info - Remove in production */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium mb-2">Form Data (Debug):</h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}