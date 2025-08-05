'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  label?: string
  helpText?: string
  required?: boolean
}

export function RadioGroup({ 
  value, 
  onChange, 
  options, 
  label,
  helpText,
  required
}: RadioGroupProps) {
  const theme = useWidgetTheme()
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className="block text-sm font-medium"
          style={{ color: theme.labelText }}
        >
          {label}
          {required && <span style={{ color: theme.errorColor }}> *</span>}
        </label>
      )}
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className="w-full text-left p-4 rounded-lg transition-all border-2 font-medium"
            style={{
              backgroundColor: value === option.value ? theme.primaryColor + '20' : theme.cardBackground,
              borderColor: value === option.value ? theme.primaryColor : theme.borderColor,
              color: value === option.value ? theme.primaryColor : theme.primaryText,
            }}
            onMouseEnter={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.borderColor = theme.borderColorLight
              }
            }}
            onMouseLeave={(e) => {
              if (value !== option.value) {
                e.currentTarget.style.borderColor = theme.borderColor
              }
            }}
          >
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div 
                className="text-sm mt-1"
                style={{ 
                  color: value === option.value ? theme.primaryColor : theme.secondaryText 
                }}
              >
                {option.description}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
    </div>
  )
}