export interface SliderInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  helpText?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  showValue?: boolean
}

export function SliderInput({ 
  value = 0, 
  onChange, 
  label,
  helpText,
  required,
  min = 0,
  max = 100,
  step = 1,
  showValue = true
}: SliderInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-3">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{min}</span>
          {showValue && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
              {value}
            </span>
          )}
          <span>{max}</span>
        </div>
      </div>
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          background: #e5e7eb;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}