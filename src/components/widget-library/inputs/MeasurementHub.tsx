'use client'

import { useState, useEffect } from 'react'
import { MapWithDrawing } from './MapWithDrawing'

interface MeasurementMethod {
  type: 'map_area' | 'map_linear' | 'manual_sqft' | 'manual_linear' | 'preset_sizes'
  label: string
  description?: string
  options?: Array<{
    label: string
    value: number
  }>
}

interface ServiceConfig {
  display_name: string
  icon?: string
  requires_measurement: boolean
  measurement_methods?: MeasurementMethod[]
  unit?: 'sqft' | 'linear_ft'
}

export interface MeasurementHubProps {
  value: Record<string, {
    method: string
    value: number
    mapData?: any
  }>
  onChange: (value: MeasurementHubProps['value']) => void
  selectedServices: string[]
  servicesConfig: Record<string, ServiceConfig>
  address?: string
  label?: string
  helpText?: string
  required?: boolean
}

export function MeasurementHub({
  value = {},
  onChange,
  selectedServices,
  servicesConfig,
  address,
  label,
  helpText,
  required
}: MeasurementHubProps) {
  const [activeService, setActiveService] = useState<string>(selectedServices[0] || '')
  const [activeMethod, setActiveMethod] = useState<string>('')

  // Get services that need measurement
  const servicesNeedingMeasurement = selectedServices.filter(
    service => servicesConfig[service]?.requires_measurement !== false
  )

  // Set initial active service
  useEffect(() => {
    if (!activeService && servicesNeedingMeasurement.length > 0) {
      setActiveService(servicesNeedingMeasurement[0])
    }
  }, [servicesNeedingMeasurement, activeService])

  const currentServiceConfig = servicesConfig[activeService]
  const serviceMeasurement = value[activeService]

  const handleMethodSelect = (method: string) => {
    setActiveMethod(method)
  }

  const handleMeasurementComplete = (measurement: number, mapData?: any) => {
    onChange({
      ...value,
      [activeService]: {
        method: activeMethod,
        value: measurement,
        mapData
      }
    })
    setActiveMethod('')
    
    // Auto-advance to next service if available
    const currentIndex = servicesNeedingMeasurement.indexOf(activeService)
    if (currentIndex < servicesNeedingMeasurement.length - 1) {
      setActiveService(servicesNeedingMeasurement[currentIndex + 1])
    }
  }

  const handleMapChange = (mapData: any) => {
    const measurement = mapData.measurements?.totalArea || 0
    handleMeasurementComplete(Math.round(measurement), mapData)
  }

  const handleManualInput = (measurement: number) => {
    handleMeasurementComplete(measurement)
  }

  const handlePresetSelect = (preset: number) => {
    handleMeasurementComplete(preset)
  }

  // If no services need measurement, show success message
  if (servicesNeedingMeasurement.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-2">✅</div>
        <p className="text-lg text-gray-700">No measurements needed for your selected services</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {label && (
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      )}

      {/* Service Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {servicesNeedingMeasurement.map(service => {
          const config = servicesConfig[service]
          const measurement = value[service]
          const isActive = service === activeService
          const isComplete = !!measurement?.value

          return (
            <button
              key={service}
              type="button"
              onClick={() => setActiveService(service)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-blue-500 text-white shadow-lg'
                  : isComplete
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="flex items-center gap-2">
                {config.icon && <span className="text-lg">{config.icon}</span>}
                {config.display_name}
                {isComplete && <span>✓</span>}
              </span>
              {isComplete && (
                <span className="text-sm block mt-1">
                  {measurement.value.toLocaleString()} {config.unit === 'linear_ft' ? 'ft' : 'sq ft'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Current Service Content */}
      {currentServiceConfig && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Measure your {currentServiceConfig.display_name.toLowerCase()}
          </h4>

          {/* Method Selection */}
          {!activeMethod && !serviceMeasurement && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {currentServiceConfig.measurement_methods?.map(method => (
                <button
                  key={method.type}
                  type="button"
                  onClick={() => handleMethodSelect(method.type)}
                  className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all group"
                >
                  <div className="text-3xl mb-2">
                    {method.type.includes('map') ? '🗺️' : 
                     method.type.includes('manual') ? '📏' : '📐'}
                  </div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {method.label}
                  </div>
                  {method.description && (
                    <div className="text-sm text-gray-500 mt-1">
                      {method.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Measurement Interface */}
          {activeMethod === 'map_area' && (
            <div>
              <MapWithDrawing
                value={serviceMeasurement?.mapData || { shapes: [], measurements: {} }}
                onChange={handleMapChange}
                address={address}
                mode="area"
                helpText="Click to draw the area on the map"
              />
              <button
                type="button"
                onClick={() => setActiveMethod('')}
                className="mt-4 text-gray-600 hover:text-gray-800 underline"
              >
                Use a different method
              </button>
            </div>
          )}

          {activeMethod === 'manual_sqft' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="w-40 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (val > 0) handleManualInput(val)
                  }}
                />
                <span className="text-lg font-medium text-gray-700">square feet</span>
              </div>
              <p className="text-sm text-gray-500">
                💡 Tip: A typical 2-car garage is about 400-600 sq ft
              </p>
              <button
                type="button"
                onClick={() => setActiveMethod('')}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Use a different method
              </button>
            </div>
          )}

          {activeMethod === 'manual_linear' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  className="w-40 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    if (val > 0) handleManualInput(val)
                  }}
                />
                <span className="text-lg font-medium text-gray-700">linear feet</span>
              </div>
              <p className="text-sm text-gray-500">
                💡 Tip: Measure the total length of all sides
              </p>
              <button
                type="button"
                onClick={() => setActiveMethod('')}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Use a different method
              </button>
            </div>
          )}

          {activeMethod === 'preset_sizes' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {currentServiceConfig.measurement_methods
                  ?.find(m => m.type === 'preset_sizes')
                  ?.options?.map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => handlePresetSelect(preset.value)}
                      className="p-4 bg-white hover:bg-blue-50 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition-all"
                    >
                      <div className="font-medium text-gray-900">{preset.label}</div>
                      <div className="text-sm text-gray-500">{preset.value} sq ft</div>
                    </button>
                  ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveMethod('')}
                className="mt-4 text-gray-600 hover:text-gray-800 underline block mx-auto"
              >
                Use a different method
              </button>
            </div>
          )}

          {/* Show existing measurement */}
          {serviceMeasurement && !activeMethod && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl inline-block">
                <div className="text-3xl font-bold text-green-800">
                  {serviceMeasurement.value.toLocaleString()} {currentServiceConfig.unit === 'linear_ft' ? 'ft' : 'sq ft'}
                </div>
                <p className="text-green-700 font-medium">
                  {currentServiceConfig.display_name} measured
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newValue = { ...value }
                  delete newValue[activeService]
                  onChange(newValue)
                }}
                className="text-gray-600 hover:text-gray-800 underline"
              >
                Re-measure
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress Summary */}
      {servicesNeedingMeasurement.length > 1 && (
        <div className="text-center text-sm text-gray-600">
          {Object.keys(value).filter(s => servicesNeedingMeasurement.includes(s)).length} of {servicesNeedingMeasurement.length} services measured
        </div>
      )}

      {helpText && (
        <p className="text-sm text-gray-500 text-center">{helpText}</p>
      )}
    </div>
  )
}