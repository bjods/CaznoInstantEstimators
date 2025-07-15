export interface WidgetConfig {
  steps: WidgetStep[]
  showInstantQuote: boolean
  priceDisplay: 'exact' | 'range' | 'hidden'
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