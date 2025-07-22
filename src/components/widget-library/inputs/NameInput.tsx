'use client'

import { KeyboardEvent, forwardRef } from 'react'

export interface NameInputProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  required?: boolean
  onEnter?: () => void
  autoFocus?: boolean
}

export const NameInput = forwardRef<HTMLInputElement, NameInputProps>(({
  value,
  onChange,
  label,
  placeholder,
  required = false,
  onEnter,
  autoFocus = false
}, ref) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-lg font-medium text-gray-700">
        {label}
        
      </label>
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
      />
    </div>
  )
})

NameInput.displayName = 'NameInput'