export interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  rows?: number
  maxLength?: number
}

export function TextArea({ 
  value = '', 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  rows = 4,
  maxLength
}: TextAreaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-vertical"
      />
      
      <div className="flex justify-between items-center">
        {helpText && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
        {maxLength && (
          <p className="text-xs text-gray-400">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}