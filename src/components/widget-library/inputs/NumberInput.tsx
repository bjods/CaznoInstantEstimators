import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
}

export function NumberInput({ 
  value = 0, 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  min,
  max,
  step = 1
}: NumberInputProps) {
  const theme = useWidgetTheme()
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className="block text-lg font-medium"
          style={{ color: theme.labelText }}
        >
          {label}
        </label>
      )}
      
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
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
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
      
      {min !== undefined && max !== undefined && (
        <p className="text-xs" style={{ color: theme.secondaryText }}>
          Range: {min} - {max}
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