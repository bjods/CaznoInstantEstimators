import { ComponentMap } from '@/components/widget-library'

interface DynamicComponentProps {
  type: string
  props: Record<string, any>
  value: any
  onChange: (value: any) => void
}

export function DynamicComponent({ type, props, value, onChange }: DynamicComponentProps) {
  const Component = ComponentMap[type as keyof typeof ComponentMap]
  
  if (!Component) {
    console.error(`Component type "${type}" not found`)
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Unknown component type: {type}</p>
      </div>
    )
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}