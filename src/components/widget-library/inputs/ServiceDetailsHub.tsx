'use client'

import { useState, useEffect } from 'react'
import { DynamicComponent } from '../../widget/DynamicComponent'

interface ServiceQuestion {
  type: string
  props: Record<string, any>
}

interface ServiceConfig {
  display_name: string
  icon?: string
  questions: ServiceQuestion[]
}

export interface ServiceDetailsHubProps {
  value: Record<string, Record<string, any>>
  onChange: (value: ServiceDetailsHubProps['value']) => void
  selectedServices: string[]
  servicesConfig: Record<string, ServiceConfig>
  label?: string
  helpText?: string
  required?: boolean
}

export function ServiceDetailsHub({
  value = {},
  onChange,
  selectedServices,
  servicesConfig,
  label,
  helpText,
  required
}: ServiceDetailsHubProps) {
  const [activeService, setActiveService] = useState<string>(selectedServices[0] || '')
  const [tempAnswers, setTempAnswers] = useState<Record<string, any>>({})

  // Set initial active service
  useEffect(() => {
    if (!activeService && selectedServices.length > 0) {
      const firstService = selectedServices[0]
      setActiveService(firstService)
    }
  }, [selectedServices, activeService])

  const currentServiceConfig = servicesConfig[activeService]
  const serviceAnswers = value[activeService] || {}

  const handleServiceSwitch = (service: string) => {
    // Save current temp answers before switching
    if (Object.keys(tempAnswers).length > 0) {
      onChange({
        ...value,
        [activeService]: {
          ...serviceAnswers,
          ...tempAnswers
        }
      })
    }
    
    setActiveService(service)
    setTempAnswers({})
  }

  const handleQuestionChange = (questionName: string, questionValue: any) => {
    setTempAnswers(prev => ({
      ...prev,
      [questionName]: questionValue
    }))
  }

  const handleCompleteService = () => {
    // Save answers for current service
    onChange({
      ...value,
      [activeService]: {
        ...serviceAnswers,
        ...tempAnswers
      }
    })
    
    setTempAnswers({})
    
    // Auto-advance to next service if available
    const currentIndex = selectedServices.indexOf(activeService)
    if (currentIndex < selectedServices.length - 1) {
      setActiveService(selectedServices[currentIndex + 1])
    }
  }

  const getQuestionValue = (questionName: string, componentType: string) => {
    // Check temp answers first, then saved answers
    if (tempAnswers[questionName] !== undefined) {
      return tempAnswers[questionName]
    }
    if (serviceAnswers[questionName] !== undefined) {
      return serviceAnswers[questionName]
    }
    
    // Set default values based on component type
    switch (componentType) {
      case 'checkbox_group':
      case 'service_selection':
        return []
      case 'toggle_switch':
        return false
      case 'slider_input':
        return 1000
      case 'file_upload':
        return null
      default:
        return ''
    }
  }

  const isServiceComplete = (service: string) => {
    const config = servicesConfig[service]
    const answers = value[service] || {}
    
    if (!config?.questions) return true
    
    // Check if all required questions are answered
    return config.questions.every(question => {
      const questionName = question.props.name
      const isRequired = question.props.required !== false
      const answer = answers[questionName]
      
      if (!isRequired) return true
      
      // Check if answer exists and is not empty
      if (answer === undefined || answer === null) return false
      if (typeof answer === 'string' && answer.trim() === '') return false
      if (Array.isArray(answer) && answer.length === 0) return false
      
      return true
    })
  }

  const allQuestionsAnswered = currentServiceConfig?.questions?.every(question => {
    const questionName = question.props.name
    const isRequired = question.props.required !== false
    const currentValue = getQuestionValue(questionName, question.type)
    
    if (!isRequired) return true
    
    if (currentValue === undefined || currentValue === null) return false
    if (typeof currentValue === 'string' && currentValue.trim() === '') return false
    if (Array.isArray(currentValue) && currentValue.length === 0) return false
    
    return true
  }) ?? true

  // If no services selected, show message
  if (selectedServices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-2">❓</div>
        <p className="text-lg text-gray-700">No services selected for details</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {label && (
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          {label}
          
        </h3>
      )}

      {helpText && (
        <p className="text-lg text-gray-600 text-center">{helpText}</p>
      )}

      {/* Service Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {selectedServices.map(service => {
          const config = servicesConfig[service]
          const isActive = service === activeService
          const isComplete = isServiceComplete(service)

          return (
            <button
              key={service}
              type="button"
              onClick={() => handleServiceSwitch(service)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-500 shadow-lg'
                  : isComplete
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <span className="flex items-center gap-2 justify-center">
                  {config.icon && <span className="text-lg">{config.icon}</span>}
                  {config.display_name}
                  {isComplete && <span>✓</span>}
                </span>
                <span className="text-xs block mt-1">
                  {isComplete ? (
                    <span className="text-green-600">Complete</span>
                  ) : (
                    <span className="text-orange-600">Needs details</span>
                  )}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Current Service Content */}
      {currentServiceConfig && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {currentServiceConfig.display_name} Details
          </h4>

          {/* Service Questions */}
          {currentServiceConfig.questions && currentServiceConfig.questions.length > 0 ? (
            <div className="space-y-6 mb-8">
              {currentServiceConfig.questions.map((question, idx) => (
                <DynamicComponent
                  key={`${activeService}-${question.props.name}-${idx}`}
                  type={question.type}
                  props={question.props}
                  value={getQuestionValue(question.props.name, question.type)}
                  onChange={(questionValue) => handleQuestionChange(question.props.name, questionValue)}
                  formData={{}} // We don't need form data context for service details
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-2">✅</div>
              <p className="text-lg text-gray-700">No additional details needed for {currentServiceConfig.display_name}</p>
            </div>
          )}

          {/* Complete Service Button */}
          {currentServiceConfig.questions && currentServiceConfig.questions.length > 0 && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleCompleteService}
                disabled={!allQuestionsAnswered}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  allQuestionsAnswered
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedServices.indexOf(activeService) === selectedServices.length - 1 
                  ? 'Complete Details' 
                  : 'Save & Continue'
                }
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress Summary */}
      {selectedServices.length > 1 && (
        <div className="text-center text-sm text-gray-600">
          {selectedServices.filter(s => isServiceComplete(s)).length} of {selectedServices.length} services completed
        </div>
      )}
    </div>
  )
}