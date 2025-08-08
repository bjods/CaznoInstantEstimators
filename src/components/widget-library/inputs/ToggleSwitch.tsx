'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface ToggleSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  helpText?: string
  required?: boolean
}

export function ToggleSwitch({ 
  value = false, 
  onChange, 
  label,
  helpText,
  required
}: ToggleSwitchProps) {
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
      
      <div className="inline-flex gap-3">
        {/* Yes Button */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className="px-8 py-3 font-medium text-lg rounded-xl transition-all duration-200"
          style={value ? {
            backgroundColor: theme.primaryButton,
            color: theme.primaryButtonText,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          } : {
            backgroundColor: theme.secondaryButton,
            color: theme.secondaryButtonText,
            border: `1px solid ${theme.borderColor}`
          }}
          onMouseEnter={(e) => {
            if (value) {
              e.currentTarget.style.backgroundColor = theme.primaryButtonHover
            } else {
              e.currentTarget.style.backgroundColor = theme.secondaryButtonHover
              e.currentTarget.style.borderColor = theme.borderColorLight
            }
          }}
          onMouseLeave={(e) => {
            if (value) {
              e.currentTarget.style.backgroundColor = theme.primaryButton
            } else {
              e.currentTarget.style.backgroundColor = theme.secondaryButton
              e.currentTarget.style.borderColor = theme.borderColor
            }
          }}
        >
          Yes
        </button>
        
        {/* No Button */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className="px-8 py-3 font-medium text-lg rounded-xl transition-all duration-200"
          style={!value ? {
            backgroundColor: theme.primaryButton,
            color: theme.primaryButtonText,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          } : {
            backgroundColor: theme.secondaryButton,
            color: theme.secondaryButtonText,
            border: `1px solid ${theme.borderColor}`
          }}
          onMouseEnter={(e) => {
            if (!value) {
              e.currentTarget.style.backgroundColor = theme.primaryButtonHover
            } else {
              e.currentTarget.style.backgroundColor = theme.secondaryButtonHover
              e.currentTarget.style.borderColor = theme.borderColorLight
            }
          }}
          onMouseLeave={(e) => {
            if (!value) {
              e.currentTarget.style.backgroundColor = theme.primaryButton
            } else {
              e.currentTarget.style.backgroundColor = theme.secondaryButton
              e.currentTarget.style.borderColor = theme.borderColor
            }
          }}
        >
          No
        </button>
      </div>
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
    </div>
  )
}