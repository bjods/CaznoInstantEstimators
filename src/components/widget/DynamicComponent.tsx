import { ComponentMap } from '@/components/widget-library'

interface DynamicComponentProps {
  type: string
  props: Record<string, any>
  value: any
  onChange: (value: any) => void
  formData?: Record<string, any>
  onNavigateNext?: () => void
}

export function DynamicComponent({ type, props, value, onChange, formData, onNavigateNext }: DynamicComponentProps) {
  const Component = ComponentMap[type as keyof typeof ComponentMap]
  
  if (!Component) {
    console.error(`Component type "${type}" not found`)
    console.log('Available components:', Object.keys(ComponentMap))
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Unknown component type: {type}</p>
        <p className="text-xs text-gray-500 mt-1">Available: {Object.keys(ComponentMap).join(', ')}</p>
      </div>
    )
  }
  
  // Special handling for components that need address from previous step
  if ((type === 'map_with_drawing' || type === 'area_measurement') && formData) {
    // Look for address in form data - common field names
    const address = formData.address || formData.property_address || formData.location || formData.site_address
    return <Component {...props} value={value} onChange={onChange} address={address} />
  }
  
  // Special handling for measurement hub
  if (type === 'measurement_hub' && formData) {
    const address = formData.address || formData.property_address || formData.location || formData.site_address
    // Find selected services from form data
    const selectedServices = formData.selected_services || formData.services || formData.service_type || []
    const servicesArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices]
    
    return <Component {...props} value={value} onChange={onChange} address={address} selectedServices={servicesArray} onNavigateNext={onNavigateNext} />
  }
  
  // Special handling for service details hub
  if (type === 'service_details_hub' && formData) {
    // Find selected services from form data
    const selectedServices = formData.selected_services || formData.services || formData.service_type || []
    const servicesArray = Array.isArray(selectedServices) ? selectedServices : [selectedServices]
    
    // Extract servicesConfig from props (it's passed in the widget configuration)
    const { servicesConfig, ...otherProps } = props
    
    return <Component {...otherProps} value={value} onChange={onChange} selectedServices={servicesArray} servicesConfig={servicesConfig} onNavigateNext={onNavigateNext} />
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}