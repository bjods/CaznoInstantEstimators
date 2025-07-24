export interface WidgetConfig {
  id?: string
  steps: WidgetStep[]
  showInstantQuote: boolean
  priceDisplay: 'exact' | 'range' | 'hidden'
  showProgressBar?: boolean
  thankYouMessage?: string
  pricingCalculator?: PricingCalculator
  quoteStep?: QuoteStepConfig
  notifications?: NotificationConfig
  scheduling?: SchedulingConfig
  submissionFlow?: SubmissionFlowConfig
}

export interface NotificationConfig {
  email?: EmailNotificationConfig
  sms?: SMSNotificationConfig
}

export interface EmailNotificationConfig {
  enabled: boolean
  business_emails: string[]
  send_customer_confirmation: boolean
  send_business_alert: boolean
}

export interface SMSNotificationConfig {
  enabled: boolean
  send_lead_captured: boolean
  send_lead_abandoned: boolean
}

export interface QuoteStepConfig {
  title: string
  subtitle?: string
  showDetailedBreakdown: boolean
  ctaButtons: CTAButton[]
}

export interface CTAButton {
  id: string
  text: string
  type: 'primary' | 'secondary'
  action: 'submit' | 'calendar' | 'phone' | 'custom'
  config?: CTAButtonConfig
}

export interface CTAButtonConfig {
  phoneNumber?: string
  calendarUrl?: string
  customUrl?: string
  newTab?: boolean
}

export interface PricingCalculator {
  basePricing: BasePricing
  modifiers?: PricingModifier[]
  driveTime?: DriveTimeConfig
  display: PricingDisplay
}

export interface DriveTimeConfig {
  enabled: boolean
  yardAddress: string
  pricing: DriveTimePricing
  addressField: string
}

export interface DriveTimePricing {
  type: 'perMile' | 'perMinute' | 'tiered'
  rate?: number
  tiers?: DriveTimeTier[]
  freeRadius?: number
  maxDistance?: number
}

export interface DriveTimeTier {
  minDistance: number
  maxDistance?: number
  rate: number
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
  rangeConfig?: PricingRangeConfig
}

export interface PricingRangeConfig {
  type: 'multiplier' | 'percentage'
  lowerBound: number  // For percentage: 85 (means 85%), for multiplier: 0.85
  upperBound: number  // For percentage: 115 (means 115%), for multiplier: 1.15
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

// Calendar and scheduling types
export interface SchedulingConfig {
  enabled: boolean
  mode: 'simple' | 'meeting' // Simple = date ranges only, Meeting = real appointments
  business_hours: BusinessHours
  timezone: string
  max_days_ahead?: number
  min_hours_notice?: number
  
  // Simple mode settings (for rentals, deliveries)
  simple_mode?: {
    allow_date_ranges: boolean // Allow start/end date selection
    min_duration_days?: number // Minimum rental period
    max_duration_days?: number // Maximum rental period
  }
  
  // Meeting mode settings (for consultations, appointments) 
  meeting_mode?: {
    duration: number // minutes per appointment
    buffer: number // minutes between appointments
    google_calendars?: string[] // For availability checking
    primary_calendar?: string // Where meetings get created
    send_calendar_invites: boolean // Send calendar invites to customers
    create_meet_links: boolean // Include Google Meet links in events
  }
}

export interface BusinessHours {
  monday?: BusinessHoursDay | null
  tuesday?: BusinessHoursDay | null
  wednesday?: BusinessHoursDay | null
  thursday?: BusinessHoursDay | null
  friday?: BusinessHoursDay | null
  saturday?: BusinessHoursDay | null
  sunday?: BusinessHoursDay | null
}

export interface BusinessHoursDay {
  start: string // "09:00"
  end: string // "17:00"
}

export interface TimeSlot {
  datetime: Date
  available: boolean
}

export interface SchedulingSelection {
  // For simple mode (date ranges)
  start_date?: string // YYYY-MM-DD
  end_date?: string // YYYY-MM-DD
  
  // For meeting mode (specific appointment)
  appointment_datetime?: string // ISO string
  duration?: number // minutes
  
  // Common
  mode: 'simple' | 'meeting'
  notes?: string
}

// Submission flow configuration
export interface SubmissionFlowConfig {
  early_capture: boolean // Create submission on first page with contact info
  completion_trigger: 'quote_viewed' | 'meeting_booked' | 'cta_clicked' | 'form_submitted'
  autosave_enabled: boolean // Update submission as user progresses
  partial_lead_notifications: boolean // Notify business of incomplete submissions
  min_fields_for_capture: string[] // Required fields to create initial submission (e.g., ['email'])
}