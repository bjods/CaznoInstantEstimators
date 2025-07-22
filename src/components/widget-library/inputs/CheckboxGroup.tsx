export interface CheckboxGroupProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Array<{ value: string; label: string; description?: string }>
  label?: string
  helpText?: string
  required?: boolean
}

export function CheckboxGroup({ 
  value = [], 
  onChange, 
  options, 
  label,
  helpText,
  required
}: CheckboxGroupProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter(v => v !== optionValue))
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          
        </label>
      )}
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <input
              type="checkbox"
              value={option.value}
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="mt-1 mr-4 text-blue-500 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-sm text-gray-500 mt-1">{option.description}</div>
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