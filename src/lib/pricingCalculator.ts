import { 
  PricingCalculator, 
  PricingResult, 
  PricingModifier, 
  AppliedModifier,
  PricingBreakdown 
} from '@/types'
import { getDriveTimeCost, DriveTimeCost } from './driveTimeCalculator'

/**
 * Core pricing calculator engine that processes form data against pricing configuration
 */
export async function calculatePrice(
  formData: Record<string, any>, 
  pricingCalculator: PricingCalculator
): Promise<PricingResult> {
  // Step 1: Get base price
  const serviceField = pricingCalculator.basePricing.service_field
  const selectedService = formData[serviceField]
  
  if (!selectedService) {
    return createEmptyResult()
  }
  
  const baseConfig = pricingCalculator.basePricing.prices[selectedService]
  
  if (!baseConfig) {
    return createEmptyResult()
  }
  
  // Get the quantity from form data (e.g., linearFeet, sqft, days)
  const baseQuantity = getQuantityForUnit(formData, baseConfig.unit)
  const basePrice = baseQuantity * baseConfig.amount
  
  // Step 2: Apply each modifier
  const appliedModifiers: AppliedModifier[] = []
  let currentPrice = basePrice
  
  if (pricingCalculator.modifiers) {
    for (const modifier of pricingCalculator.modifiers) {
      const modifierResult = applyModifier(formData, modifier, currentPrice, baseQuantity)
      
      if (modifierResult.applied) {
        appliedModifiers.push({
          id: modifier.id,
          description: generateModifierDescription(modifier, formData),
          amount: modifierResult.amount,
          operation: modifier.calculation.operation
        })
        
        currentPrice = modifierResult.newPrice
      }
    }
  }
  
  // Step 2.5: Apply drive time cost if configured
  let driveTimeCost: DriveTimeCost | null = null
  if (pricingCalculator.driveTime) {
    try {
      driveTimeCost = await getDriveTimeCost(formData, pricingCalculator.driveTime)
      
      if (driveTimeCost && driveTimeCost.cost > 0) {
        appliedModifiers.push({
          id: 'drive_time',
          description: driveTimeCost.description,
          amount: driveTimeCost.cost,
          operation: 'add'
        })
        
        currentPrice += driveTimeCost.cost
      }
    } catch (error) {
      console.error('Drive time calculation failed:', error)
      // Continue without drive time cost
    }
  }
  
  // Step 3: Apply minimum charge
  let finalPrice = currentPrice
  let minChargeApplied = false
  
  if (baseConfig.minCharge && currentPrice < baseConfig.minCharge) {
    finalPrice = baseConfig.minCharge
    minChargeApplied = true
  }
  
  // Calculate modifier total for breakdown
  const modifierTotal = appliedModifiers.reduce((sum, mod) => {
    switch (mod.operation) {
      case 'add':
      case 'subtract':
        return sum + mod.amount
      case 'multiply':
        // For multiply operations, show the percentage change
        return sum + (mod.amount - 1) * basePrice
      default:
        return sum
    }
  }, 0)
  
  return {
    basePrice,
    modifiers: appliedModifiers,
    finalPrice,
    breakdown: {
      baseAmount: baseConfig.amount,
      baseUnit: baseConfig.unit,
      baseQuantity,
      modifierTotal,
      subtotal: currentPrice,
      finalPrice,
      minChargeApplied
    }
  }
}

/**
 * Apply a single modifier to the current price
 */
function applyModifier(
  formData: Record<string, any>,
  modifier: PricingModifier,
  currentPrice: number,
  baseQuantity: number
): { applied: boolean; newPrice: number; amount: number } {
  const fieldValue = formData[modifier.field]
  
  // Check if modifier should be applied
  const shouldApply = shouldApplyModifier(fieldValue, modifier)
  
  if (!shouldApply) {
    return { applied: false, newPrice: currentPrice, amount: 0 }
  }
  
  // Apply the calculation
  let newPrice = currentPrice
  let modifierAmount = 0
  
  switch (modifier.calculation.operation) {
    case 'add':
      if (modifier.calculation.perUnit) {
        const quantity = getModifierQuantity(fieldValue, modifier, baseQuantity)
        modifierAmount = quantity * modifier.calculation.amount
      } else {
        modifierAmount = modifier.calculation.amount
      }
      newPrice = currentPrice + modifierAmount
      break
      
    case 'multiply':
      modifierAmount = modifier.calculation.amount
      newPrice = currentPrice * modifier.calculation.amount
      break
      
    case 'subtract':
      if (modifier.calculation.perUnit) {
        const quantity = getModifierQuantity(fieldValue, modifier, baseQuantity)
        modifierAmount = quantity * modifier.calculation.amount
      } else {
        modifierAmount = modifier.calculation.amount
      }
      newPrice = Math.max(0, currentPrice - modifierAmount)
      break
  }
  
  return { applied: true, newPrice, amount: modifierAmount }
}

/**
 * Determine if a modifier should be applied based on its type and conditions
 */
function shouldApplyModifier(fieldValue: any, modifier: PricingModifier): boolean {
  switch (modifier.type) {
    case 'perUnit':
      return fieldValue > 0
      
    case 'conditional':
    case 'threshold':
      if (!modifier.condition || modifier.value === undefined) {
        return false
      }
      return checkCondition(fieldValue, modifier.condition, modifier.value)
      
    default:
      return false
  }
}

/**
 * Check if a condition is met
 */
