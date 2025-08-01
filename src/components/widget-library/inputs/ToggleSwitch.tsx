export interface ToggleSwitchProps {
  value: boolean
  onChange: (value: boolean) => void
  label?: string
  helpText?: string
  required?: boolean
}

export function ToggleSwitch({ 
  value = false, 
  onChange, 
  label,
  helpText,
  required
}: ToggleSwitchProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="inline-flex gap-3">
        {/* Yes Button */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            px-8 py-3 font-medium text-lg rounded-xl transition-all duration-200
            ${value 
              ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600' 
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          Yes
        </button>
        
        {/* No Button */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            px-8 py-3 font-medium text-lg rounded-xl transition-all duration-200
            ${!value 
              ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600' 
              : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }
          `}
        >
          No
        </button>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}