'use client'

import { useEffect, useState } from 'react'
import { QuoteStepConfig, PricingCalculator, CTAButton, PricingResult } from '@/types'
import { calculatePrice, formatPrice, calculatePriceRange } from '@/lib/pricingCalculator'

interface QuoteStepProps {
  config: QuoteStepConfig
  pricingCalculator?: PricingCalculator
  formData: Record<string, any>
  onButtonClick: (button: CTAButton) => void
}

export function QuoteStep({ 
  config, 
  pricingCalculator, 
  formData, 
  onButtonClick 
}: QuoteStepProps) {
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate pricing if available (async version to include drive time)
  useEffect(() => {
    if (!pricingCalculator) {
      setPricingResult(null)
      return
    }

    setIsCalculating(true)
    calculatePrice(formData, pricingCalculator)
      .then(result => {
        setPricingResult(result)
        setIsCalculating(false)
      })
      .catch(error => {
        console.error('Price calculation failed:', error)
        setIsCalculating(false)
      })
  }, [formData, pricingCalculator])

  const renderPriceDisplay = () => {
    if (isCalculating) {
      return (
        <div className="text-center py-8">
          <div className="text-2xl font-bold text-gray-700">Calculating...</div>
          <p className="text-gray-600 mt-2">Including drive time and all options</p>
        </div>
      )
    }

    if (!pricingResult || !pricingCalculator) {
      return (
        <div className="text-center py-8">
          <div className="text-2xl font-bold text-gray-700">Custom Quote</div>
          <p className="text-gray-600 mt-2">We'll provide a detailed estimate based on your requirements</p>
        </div>
      )
    }

    const { display } = pricingCalculator
    const { finalPrice } = pricingResult

    // Calculate display price based on format
    const renderPrice = () => {
      switch (display.format) {
        case 'fixed':
          return (
            <div className="text-4xl font-bold text-green-600">
              {formatPrice(finalPrice)}
            </div>
          )
          
        case 'range': {
          const { min, max } = calculatePriceRange(
            pricingResult, 
            display.rangeMultiplier || 1.2,
            display.rangeConfig
          )
          return (
            <div className="text-4xl font-bold text-green-600">
              {formatPrice(min)} - {formatPrice(max)}
            </div>
          )
        }
        
        case 'minimum':
          return (
            <div className="text-4xl font-bold text-green-600">
              Starting at {formatPrice(finalPrice)}
            </div>
          )
          
        default:
          return (
            <div className="text-4xl font-bold text-green-600">
              {formatPrice(finalPrice)}
            </div>
          )
      }
    }

    return (
      <div className="text-center mb-8">
        <div className="mb-2">
          <span className="text-lg text-gray-700">Your Estimate</span>
        </div>
        {renderPrice()}
        <div className="text-sm text-gray-500 mt-2">
          * Final price may vary based on site conditions
        </div>
      </div>
    )
  }

  const renderDetailedBreakdown = () => {
    if (!config.showDetailedBreakdown || !pricingResult || !pricingCalculator) {
      return null
    }

    return (
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
        
        <div className="space-y-3">
          {/* Base Price */}
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">
              Base Price ({pricingResult.breakdown.baseQuantity} {pricingResult.breakdown.baseUnit} × {formatPrice(pricingResult.breakdown.baseAmount)})
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(pricingResult.basePrice)}
            </span>
          </div>
          
          {/* Applied Modifiers */}
          {pricingResult.modifiers.map((modifier, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="text-gray-700 capitalize">
                {modifier.description}
              </span>
              <span className={`font-medium ${
                modifier.operation === 'add' ? 'text-orange-600' : 
                modifier.operation === 'subtract' ? 'text-green-600' :
                'text-blue-600'
              }`}>
                {modifier.operation === 'add' && '+'}
                {modifier.operation === 'subtract' && '-'}
                {modifier.operation === 'multiply' && '×'}
                {modifier.operation === 'multiply' ? 
                  `${modifier.amount}` : 
                  formatPrice(Math.abs(modifier.amount))
                }
              </span>
            </div>
          ))}
          
          {/* Minimum Charge Applied */}
          {pricingResult.breakdown.minChargeApplied && (
            <div className="flex justify-between items-center py-2">
              <span className="text-orange-600">Minimum Charge Applied</span>
              <span className="font-medium text-orange-600">
                {formatPrice(pricingResult.finalPrice)}
              </span>
            </div>
          )}
          
          {/* Total */}
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(pricingResult.finalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderServiceSummary = () => {
    // Show a summary of selected services and key details
    const serviceField = pricingCalculator?.basePricing.service_field
    const selectedService = serviceField ? formData[serviceField] : null
    
    // Handle both single service and multi-service selections
    const services = Array.isArray(selectedService) ? selectedService : [selectedService].filter(Boolean)
    
    if (services.length === 0) {
      return null
    }

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Summary</h3>
        
        <div className="space-y-3">
          {/* Selected Services */}
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Services</span>
            <div className="mt-1">
              {services.map((service, index) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2 mb-2">
                  {service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
          
          {/* Key Measurements */}
          {(formData.linearFeet || formData.sqft || formData.rentalDays) && (
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Measurements</span>
              <div className="mt-1 space-y-1">
                {formData.linearFeet && (
                  <div className="text-gray-700">{formData.linearFeet} linear feet</div>
                )}
                {formData.sqft && (
                  <div className="text-gray-700">{formData.sqft} square feet</div>
                )}
                {formData.rentalDays && (
                  <div className="text-gray-700">{formData.rentalDays} days</div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Options */}
          {(formData.gateCount > 0 || formData.hasdifficultAccess || formData.needsPrepWork || formData.wasteType) && (
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Additional Options</span>
              <div className="mt-1 space-y-1">
                {formData.gateCount > 0 && (
                  <div className="text-gray-700">{formData.gateCount} gate{formData.gateCount > 1 ? 's' : ''}</div>
                )}
                {formData.hasdifficultAccess && (
                  <div className="text-gray-700">Difficult access</div>
                )}
                {formData.needsPrepWork && (
                  <div className="text-gray-700">Site preparation required</div>
                )}
                {formData.wasteType && (
                  <div className="text-gray-700">Waste type: {formData.wasteType.replace(/_/g, ' ')}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCTAButtons = () => {
    return (
      <div className="space-y-4">
        {config.ctaButtons.map((button, index) => (
          <button
            key={button.id}
            onClick={() => onButtonClick(button)}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
              button.type === 'primary'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50'
            }`}
          >
            {button.text}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {config.title}
        </h1>
        {config.subtitle && (
          <p className="text-lg text-gray-600">
            {config.subtitle}
          </p>
        )}
      </div>

      {/* Price Display */}
      {renderPriceDisplay()}

      {/* Service Summary */}
      {renderServiceSummary()}

      {/* Detailed Breakdown */}
      {renderDetailedBreakdown()}

      {/* CTA Buttons */}
      {renderCTAButtons()}

      {/* Footer Note */}
      <div className="text-center mt-8 text-sm text-gray-500">
        This estimate is valid for 30 days. Final pricing may vary based on site conditions and material availability.
      </div>
    </div>
  )
}