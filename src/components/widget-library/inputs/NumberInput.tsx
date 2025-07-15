'use client'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  helpText?: string
  name?: string
  min?: number
  max?: number
  step?: number
  required?: boolean
}

export function NumberInput({
  value,
  onChange,
  label,
  placeholder,
  helpText,
  name,
  min,
  max,
  step = 1,
  required,
  ...props
}: NumberInputProps) {
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
      
      <input
        type="number"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        name={name}
        min={min}
        max={max}
        step={step}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}