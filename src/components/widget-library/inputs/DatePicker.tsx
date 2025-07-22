export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  helpText?: string
  required?: boolean
  min?: string
  max?: string
}

export function DatePicker({ 
  value = '', 
  onChange, 
  label,
  helpText,
  required,
  min,
  max
}: DatePickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          
        </label>
      )}
      
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      {(min || max) && (
        <p className="text-xs text-gray-400">
          {min && max ? `Range: ${min} to ${max}` : min ? `From: ${min}` : `Until: ${max}`}
        </p>
      )}
    </div>
  )
}