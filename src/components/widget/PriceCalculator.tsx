'use client'

import { useEffect, useState } from 'react'
import { PricingCalculator, PricingResult } from '@/types'
import { calculatePriceSync, formatPrice, calculatePriceRange } from '@/lib/pricingCalculator'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

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
  const theme = useWidgetTheme()
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
          <div className="text-3xl font-bold" style={{ color: theme.successColor }}>
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
          <div className="text-3xl font-bold" style={{ color: theme.successColor }}>
            {formatPrice(min)} - {formatPrice(max)}
          </div>
        )
      }
      
      case 'minimum':
        return (
          <div className="text-3xl font-bold" style={{ color: theme.successColor }}>
            Starting at {formatPrice(finalPrice)}
          </div>
        )
        
      default:
        return (
          <div className="text-3xl font-bold" style={{ color: theme.successColor }}>
            {formatPrice(finalPrice)}
          </div>
        )
    }
  }

  return (
    <div 
      className={`rounded-xl p-6 border-2 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${theme.cardBackground}, ${theme.inputBackground})`,
        borderColor: theme.successColor,
        boxShadow: `0 4px 12px ${theme.successColor}20`
      }}
    >
      <div className="text-center">
        <div className="text-lg mb-2" style={{ color: theme.primaryText }}>
          Your Instant Estimate
        </div>
        
        {renderPrice()}
        
        {/* Price Breakdown */}
        {display.showCalculation && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.borderColor }}>
            <div className="text-sm space-y-2" style={{ color: theme.secondaryText }}>
              
              {/* Base Price */}
              <div className="flex justify-between items-center">
                <span>
                  Base Price ({pricingResult.breakdown.baseQuantity} {pricingResult.breakdown.baseUnit} × {formatPrice(pricingResult.breakdown.baseAmount)})
                </span>
                <span className="font-medium" style={{ color: theme.primaryText }}>
                  {formatPrice(pricingResult.basePrice)}
                </span>
              </div>
              
              {/* Applied Modifiers */}
              {pricingResult.modifiers.map((modifier, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="capitalize">
                    {modifier.description}
                  </span>
                  <span 
                    className="font-medium"
                    style={{
                      color: modifier.operation === 'add' ? theme.errorColor : 
                             modifier.operation === 'subtract' ? theme.successColor :
                             theme.primaryColor
                    }}
                  >
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
                <div className="flex justify-between items-center" style={{ color: theme.errorColor }}>
                  <span>Minimum Charge Applied</span>
                  <span className="font-medium" style={{ color: theme.errorColor }}>
                    {formatPrice(pricingResult.finalPrice)}
                  </span>
                </div>
              )}
              
              {/* Total */}
              <div 
                className="flex justify-between items-center pt-2 border-t font-semibold"
                style={{ 
                  borderColor: theme.borderColor,
                  color: theme.primaryText
                }}
              >
                <span>Total</span>
                <span style={{ color: theme.successColor }}>{formatPrice(pricingResult.finalPrice)}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Disclaimer */}
        <div className="mt-4 text-xs" style={{ color: theme.secondaryText }}>
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
  const theme = useWidgetTheme()
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
    <div 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}
      style={{
        backgroundColor: `${theme.successColor}20`,
        color: theme.successColor,
        border: `1px solid ${theme.successColor}40`
      }}
    >
      <span className="mr-1">💰</span>
      {renderCompactPrice()}
    </div>
  )
}