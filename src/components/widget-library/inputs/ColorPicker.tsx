'use client'

import { useState } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  required?: boolean
  error?: string
  presetColors?: string[]
}

const DEFAULT_PRESETS = [
  '#000000', // Black
  '#1f2937', // Gray-800
  '#374151', // Gray-700
  '#60a5fa', // Blue-400
  '#3b82f6', // Blue-500
  '#1d4ed8', // Blue-700
  '#10b981', // Emerald-500
  '#059669', // Emerald-600
  '#dc2626', // Red-600
  '#f59e0b', // Amber-500
  '#8b5cf6', // Violet-500
  '#ec4899', // Pink-500
]

export function ColorPicker({ 
  value = '#000000', 
  onChange, 
  label = 'Color',
  required = false,
  error,
  presetColors = DEFAULT_PRESETS
}: ColorPickerProps) {
  const theme = useWidgetTheme()
  const [showCustom, setShowCustom] = useState(false)
  const [customColor, setCustomColor] = useState(value)

  const handlePresetClick = (color: string) => {
    onChange(color)
    setCustomColor(color)
    setShowCustom(false)
  }

  const handleCustomChange = (color: string) => {
    setCustomColor(color)
    onChange(color)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium" style={{ color: theme.labelText }}>
        {label} {required && <span style={{ color: theme.errorColor }}>*</span>}
      </label>

      {/* Current color display */}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2"
          style={{ 
            backgroundColor: value,
            borderColor: theme.borderColor
          }}
        />
        <div>
          <p className="text-sm font-medium" style={{ color: theme.primaryText }}>
            Current Color
          </p>
          <p className="text-xs font-mono" style={{ color: theme.secondaryText }}>
            {value.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Preset colors */}
      <div>
        <p className="text-xs mb-2" style={{ color: theme.secondaryText }}>
          Quick select:
        </p>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handlePresetClick(color)}
              className="w-full aspect-square rounded-lg border-2 transition-all hover:scale-110"
              style={{ 
                backgroundColor: color,
                borderColor: value === color ? theme.primaryColor : theme.borderColor,
                borderWidth: value === color ? '3px' : '2px'
              }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom color input */}
      <div>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-sm underline"
          style={{ color: theme.primaryColor }}
        >
          {showCustom ? 'Hide' : 'Use'} custom color
        </button>
        
        {showCustom && (
          <div className="mt-2 flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
              style={{ 
                backgroundColor: theme.inputBackground,
                border: `1px solid ${theme.inputBorder}`
              }}
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const color = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                  handleCustomChange(color)
                }
              }}
              placeholder="#000000"
              className="px-3 py-2 rounded text-sm font-mono"
              style={{
                backgroundColor: theme.inputBackground,
                color: theme.inputText,
                border: `1px solid ${theme.inputBorder}`
              }}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm mt-1" style={{ color: theme.errorColor }}>{error}</p>
      )}
    </div>
  )
}