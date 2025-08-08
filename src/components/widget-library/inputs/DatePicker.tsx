'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  helpText?: string
  required?: boolean
  min?: string
  max?: string
}

export function DatePicker({ 
  value = '', 
  onChange, 
  label,
  helpText,
  required,
  min,
  max
}: DatePickerProps) {
  const theme = useWidgetTheme()
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className="block text-sm font-medium"
          style={{ color: theme.labelText }}
        >
          {label}
        </label>
      )}
      
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        max={max}
        className="w-full px-3 py-2 border-2 rounded-lg outline-none transition-colors"
        style={{
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.inputText,
          colorScheme: theme.backgroundColor === '#000000' ? 'dark' : 'light'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.inputFocusBorder
          e.target.style.boxShadow = `0 0 0 2px ${theme.inputFocusBorder}25`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.inputBorder
          e.target.style.boxShadow = 'none'
        }}
      />
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
      
      {(min || max) && (
        <p className="text-xs" style={{ color: theme.secondaryText }}>
          {min && max ? `Range: ${min} to ${max}` : min ? `From: ${min}` : `Until: ${max}`}
        </p>
      )}
    </div>
  )
}