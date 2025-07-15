'use client'

import { ComponentMap } from '@/components/widget-library'

interface DynamicComponentProps {
  type: string
  props: Record<string, unknown>
  value: string | number
  onChange: (value: string | number) => void
}

export function DynamicComponent({ type, props, value, onChange }: DynamicComponentProps) {
  const Component = ComponentMap[type as keyof typeof ComponentMap]
  
  if (!Component) {
    console.error(`Component type "${type}" not found`)
    return null
  }
  
  return <Component {...props} value={value} onChange={onChange} />
}