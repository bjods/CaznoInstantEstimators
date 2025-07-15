'use client'

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
    return null
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}