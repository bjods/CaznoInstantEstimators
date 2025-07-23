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
      
      <div className="grid grid-cols-2 gap-0 w-48 h-12 rounded-lg overflow-hidden">
        {/* Yes Button */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            px-4 py-3 font-medium text-sm transition-all border-2
            ${value 
              ? 'bg-blue-100 text-blue-800 border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
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
            px-4 py-3 font-medium text-sm transition-all border-2
            ${!value 
              ? 'bg-blue-100 text-blue-800 border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
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