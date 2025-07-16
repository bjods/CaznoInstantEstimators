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
  value, 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  min,
  max,
  step = 1
}: NumberInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {min !== undefined && max !== undefined && (
        <p className="text-xs text-gray-400">
          Range: {min} - {max}
        </p>
      )}
    </div>
  )
}