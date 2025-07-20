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
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Unknown component type: {type}</p>
      </div>
    )
  }
  
  // Special handling for MapWithDrawing to pass address from previous step
  if (type === 'map_with_drawing' && formData) {
    // Look for address in form data - common field names
    const address = formData.address || formData.property_address || formData.location || formData.site_address
    // Ensure mode is passed from props
    return <Component {...props} value={value} onChange={onChange} address={address} mode={props.mode} />
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}