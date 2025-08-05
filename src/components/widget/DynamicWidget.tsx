'use client'

import { useState, useEffect, useRef } from 'react'
import { DynamicComponent } from './DynamicComponent'
import { PersonalInfoStep } from './PersonalInfoStep'
import { PriceCalculator, CompactPriceDisplay } from './PriceCalculator'
import { QuoteStep } from './QuoteStep'
import QuoteStepDisplay from '../widgets/QuoteStepDisplay'
import { WidgetConfig, CTAButton, SchedulingSelection } from '@/types'
import { useFormAutosave } from '@/hooks/useFormAutosave'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

interface DynamicWidgetProps {
  config: WidgetConfig
  utmData?: Record<string, string>
}

export function DynamicWidget({ config, utmData = {} }: DynamicWidgetProps) {
  const theme = useWidgetTheme()
  
  // Check if widget has personal info built into its steps
  const hasBuiltInPersonalInfo = config.steps.some(step => 
    step.components.some(component => 
      ['email', 'phone', 'full_name', 'business_name', 'firstName', 'lastName'].includes(component.props.name)
    )
  )
  
  // Start at 0 if widget has built-in personal info, otherwise -1
  const [currentStep, setCurrentStep] = useState(hasBuiltInPersonalInfo ? 0 : -1)
  const [formData, setFormData] = useState<Record<string, any>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    name: '' // Combined name field for some components
  })
  const [componentState, setComponentState] = useState<any>(null)
  const quoteCompletionTriggered = useRef(false)

  // Get current step name for tracking
  const getCurrentStepName = () => {
    if (!hasBuiltInPersonalInfo && currentStep === -1) return 'personal_info'
    if (currentStep === config.steps.length) return 'quote'
    return config.steps[currentStep]?.id || `step_${currentStep}`
  }

  // Initialize autosave system
  const { autosaveState, completeSubmission } = useFormAutosave({
    widgetId: config.id || '',
    formData,
    currentStep: getCurrentStepName(),
    utmData,
    submissionFlowConfig: config.submissionFlow || {
      early_capture: true,
      autosave_enabled: true,
      min_fields_for_capture: ['email']
    },
    onSubmissionCreated: (submissionId, sessionId) => {
      console.log('Submission created:', submissionId, 'Session:', sessionId)
    }
  })

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

  const handleMeetingBooked = async (appointment: SchedulingSelection) => {
    try {
      const result = await completeSubmission('meeting_booked', {
        appointment,
        additionalData: { ...formData, appointment }
      })

      if (result.success) {
        console.log('Meeting booking completion triggered:', result.data)
      } else {
        console.error('Failed to complete meeting booking:', result.error)
      }
    } catch (error) {
      console.error('Error completing meeting booking:', error)
    }
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
      case 'scheduling_input':
        return null
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
    
    // Progress saved automatically on step completion
    
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
    const minStep = hasBuiltInPersonalInfo ? 0 : -1
    if (currentStep > minStep) {
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

      // Complete the submission using the new system
      const result = await completeSubmission('form_submitted', {
        pricing: pricingBreakdown,
        additionalData: formData
      })

      if (result.success) {
        console.log('Submission completed successfully:', result.data)
        // You can add success feedback here (e.g., show thank you message)
      } else {
        console.error('Failed to complete submission:', result.error)
        // You can add error feedback here
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // You can add error feedback here
    }
  }

  const handleCTAButtonClick = async (button: CTAButton) => {
    // Complete submission for CTA click
    try {
      const result = await completeSubmission('cta_clicked', {
        ctaButtonId: button.id,
        additionalData: { clickedButton: button.text, buttonAction: button.action }
      })

      if (result.success) {
        console.log('CTA click completion triggered:', result.data)
      }
    } catch (error) {
      console.error('Error completing CTA click:', error)
    }

    // Execute the original button action
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
    setCurrentStep(0) // Move to first config step (only used when hasBuiltInPersonalInfo is false)
  }

  // Calculate total steps: personal info + config steps + quote step (if configured)
  const hasQuoteStep = !!config.quoteStep
  const personalInfoSteps = hasBuiltInPersonalInfo ? 0 : 1 // Only add personal info step if not built-in
  const totalSteps = config.steps.length + personalInfoSteps + (hasQuoteStep ? 1 : 0)
  const currentStepForProgress = hasBuiltInPersonalInfo ? currentStep + 1 : currentStep + 1 // Adjust for display
  const isLastConfigStep = currentStep === config.steps.length - 1
  const isQuoteStep = hasQuoteStep && currentStep === config.steps.length
  const isLastStep = isQuoteStep || (!hasQuoteStep && isLastConfigStep)

  // Trigger quote completion when reaching quote step
  useEffect(() => {
    if (!isQuoteStep || !config.quoteStep) return
    if (quoteCompletionTriggered.current) return
    quoteCompletionTriggered.current = true
    
    const triggerQuoteCompletion = async () => {
      try {
        // Calculate final pricing if pricing calculator is configured
        let pricingBreakdown = null
        if (config.pricingCalculator) {
          const { calculatePrice } = await import('@/lib/pricingCalculator')
          pricingBreakdown = await calculatePrice(formData, config.pricingCalculator)
        }

        // Complete the submission for quote viewing
        const result = await completeSubmission('quote_viewed', {
          pricing: pricingBreakdown,
          additionalData: formData
        })

        if (result.success) {
          console.log('Quote completion triggered successfully:', result.data)
        } else {
          console.error('Failed to trigger quote completion:', result.error)
        }
      } catch (error) {
        console.error('Error triggering quote completion:', error)
      }
    }

    triggerQuoteCompletion()
  }, [isQuoteStep, config.quoteStep, config.pricingCalculator, formData, completeSubmission])

  // Show personal info step (only if not built into widget steps)
  if (!hasBuiltInPersonalInfo && currentStep === -1) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.backgroundColor }}>
        {/* Header with Progress */}
        <header className="px-6 py-4" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold" style={{ color: theme.primaryText }}>Personal Information</h1>
              <div className="text-sm" style={{ color: theme.secondaryText }}>
                Step 1 of {totalSteps} (14%)
              </div>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: theme.progressBackground }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(1 / totalSteps) * 100}%`,
                  backgroundColor: theme.progressFill
                }}
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
    // Calculate pricing data for QuoteStepDisplay
    const calculateQuoteData = () => {
      if (!config.pricingCalculator) {
        return { total: 0, breakdown: [] }
      }

      const serviceField = config.pricingCalculator.basePricing?.service_field || 'selectedServices'
      const selectedServices = formData[serviceField] || []
      const services = Array.isArray(selectedServices) ? selectedServices : [selectedServices]
      const prices = config.pricingCalculator.basePricing?.prices || {}

      let total = 0
      const breakdown = services.map(service => {
        const priceConfig = prices[service]
        if (!priceConfig) return null

        const serviceTotal = priceConfig.amount || 0
        total += serviceTotal

        return {
          service: service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          basePrice: priceConfig.amount || 0,
          options: [], // No options for simple pricing
          total: serviceTotal
        }
      }).filter(Boolean)

      return { total, breakdown }
    }

    const { total, breakdown } = calculateQuoteData()

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.backgroundColor }}>
        {/* Header with Progress */}
        <header className="px-6 py-4" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold" style={{ color: theme.primaryText }}>{config.quoteStep.title}</h1>
              <div className="text-sm" style={{ color: theme.secondaryText }}>
                Step {currentStepForProgress + 1} of {totalSteps} ({Math.round(((currentStepForProgress + 1) / totalSteps) * 100)}%)
              </div>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: theme.progressBackground }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((currentStepForProgress + 1) / totalSteps) * 100}%`,
                  backgroundColor: theme.progressFill
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {config.quoteStep.component === 'QuoteStepDisplay' ? (
            <QuoteStepDisplay
              formData={formData}
              quoteConfig={config.quoteStep.config || {}}
              calculatedTotal={total}
              calculatedBreakdown={breakdown}
              onBack={handlePrevious}
            />
          ) : (
            <div className="px-6 py-8">
              <QuoteStep
                config={config.quoteStep}
                pricingCalculator={config.pricingCalculator}
                formData={formData}
                onButtonClick={handleCTAButtonClick}
              />
            </div>
          )}
        </main>

        {/* Footer with Navigation */}
        <footer className="px-6 py-6" style={{ backgroundColor: theme.cardBackground, borderTop: `1px solid ${theme.borderColor}` }}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={handlePrevious}
              className="px-8 py-3 rounded-lg transition-colors font-medium"
              style={{
                backgroundColor: theme.backgroundColor,
                border: `1px solid ${theme.borderColor}`,
                color: theme.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primaryColor}10`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.backgroundColor
              }}
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
      <div className="p-6 text-center" style={{ backgroundColor: theme.backgroundColor }}>
        <p style={{ color: theme.errorColor }}>Invalid step configuration</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Header with Progress */}
      <header className="px-6 py-4" style={{ backgroundColor: theme.cardBackground, borderBottom: `1px solid ${theme.borderColor}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-semibold" style={{ color: theme.primaryText }}>{currentStepConfig.title}</h1>
            <div className="flex items-center gap-4">
              {/* Show compact price if pricing calculator is configured and showInstantQuote is true */}
              {config.pricingCalculator && config.showInstantQuote && (
                <CompactPriceDisplay 
                  pricingCalculator={config.pricingCalculator}
                  formData={formData}
                />
              )}
              <div className="text-sm" style={{ color: theme.secondaryText }}>
                Step {currentStepForProgress + 1} of {totalSteps} ({Math.round(((currentStepForProgress + 1) / totalSteps) * 100)}%)
              </div>
            </div>
          </div>
          <div className="w-full rounded-full h-2" style={{ backgroundColor: theme.progressBackground }}>
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStepForProgress + 1) / totalSteps) * 100}%`,
                backgroundColor: theme.progressFill
              }}
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
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-left" style={{ color: theme.secondaryText }}>
                    {component.props.label || component.props.helpText}
                  </h2>
                )}
                
                <DynamicComponent
                  type={component.type}
                  props={component.props}
                  value={getFieldValue(component.props.name, component.type)}
                  onChange={(value) => updateField(component.props.name, value)}
                  formData={formData}
                  config={config}
                  onNavigateNext={handleNext}
                  onComponentStateChange={setComponentState}
                  onMeetingBooked={handleMeetingBooked}
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
      <footer className="px-6 py-6" style={{ backgroundColor: theme.cardBackground, borderTop: `1px solid ${theme.borderColor}` }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === (hasBuiltInPersonalInfo ? 0 : -1)}
            className="px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            style={{
              backgroundColor: theme.backgroundColor,
              border: `1px solid ${theme.borderColor}`,
              color: theme.primaryText
            }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = `${theme.primaryColor}10`
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.backgroundColor = theme.backgroundColor
              }
            }}
          >
            Previous
          </button>

          {(isLastStep && !hasQuoteStep) ? (
            <button
              onClick={handleSubmit}
              className="px-12 py-3 rounded-lg transition-colors font-medium text-lg"
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.primaryButtonText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primaryColor}dd`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryColor
              }}
            >
              Get Quote
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={componentState && !componentState.canProceed}
              className="px-12 py-3 rounded-lg transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: theme.primaryColor,
                color: theme.primaryButtonText
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = `${theme.primaryColor}dd`
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = theme.primaryColor
                }
              }}
            >
              {isLastConfigStep && hasQuoteStep ? 'View Quote' : getNextButtonText()}
            </button>
          )}
        </div>
      </footer>

    </div>
  )
}