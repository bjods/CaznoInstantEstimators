'use client'

import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface SelectDropdownProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  error?: string
}

export function SelectDropdown({ 
  value = '', 
  onChange, 
  options, 
  label,
  placeholder = "Select an option...",
  helpText,
  required,
  error
}: SelectDropdownProps) {
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
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full px-3 py-2 pr-10 border-2 rounded-lg outline-none transition-colors appearance-none"
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
        >
        <option 
          value="" 
          disabled
          style={{ color: theme.inputPlaceholder }}
        >
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            style={{ 
              backgroundColor: theme.inputBackground,
              color: theme.inputText 
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
          <svg className="h-5 w-5" style={{ color: theme.errorColor }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {/* Dropdown arrow */}
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4" style={{ color: theme.inputText }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
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
    </div>
  )
}