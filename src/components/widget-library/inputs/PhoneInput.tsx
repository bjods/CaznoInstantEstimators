'use client'

import { KeyboardEvent } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  required?: boolean
  onEnter?: () => void
}

export function PhoneInput({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  onEnter
}: PhoneInputProps) {
  const theme = useWidgetTheme()
  
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '')
    
    // Handle different lengths
    if (cleaned.length === 0) return ''
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    if (cleaned.length <= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    // Handle 11 digits (with country code)
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`
    }
    // Limit to 10 digits for North American numbers
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  const isValidPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))
  }

  const handleChange = (newValue: string) => {
    const formatted = formatPhoneNumber(newValue)
    onChange(formatted)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

  const isValid = !value || isValidPhoneNumber(value)

  return (
    <div className="space-y-2">
      <label 
        className="block text-lg font-medium"
        style={{ color: theme.labelText }}
      >
        {label}
        {required && <span style={{ color: theme.errorColor }}> *</span>}
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
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
          Please enter a valid phone number
        </p>
      )}
      <p className="text-sm" style={{ color: theme.secondaryText }}>
        Format: (555) 123-4567
      </p>
      <style jsx>{`
        input::placeholder {
          color: ${theme.inputPlaceholder};
        }
      `}</style>
    </div>
  )
}