'use client'

export interface LinearFeetInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  helpText?: string
  name?: string
  min?: number
  max?: number
  required?: boolean
}

export function LinearFeetInput({
  value,
  onChange,
  label,
  placeholder,
  helpText,
  name,
  min = 0,
  max,
  required,
  ...props
}: LinearFeetInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value)
    if (!isNaN(numValue)) {
      onChange(numValue)
    } else if (e.target.value === '') {
      onChange(0)
    }
  }

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
          onChange={handleChange}
          placeholder={placeholder}
          name={name}
          min={min}
          max={max}
          step="0.1"
          required={required}
          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          ft
        </span>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}