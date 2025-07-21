'use client'

import { KeyboardEvent } from 'react'

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
      <label className="block text-lg font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
        <p className="text-sm text-red-600">Please enter a valid email address</p>
      )}
    </div>
  )
}