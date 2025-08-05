'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  rows?: number
  maxLength?: number
}

export function TextArea({ 
  value = '', 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  rows = 4,
  maxLength
}: TextAreaProps) {
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
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border-2 rounded-lg outline-none transition-colors resize-vertical"
        style={{
          backgroundColor: theme.inputBackground,
          borderColor: theme.inputBorder,
          color: theme.inputText,
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
      
      <div className="flex justify-between items-center">
        {helpText && (
          <p className="text-sm" style={{ color: theme.secondaryText }}>
            {helpText}
          </p>
        )}
        {maxLength && (
          <p className="text-xs" style={{ color: theme.secondaryText }}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
      
      <style jsx>{`
        textarea::placeholder {
          color: ${theme.inputPlaceholder};
        }
      `}</style>
    </div>
  )
}