'use client'

import { KeyboardEvent, forwardRef } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

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
  const theme = useWidgetTheme()
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault()
      onEnter()
    }
  }

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
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className="w-full px-4 py-3 text-lg border-2 rounded-lg outline-none transition-colors"
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
      <style jsx>{`
        input::placeholder {
          color: ${theme.inputPlaceholder};
        }
      `}</style>
    </div>
  )
})

NameInput.displayName = 'NameInput'