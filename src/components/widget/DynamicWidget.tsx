'use client'

import { useState } from 'react'
import { DynamicComponent } from './DynamicComponent'
import { PersonalInfoStep } from './PersonalInfoStep'

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
  const [currentStep, setCurrentStep] = useState(-1) // Start at -1 for personal info step
  const [formData, setFormData] = useState<Record<string, any>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  })

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
      case 'service_selection':
        return []
      case 'map_with_drawing':
        return {
          shapes: [],
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
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    console.log('Submitting form data:', formData)
    // TODO: Submit to API
  }

  const completePersonalInfo = () => {
    setCurrentStep(0) // Move to first config step
  }

  const totalSteps = config.steps.length + 1 // +1 for personal info step
  const currentStepForProgress = currentStep + 1 // Adjust for display
  const isLastStep = currentStep === config.steps.length - 1

  // Show personal info step
  if (currentStep === -1) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with Progress */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Personal Information</h1>
              <div className="text-sm text-gray-500">
                Step 1 of {totalSteps} (14%)
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(1 / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <PersonalInfoStep
            formData={{
              firstName: formData.firstName || '',
              lastName: formData.lastName || '',
              email: formData.email || '',
              phone: formData.phone || '',
              address: formData.address || ''
            }}
            updateField={updateField}
            onComplete={completePersonalInfo}
          />
        </main>
      </div>
    )
  }

  const currentStepConfig = config.steps[currentStep]

  if (!currentStepConfig) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Invalid step configuration</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Progress */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold text-gray-900">{currentStepConfig.title}</h1>
            <div className="text-sm text-gray-500">
              Step {currentStepForProgress + 1} of {totalSteps} ({Math.round(((currentStepForProgress + 1) / totalSteps) * 100)}%)
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepForProgress + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Step Components */}
          <div className="space-y-8 mb-12">
            {currentStepConfig.components.map((component, idx) => (
              <div key={`${currentStep}-${idx}`} className="space-y-4">
                {/* Component Subheading */}
                {(component.props.label || component.props.helpText) && (
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-left">
                    {component.props.label || component.props.helpText}
                  </h2>
                )}
                
                <DynamicComponent
                  type={component.type}
                  props={component.props}
                  value={getFieldValue(component.props.name, component.type)}
                  onChange={(value) => updateField(component.props.name, value)}
                  formData={formData}
                  onNavigateNext={handleNext}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer with Navigation */}
      {/* Hide navigation for measurement and service details steps */}
      {currentStepConfig.id !== 'project-measurement' && currentStepConfig.id !== 'service-details' && (
        <footer className="bg-white border-t border-gray-200 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === -1}
            className="px-8 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Previous
          </button>

          {isLastStep ? (
            <button
              onClick={handleSubmit}
              className="px-12 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
            >
              Get Quote
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-12 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
            >
              Next
            </button>
          )}
        </div>
        </footer>
      )}

    </div>
  )
}