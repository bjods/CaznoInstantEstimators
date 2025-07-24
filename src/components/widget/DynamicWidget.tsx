'use client'

import { useState } from 'react'
import { DynamicComponent } from './DynamicComponent'
import { PersonalInfoStep } from './PersonalInfoStep'
import { PriceCalculator, CompactPriceDisplay } from './PriceCalculator'
import { QuoteStep } from './QuoteStep'
import { WidgetConfig, CTAButton } from '@/types'

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
    address: '',
    name: '' // Combined name field for some components
  })
  const [componentState, setComponentState] = useState<any>(null)

  const updateField = (name: string, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      }
      
      // Update combined name field when firstName or lastName changes
      if (name === 'firstName' || name === 'lastName') {
        const firstName = name === 'firstName' ? value : prev.firstName
        const lastName = name === 'lastName' ? value : prev.lastName
        updated.name = `${firstName} ${lastName}`.trim()
      }
      
      return updated
    })
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
    // Special handling for component-driven navigation
    if (componentState) {
      if (componentState.type === 'measurement_hub' && !componentState.canProceed) {
        // Don't advance if measurements aren't complete
        return
      }
      if (componentState.type === 'service_details_hub' && !componentState.canProceed) {
        // Don't advance if service details aren't complete
        return
      }
    }
    
    // Navigate through config steps and then to quote step if configured
    const maxConfigStep = config.steps.length - 1
    if (currentStep < maxConfigStep) {
      setCurrentStep(currentStep + 1)
      setComponentState(null) // Reset component state for new step
    } else if (currentStep === maxConfigStep && hasQuoteStep) {
      setCurrentStep(config.steps.length) // Move to quote step
      setComponentState(null)
    }
  }

  const getNextButtonText = () => {
    if (componentState) {
      if (componentState.type === 'measurement_hub') {
        if (componentState.allServicesComplete) {
          return 'Continue to Details'
        } else if (componentState.currentServiceIndex < componentState.totalServices - 1) {
          return `Measure Next Service`
        } else {
          return 'Finish Measurements'
        }
      }
      if (componentState.type === 'service_details_hub') {
        if (componentState.allServicesComplete) {
          return 'Continue'
        } else if (componentState.currentServiceIndex < componentState.totalServices - 1) {
          return `Next Service Details`
        } else {
          return 'Complete Details'
        }
      }
    }
    return 'Next'
  }

  const handlePrevious = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Calculate final pricing if pricing calculator is configured
      let pricingBreakdown = null
      if (config.pricingCalculator) {
        const { calculatePrice } = await import('@/lib/pricingCalculator')
        pricingBreakdown = await calculatePrice(formData, config.pricingCalculator)
      }

      const submissionData = {
        formData,
        pricing: pricingBreakdown,
        timestamp: new Date().toISOString(),
        widgetId: config.id // Assuming config has an id field
      }

      console.log('Submitting form data:', submissionData)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (result.success) {
        console.log('Lead submitted successfully:', result.data)
        // You can add success feedback here (e.g., show thank you message)
      } else {
        console.error('Failed to submit lead:', result.error)
        // You can add error feedback here
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // You can add error feedback here
    }
  }

  const handleCTAButtonClick = (button: CTAButton) => {
    switch (button.action) {
      case 'submit':
        handleSubmit()
        break
      case 'phone':
        if (button.config?.phoneNumber) {
          window.location.href = `tel:${button.config.phoneNumber}`
        }
        break
      case 'calendar':
        if (button.config?.calendarUrl) {
          if (button.config.newTab) {
            window.open(button.config.calendarUrl, '_blank')
          } else {
            window.location.href = button.config.calendarUrl
          }
        }
        break
      case 'custom':
        if (button.config?.customUrl) {
          if (button.config.newTab) {
            window.open(button.config.customUrl, '_blank')
          } else {
            window.location.href = button.config.customUrl
          }
        }
        break
      default:
        console.log('Unknown button action:', button.action)
    }
  }

  const completePersonalInfo = () => {
    setCurrentStep(0) // Move to first config step
  }

  // Calculate total steps: personal info + config steps + quote step (if configured)
  const hasQuoteStep = !!config.quoteStep
  const totalSteps = config.steps.length + 1 + (hasQuoteStep ? 1 : 0) // +1 for personal info, +1 for quote step if exists
  const currentStepForProgress = currentStep + 1 // Adjust for display
  const isLastConfigStep = currentStep === config.steps.length - 1
  const isQuoteStep = hasQuoteStep && currentStep === config.steps.length
  const isLastStep = isQuoteStep || (!hasQuoteStep && isLastConfigStep)

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

  // Show quote step if we're at that position
  if (isQuoteStep && config.quoteStep) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with Progress */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-900">{config.quoteStep.title}</h1>
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
          <QuoteStep
            config={config.quoteStep}
            pricingCalculator={config.pricingCalculator}
            formData={formData}
            onButtonClick={handleCTAButtonClick}
          />
        </main>

        {/* Footer with Navigation */}
        <footer className="bg-white border-t border-gray-200 px-6 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={handlePrevious}
              className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Previous
            </button>
            <div></div> {/* Empty div to maintain spacing */}
          </div>
        </footer>
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
            <div className="flex items-center gap-4">
              {/* Show compact price if pricing calculator is configured and showInstantQuote is true */}
              {config.pricingCalculator && config.showInstantQuote && (
                <CompactPriceDisplay 
                  pricingCalculator={config.pricingCalculator}
                  formData={formData}
                />
              )}
              <div className="text-sm text-gray-500">
                Step {currentStepForProgress + 1} of {totalSteps} ({Math.round(((currentStepForProgress + 1) / totalSteps) * 100)}%)
              </div>
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
                  onComponentStateChange={setComponentState}
                />
              </div>
            ))}
          </div>

          {/* Show full price calculator on the last config step (if no quote step) */}
          {isLastConfigStep && !hasQuoteStep && config.pricingCalculator && config.showInstantQuote && (
            <div className="mb-12">
              <PriceCalculator 
                pricingCalculator={config.pricingCalculator}
                formData={formData}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer with Navigation */}
      <footer className="bg-white border-t border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === -1}
            className="px-8 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
          >
            Previous
          </button>

          {(isLastStep && !hasQuoteStep) ? (
            <button
              onClick={handleSubmit}
              className="px-12 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
            >
              Get Quote
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={componentState && !componentState.canProceed}
              className="px-12 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastConfigStep && hasQuoteStep ? 'View Quote' : getNextButtonText()}
            </button>
          )}
        </div>
      </footer>

    </div>
  )
}