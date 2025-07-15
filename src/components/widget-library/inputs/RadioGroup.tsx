'use client'

export interface RadioOption {
  value: string
  label: string
  description?: string
}

export interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label?: string
  name?: string
  helpText?: string
  required?: boolean
}

export function RadioGroup({ 
  value, 
  onChange, 
  options,
  label,
  name,
  helpText,
  required
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <input
              type="radio"
              name={name || label}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              required={required && !value}
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-gray-500">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}