function checkCondition(
  fieldValue: any, 
  condition: string, 
  targetValue: any
): boolean {
  switch (condition) {
    case 'equals':
      return fieldValue === targetValue
    case 'greaterThan':
      return Number(fieldValue) > Number(targetValue)
    case 'lessThan':
      return Number(fieldValue) < Number(targetValue)
    case 'greaterThanOrEqual':
      return Number(fieldValue) >= Number(targetValue)
    case 'lessThanOrEqual':
      return Number(fieldValue) <= Number(targetValue)
    default:
      return false
  }
}

/**
 * Get quantity from form data based on unit type
 */
function getQuantityForUnit(formData: Record<string, any>, unit: string): number {
  // Map common unit names to form field names
  const unitFieldMap: Record<string, string[]> = {
    'linear_foot': ['linearFeet', 'linear_feet', 'feet'],
    'linear_feet': ['linearFeet', 'linear_feet', 'feet'],
    'sqft': ['sqft', 'square_feet', 'area'],
    'square_feet': ['sqft', 'square_feet', 'area'],
    'cubic_yard': ['cubic_yards', 'yards'],
    'days': ['days', 'rentalDays', 'duration'],
    'hours': ['hours', 'duration'],
    'units': ['quantity', 'count', 'units']
  }
  
  const possibleFields = unitFieldMap[unit] || [unit]
  
  for (const field of possibleFields) {
    if (formData[field] !== undefined && formData[field] !== null) {
      return Number(formData[field]) || 0
    }
  }
  
  return 0
}

/**
 * Get the quantity to use for modifier calculations
 */
function getModifierQuantity(
  fieldValue: any, 
  modifier: PricingModifier, 
  baseQuantity: number
): number {
  if (modifier.type === 'perUnit') {
    return Number(fieldValue) || 0
  }
  
  if (modifier.type === 'threshold' && modifier.calculation.perUnit) {
    // For threshold modifiers with perUnit, use the excess amount
    const threshold = Number(modifier.value) || 0
    const currentValue = Number(fieldValue) || 0
    return Math.max(0, currentValue - threshold)
  }
  
  return baseQuantity
}

/**
 * Generate a human-readable description for a modifier
 */
function generateModifierDescription(
  modifier: PricingModifier, 
  formData: Record<string, any>
): string {
  const fieldValue = formData[modifier.field]
  
  switch (modifier.type) {
    case 'perUnit':
      return `${modifier.id.replace(/_/g, ' ')} (${fieldValue} units)`
      
    case 'conditional':
      return modifier.id.replace(/_/g, ' ')
      
    case 'threshold':
      const threshold = modifier.value
      return `${modifier.id.replace(/_/g, ' ')} (${fieldValue} > ${threshold})`
      
    default:
      return modifier.id.replace(/_/g, ' ')
  }
}

/**
 * Create an empty result for when no pricing is available
 */
function createEmptyResult(): PricingResult {
  return {
    basePrice: 0,
    modifiers: [],
    finalPrice: 0,
    breakdown: {
      baseAmount: 0,
      baseUnit: '',
      baseQuantity: 0,
      modifierTotal: 0,
      subtotal: 0,
      finalPrice: 0
    }
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Synchronous version of calculatePrice for components that need immediate results
 * Note: This does not include drive time calculations
 */
export function calculatePriceSync(
  formData: Record<string, any>, 
  pricingCalculator: PricingCalculator
): PricingResult {
  // Step 1: Get base price
  const serviceField = pricingCalculator.basePricing.service_field
  const selectedService = formData[serviceField]
  
  if (!selectedService) {
    return createEmptyResult()
  }
  
  const baseConfig = pricingCalculator.basePricing.prices[selectedService]
  
  if (!baseConfig) {
    return createEmptyResult()
  }
  
  // Get the quantity from form data (e.g., linearFeet, sqft, days)
  const baseQuantity = getQuantityForUnit(formData, baseConfig.unit)
  const basePrice = baseQuantity * baseConfig.amount
  
  // Step 2: Apply each modifier (excluding drive time)
  const appliedModifiers: AppliedModifier[] = []
  let currentPrice = basePrice
  
  if (pricingCalculator.modifiers) {
    for (const modifier of pricingCalculator.modifiers) {
      const modifierResult = applyModifier(formData, modifier, currentPrice, baseQuantity)
      
      if (modifierResult.applied) {
        appliedModifiers.push({
          id: modifier.id,
          description: generateModifierDescription(modifier, formData),
          amount: modifierResult.amount,
          operation: modifier.calculation.operation
        })
        
        currentPrice = modifierResult.newPrice
      }
    }
  }
  
  // Step 3: Apply minimum charge
  let finalPrice = currentPrice
  let minChargeApplied = false
  
  if (baseConfig.minCharge && currentPrice < baseConfig.minCharge) {
    finalPrice = baseConfig.minCharge
    minChargeApplied = true
  }
  
  // Calculate modifier total for breakdown
  const modifierTotal = appliedModifiers.reduce((sum, mod) => {
    switch (mod.operation) {
      case 'add':
      case 'subtract':
        return sum + mod.amount
      case 'multiply':
        // For multiply operations, show the percentage change
        return sum + (mod.amount - 1) * basePrice
      default:
        return sum
    }
  }, 0)
  
  return {
    basePrice,
    modifiers: appliedModifiers,
    finalPrice,
    breakdown: {
      baseAmount: baseConfig.amount,
      baseUnit: baseConfig.unit,
      baseQuantity,
      modifierTotal,
      subtotal: currentPrice,
      finalPrice,
      minChargeApplied
    }
  }
}

/**
 * Calculate price range based on display settings
 */
export function calculatePriceRange(
  result: PricingResult,
  rangeMultiplier: number = 1.2
): { min: number; max: number } {
  const min = result.finalPrice
  const max = Math.round(result.finalPrice * rangeMultiplier)
  
  return { min, max }
}