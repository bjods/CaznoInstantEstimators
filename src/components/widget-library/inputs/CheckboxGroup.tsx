'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface CheckboxGroupProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Array<{ value: string; label: string; description?: string }>
  label?: string
  helpText?: string
  required?: boolean
}

export function CheckboxGroup({ 
  value = [], 
  onChange, 
  options, 
  label,
  helpText,
  required
}: CheckboxGroupProps) {
  const theme = useWidgetTheme()
  
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter(v => v !== optionValue))
    }
  }

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
          <label
            key={option.value}
            className="flex items-start p-4 border rounded-lg cursor-pointer transition-colors"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.borderColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.borderColorLight + '20'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.cardBackground
            }}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="mt-1 mr-4 transition-colors"
              style={{
                accentColor: theme.primaryColor,
              }}
            />
            <div className="flex-1">
              <div 
                className="font-medium"
                style={{ color: theme.primaryText }}
              >
                {option.label}
              </div>
              {option.description && (
                <div 
                  className="text-sm mt-1"
                  style={{ color: theme.secondaryText }}
                >
                  {option.description}
                </div>
              )}
            </div>
          </label>
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