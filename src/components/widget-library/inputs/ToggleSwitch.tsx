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
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="flex items-center justify-center gap-4">
        {/* Yes Label */}
        <span className={`text-sm font-medium transition-colors duration-300 ${
          value ? 'text-blue-600' : 'text-gray-500'
        }`}>
          Yes
        </span>
        
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`
            relative inline-flex h-8 w-16 items-center rounded-full 
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-blue-500/30
            hover:shadow-lg hover:opacity-90
            ${value ? 'bg-blue-500 shadow-md' : 'bg-gray-300 shadow-sm'}
          `}
          role="switch"
          aria-checked={value}
          aria-label={label || 'Toggle switch'}
        >
          {/* Toggle Thumb */}
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white 
              shadow-lg transition-all duration-300 ease-in-out
              ${value ? 'translate-x-8' : 'translate-x-1'}
            `}
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          />
        </button>
        
        {/* No Label */}
        <span className={`text-sm font-medium transition-colors duration-300 ${
          !value ? 'text-gray-700' : 'text-gray-400'
        }`}>
          No
        </span>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500 text-center">{helpText}</p>
      )}
    </div>
  )
}