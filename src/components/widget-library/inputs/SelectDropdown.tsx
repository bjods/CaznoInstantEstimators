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
}

export function SelectDropdown({ 
  value = '', 
  onChange, 
  options, 
  label,
  placeholder = "Select an option...",
  helpText,
  required
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
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
    </div>
  )
}