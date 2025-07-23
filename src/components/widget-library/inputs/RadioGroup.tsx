export interface RadioGroupProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string; description?: string }>
  label?: string
  helpText?: string
  required?: boolean
}

export function RadioGroup({ 
  value, 
  onChange, 
  options, 
  label,
  helpText,
  required
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          
        </label>
      )}
      
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              w-full text-left p-4 rounded-lg transition-all border-2 font-medium
              ${value === option.value
                ? 'bg-blue-100 text-blue-800 border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className={`text-sm mt-1 ${
                value === option.value ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {option.description}
              </div>
            )}
          </button>
        ))}
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}