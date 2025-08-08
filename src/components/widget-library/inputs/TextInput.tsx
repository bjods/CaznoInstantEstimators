'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel'
}

export function TextInput({ 
  value = '', 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  type = 'text'
}: TextInputProps) {
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
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border-2 rounded-lg outline-none transition-colors"
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
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
      
      <style jsx>{`
        input::placeholder {
          color: ${theme.inputPlaceholder};
        }
      `}</style>
    </div>
  )
}