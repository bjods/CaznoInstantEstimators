export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  type?: 'text' | 'email' | 'tel'
}

export function TextInput({ 
  value, 
  onChange, 
  label,
  placeholder,
  helpText,
  required,
  type = 'text'
}: TextInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}