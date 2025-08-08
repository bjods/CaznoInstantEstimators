import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

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
  const theme = useWidgetTheme()
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          className="block text-lg font-medium"
          style={{ color: theme.labelText }}
        >
          {label}
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
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
          style={{ backgroundColor: theme.progressBackground }}
        />
        
        <div className="flex justify-between items-center text-sm" style={{ color: theme.secondaryText }}>
          <span>{min}</span>
          {showValue && (
            <span 
              className="px-3 py-1 rounded font-medium"
              style={{ 
                backgroundColor: `${theme.primaryColor}20`,
                color: theme.primaryColor 
              }}
            >
              {value}%
            </span>
          )}
          <span>{max}</span>
        </div>
      </div>
      
      {helpText && (
        <p className="text-sm" style={{ color: theme.secondaryText }}>
          {helpText}
        </p>
      )}
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: ${theme.primaryColor};
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid ${theme.backgroundColor};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: ${theme.primaryColor};
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid ${theme.backgroundColor};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-webkit-slider-track {
          background: ${theme.progressBackground};
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          background: ${theme.progressBackground};
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}