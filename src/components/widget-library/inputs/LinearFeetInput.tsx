export interface LinearFeetInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  min?: number
  max?: number
}

export function LinearFeetInput({ 
  value, 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  min,
  max
}: LinearFeetInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-gray-500 text-sm">ft</span>
        </div>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {min && max && (
        <p className="text-xs text-gray-400">
          Range: {min} - {max} feet
        </p>
      )}
    </div>
  )
}