export interface WidgetConfig {
  steps: WidgetStep[]
  showInstantQuote: boolean
  priceDisplay: 'exact' | 'range' | 'hidden'
  showProgressBar?: boolean
  thankYouMessage?: string
  pricingCalculator?: PricingCalculator
}

export interface PricingCalculator {
  basePricing: BasePricing
  modifiers?: PricingModifier[]
  display: PricingDisplay
}

export interface BasePricing {
  service_field: string
  prices: Record<string, ServicePrice>
}

export interface ServicePrice {
  amount: number
  unit: string
  minCharge?: number
}

export interface PricingModifier {
  id: string
  type: 'perUnit' | 'conditional' | 'threshold'
  field: string
  condition?: 'equals' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual'
  value?: any
  calculation: PricingCalculation
}

export interface PricingCalculation {
  operation: 'add' | 'multiply' | 'subtract'
  amount: number
  perUnit?: boolean
}

export interface PricingDisplay {
  showCalculation: boolean
  format: 'fixed' | 'range' | 'minimum'
  rangeMultiplier?: number
}

export interface PricingResult {
  basePrice: number
  modifiers: AppliedModifier[]
  finalPrice: number
  breakdown: PricingBreakdown
}

export interface AppliedModifier {
  id: string
  description: string
  amount: number
  operation: string
}

export interface PricingBreakdown {
  baseAmount: number
  baseUnit: string
  baseQuantity: number
  modifierTotal: number
  subtotal: number
  finalPrice: number
  minChargeApplied?: boolean
}

export interface WidgetStep {
  id: string
  title: string
  components: ComponentConfig[]
}

export interface ComponentConfig {
  type: string
  props: Record<string, unknown>
}

export interface Widget {
  id: string
  business_id: string
  name: string
  embed_key: string
  is_active: boolean
  config: WidgetConfig
}