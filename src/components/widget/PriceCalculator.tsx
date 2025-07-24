'use client'

import { useEffect, useState } from 'react'
import { PricingCalculator, PricingResult } from '@/types'
import { calculatePriceSync, formatPrice, calculatePriceRange } from '@/lib/pricingCalculator'

interface PriceCalculatorProps {
  pricingCalculator: PricingCalculator
  formData: Record<string, any>
  className?: string
}

export function PriceCalculator({ 
  pricingCalculator, 
  formData, 
  className = '' 
}: PriceCalculatorProps) {
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Calculate price whenever form data changes (sync version for real-time display)
    const result = calculatePriceSync(formData, pricingCalculator)
    setPricingResult(result)
    
    // Show price if we have a valid calculation
    setIsVisible(result.finalPrice > 0)
  }, [formData, pricingCalculator])

  if (!isVisible || !pricingResult) {
    return null
  }

  const { display } = pricingCalculator
  const { finalPrice } = pricingResult

  // Calculate display price based on format
  const renderPrice = () => {
    switch (display.format) {
      case 'fixed':
        return (
          <div className="text-3xl font-bold text-green-600">
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
          <div className="text-3xl font-bold text-green-600">
            {formatPrice(min)} - {formatPrice(max)}
          </div>
        )
      }
      
      case 'minimum':
        return (
          <div className="text-3xl font-bold text-green-600">
            Starting at {formatPrice(finalPrice)}
          </div>
        )
        
      default:
        return (
          <div className="text-3xl font-bold text-green-600">
            {formatPrice(finalPrice)}
          </div>
        )
    }
  }

  return (
    <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 ${className}`}>
      <div className="text-center">
        <div className="text-lg text-gray-700 mb-2">
          Your Instant Estimate
        </div>
        
        {renderPrice()}
        
        {/* Price Breakdown */}
        {display.showCalculation && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-2">
              
              {/* Base Price */}
              <div className="flex justify-between items-center">
                <span>
                  Base Price ({pricingResult.breakdown.baseQuantity} {pricingResult.breakdown.baseUnit} × {formatPrice(pricingResult.breakdown.baseAmount)})
                </span>
                <span className="font-medium">
                  {formatPrice(pricingResult.basePrice)}
                </span>
              </div>
              
              {/* Applied Modifiers */}
              {pricingResult.modifiers.map((modifier, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="capitalize">
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
                <div className="flex justify-between items-center text-orange-600">
                  <span>Minimum Charge Applied</span>
                  <span className="font-medium">
                    {formatPrice(pricingResult.finalPrice)}
                  </span>
                </div>
              )}
              
              {/* Total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold text-gray-800">
                <span>Total</span>
                <span>{formatPrice(pricingResult.finalPrice)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-4 text-xs text-gray-500">
          * Final price may vary based on site conditions and additional requirements
        </div>
      </div>
    </div>
  )
}

// Compact version for displaying in step progress
export function CompactPriceDisplay({ 
  pricingCalculator, 
  formData, 
  className = '' 
}: PriceCalculatorProps) {
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null)

  useEffect(() => {
    const result = calculatePriceSync(formData, pricingCalculator)
    setPricingResult(result)
  }, [formData, pricingCalculator])

  if (!pricingResult || pricingResult.finalPrice === 0) {
    return null
  }

  const { display } = pricingCalculator
  const { finalPrice } = pricingResult

  const renderCompactPrice = () => {
    switch (display.format) {
      case 'range': {
        const { min, max } = calculatePriceRange(
          pricingResult, 
          display.rangeMultiplier || 1.2,
          display.rangeConfig
        )
        return `${formatPrice(min)} - ${formatPrice(max)}`
      }
      case 'minimum':
        return `From ${formatPrice(finalPrice)}`
      default:
        return formatPrice(finalPrice)
    }
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium ${className}`}>
      <span className="mr-1">💰</span>
      {renderCompactPrice()}
    </div>
  )
}