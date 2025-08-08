'use client'

import { KeyboardEvent } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  required?: boolean
  onEnter?: () => void
}

export function EmailInput({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  onEnter
}: EmailInputProps) {
  const theme = useWidgetTheme()
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

  const isValid = !value || isValidEmail(value)

  return (
    <div className="space-y-2">
      <label 
        className="block text-lg font-medium"
        style={{ color: theme.labelText }}
      >
        {label}
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 text-lg border-2 rounded-lg outline-none transition-colors"
        style={{
          backgroundColor: isValid ? theme.inputBackground : `${theme.errorColor}10`,
          borderColor: isValid ? theme.inputBorder : theme.errorColor,
          color: theme.inputText,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.inputFocusBorder
          e.target.style.boxShadow = `0 0 0 2px ${theme.inputFocusBorder}25`
        }}
        onBlur={(e) => {
          e.target.style.borderColor = isValid ? theme.inputBorder : theme.errorColor
          e.target.style.boxShadow = 'none'
        }}
      />
      {!isValid && (
        <p className="text-sm" style={{ color: theme.errorColor }}>
          Please enter a valid email address
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