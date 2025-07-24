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
  inventory?: InventoryConfig
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
  business_hours: BusinessHours
  google_calendars?: string[] // For availability checking
  primary_calendar?: string // Where meetings get created
  duration: number // minutes per appointment
  buffer: number // minutes between appointments
  timezone: string
  max_days_ahead?: number
  min_hours_notice?: number
  
  // Feature toggles
  features: {
    inventory_booking: boolean // Track inventory items (bins, equipment)
    meeting_booking: boolean // Create Google Calendar events for meetings
    availability_checking: boolean // Check Google Calendar for conflicts
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

export interface InventoryConfig {
  enabled: boolean
  items: InventoryItem[]
}

export interface InventoryItem {
  id?: string
  type: 'bin' | 'equipment' | 'vehicle' | 'material'
  name: string
  sku?: string
  quantity: number
  metadata?: Record<string, any>
}

export interface TimeSlot {
  datetime: Date
  available: boolean
  inventoryAvailable?: number
}

export interface InventoryBooking {
  id: string
  business_id: string
  widget_id?: string
  submission_id?: string
  inventory_item_id: string
  customer_email?: string
  customer_name?: string
  service_type: string
  start_date: string // YYYY-MM-DD
  end_date?: string // YYYY-MM-DD for multi-day rentals
  quantity: number
  status: 'active' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
}

export interface MeetingEvent {
  id: string
  business_id: string
  widget_id?: string
  submission_id?: string
  google_calendar_id: string
  google_event_id: string
  customer_email?: string
  customer_name?: string
  service_type: string
  appointment_datetime: string
  duration: number
  meet_link?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

// Submission flow configuration
export interface SubmissionFlowConfig {
  early_capture: boolean // Create submission on first page with contact info
  completion_trigger: 'quote_viewed' | 'meeting_booked' | 'cta_clicked' | 'form_submitted'
  autosave_enabled: boolean // Update submission as user progresses
  partial_lead_notifications: boolean // Notify business of incomplete submissions
  min_fields_for_capture: string[] // Required fields to create initial submission (e.g., ['email'])
}