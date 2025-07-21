'use client'

import { useState } from 'react'
import { MapWithDrawing } from './MapWithDrawing'

export interface AreaMeasurementProps {
  value: number // square feet
  onChange: (sqft: number) => void
  serviceName: string // e.g., "Patio", "Walkway"
  address?: string
  label?: string
  helpText?: string
  required?: boolean
}

export function AreaMeasurement({
  value = 0,
  onChange,
  serviceName,
  address = '',
  label,
  helpText,
  required
}: AreaMeasurementProps) {
  const [method, setMethod] = useState<'draw' | 'manual'>('draw')
  const [mapValue, setMapValue] = useState({ shapes: [], measurements: {} })

  const handleMapChange = (mapData: any) => {
    setMapValue(mapData)
    const sqft = mapData.measurements?.totalArea || mapData.measurements?.squareFeet || mapData.measurements?.area || 0
    onChange(Math.round(sqft))
  }

  const handleManualChange = (sqft: number) => {
    onChange(sqft)
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Method Selection */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setMethod('draw')}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
            method === 'draw'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Draw on Map
        </button>
        <button
          type="button"
          onClick={() => setMethod('manual')}
          className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
            method === 'manual'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Enter Manually
        </button>
      </div>

      {/* Draw Method */}
      {method === 'draw' && (
        <MapWithDrawing
          value={mapValue}
          onChange={handleMapChange}
          address={address}
          mode="area"
          helpText={`Draw the ${serviceName.toLowerCase()} area`}
        />
      )}

      {/* Manual Method */}
      {method === 'manual' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleManualChange(parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <span className="text-sm text-gray-600">square feet</span>
          </div>
          <p className="text-xs text-gray-500">
            Enter the approximate {serviceName.toLowerCase()} area in square feet
          </p>
        </div>
      )}

      {/* Result Display */}
      {value > 0 && (
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-medium">{serviceName} Area:</span> {value.toLocaleString()} sq ft
          </p>
        </div>
      )}

      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}