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
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            value ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="ml-3 text-sm text-gray-900">
          {value ? 'On' : 'Off'}
        </span>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}