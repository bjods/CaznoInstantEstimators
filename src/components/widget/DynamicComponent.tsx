import { ComponentMap } from '@/components/widget-library'

interface DynamicComponentProps {
  type: string
  props: Record<string, any>
  value: any
  onChange: (value: any) => void
  formData?: Record<string, any>
}

export function DynamicComponent({ type, props, value, onChange, formData }: DynamicComponentProps) {
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
  
  return <Component {...props} value={value} onChange={onChange} />
}