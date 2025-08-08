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
  error?: string
}

export function TextInput({ 
  value = '', 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  type = 'text',
  error
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
      
      <div className="relative">
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2 pr-10 border-2 rounded-lg outline-none transition-colors"
          style={{
            backgroundColor: theme.inputBackground,
            borderColor: error ? theme.errorColor : theme.inputBorder,
            color: theme.inputText,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? theme.errorColor : theme.inputFocusBorder
            e.target.style.boxShadow = `0 0 0 2px ${error ? theme.errorColor : theme.inputFocusBorder}25`
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? theme.errorColor : theme.inputBorder
            e.target.style.boxShadow = 'none'
          }}
        />
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="h-5 w-5" style={{ color: theme.errorColor }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm" style={{ color: theme.errorColor }}>
          {error}
        </p>
      )}
      
      {!error && helpText && (
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