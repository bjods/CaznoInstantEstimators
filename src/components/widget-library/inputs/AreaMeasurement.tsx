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
          
        </label>
      )}

      {/* Method Selection */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          type="button"
          onClick={() => setMethod('draw')}
          className={`px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors ${
            method === 'draw'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          🗺️ Draw on Map
        </button>
        <button
          type="button"
          onClick={() => setMethod('manual')}
          className={`px-8 py-3 text-base font-medium rounded-lg border-2 transition-colors ${
            method === 'manual'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          ✏️ Enter Manually
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
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => handleManualChange(parseInt(e.target.value) || 0)}
                placeholder="0"
                min="0"
                className="w-40 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <span className="text-lg font-medium text-gray-700">square feet</span>
            </div>
            <p className="mt-3 text-gray-600">
              Enter the approximate {serviceName.toLowerCase()} area in square feet
            </p>
            <p className="mt-2 text-sm text-gray-500">
              💡 Tip: For reference, a typical 2-car garage is about 400-600 sq ft
            </p>
          </div>
        </div>
      )}

      {/* Result Display */}
      {value > 0 && (
        <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-800 mb-1">
            {value.toLocaleString()} sq ft
          </div>
          <p className="text-green-700 font-medium">
            {serviceName} Area Calculated
          </p>
        </div>
      )}

      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}