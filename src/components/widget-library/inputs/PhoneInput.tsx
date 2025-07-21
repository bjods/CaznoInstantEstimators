'use client'

import { KeyboardEvent } from 'react'

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
      <label className="block text-lg font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${
          isValid 
            ? 'border-gray-300' 
            : 'border-red-300 bg-red-50'
        }`}
      />
      {!isValid && (
        <p className="text-sm text-red-600">Please enter a valid phone number</p>
      )}
      <p className="text-sm text-gray-500">Format: (555) 123-4567</p>
    </div>
  )
}