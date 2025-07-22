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

  // Set initial active service and method
  useEffect(() => {
    if (!activeService && servicesNeedingMeasurement.length > 0) {
      const firstService = servicesNeedingMeasurement[0]
      const firstServiceConfig = servicesConfig[firstService]
      setActiveService(firstService)
      
      // Auto-select first measurement method if service has no existing measurement
      if (!value[firstService] && firstServiceConfig?.measurement_methods?.length > 0) {
        setActiveMethod(firstServiceConfig.measurement_methods[0].type)
      }
    }
  }, [servicesNeedingMeasurement, activeService, value, servicesConfig])

  const currentServiceConfig = servicesConfig[activeService]
  const serviceMeasurement = value[activeService]

  const handleMethodSelect = (method: string) => {
    setActiveMethod(method)
    setTempMapData(null)
    setTempManualValue(0)
  }

  const handleServiceSwitch = (service: string) => {
    setActiveService(service)
    setActiveMethod('')
    setTempMapData(null)
    setTempManualValue(0)
    
    // Auto-select first measurement method if service has no existing measurement
    const serviceConfig = servicesConfig[service]
    if (!value[service] && serviceConfig?.measurement_methods?.length > 0) {
      setActiveMethod(serviceConfig.measurement_methods[0].type)
    }
  }

  const [tempMapData, setTempMapData] = useState<any>(null)
  const [tempManualValue, setTempManualValue] = useState<number>(0)

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
    setTempMapData(null)
    setTempManualValue(0)
    
    // Auto-advance to next service if available
    const currentIndex = servicesNeedingMeasurement.indexOf(activeService)
    if (currentIndex < servicesNeedingMeasurement.length - 1) {
      setActiveService(servicesNeedingMeasurement[currentIndex + 1])
    }
  }

  const handleMapChange = (mapData: any) => {
    setTempMapData(mapData)
  }

  const handleConfirmMap = () => {
    const measurement = activeMethod === 'map_linear' 
      ? tempMapData?.measurements?.totalLength || 0
      : tempMapData?.measurements?.totalArea || 0
    handleMeasurementComplete(Math.round(measurement), tempMapData)
  }

  const handleManualInputChange = (value: number) => {
    setTempManualValue(value)
  }

  const handleConfirmManual = () => {
    if (tempManualValue > 0) {
      handleMeasurementComplete(tempManualValue)
    }
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
              onClick={() => handleServiceSwitch(service)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-500 shadow-lg'
                  : isComplete
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-center">
                <span className="flex items-center gap-2 justify-center">
                  {config.icon && <span className="text-lg">{config.icon}</span>}
                  {config.display_name}
                  {isComplete && <span>✓</span>}
                </span>
                {isComplete ? (
                  <span className="text-sm block mt-1 font-semibold">
                    {measurement.value.toLocaleString()} {config.unit === 'linear_ft' ? 'ft' : 'sq ft'}
                  </span>
                ) : (
                  <span className="text-xs block mt-1 text-red-500">
                    needs measurement
                  </span>
                )}
              </div>
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
          {(activeMethod === 'map_area' || activeMethod === 'map_linear') && (
            <div className="space-y-4">
              <MapWithDrawing
                value={tempMapData || serviceMeasurement?.mapData || { shapes: [], measurements: {} }}
                onChange={handleMapChange}
                address={address}
                mode={activeMethod === 'map_linear' ? 'linear' : 'area'}
                helpText={activeMethod === 'map_linear' 
                  ? "Click to draw lines on the map. Draw curves and bends as needed." 
                  : "Click to draw areas on the map. You can draw multiple shapes."
                }
              />
              {tempMapData && (
                (activeMethod === 'map_linear' ? tempMapData.measurements?.totalLength > 0 : tempMapData.measurements?.totalArea > 0)
              ) && (
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">
                      {activeMethod === 'map_linear' 
                        ? Math.round(tempMapData.measurements.totalLength || 0).toLocaleString() + ' ft'
                        : Math.round(tempMapData.measurements.totalArea || 0).toLocaleString() + ' sq ft'
                      }
                    </div>
                    <p className="text-blue-700 text-sm">
                      {activeMethod === 'map_linear' ? 'Total length drawn' : 'Total area drawn'}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      type="button"
                      onClick={handleConfirmMap}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Confirm Measurement
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMethod('')}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Use Different Method
                    </button>
                  </div>
                </div>
              )}
              {!tempMapData && (
                <button
                  type="button"
                  onClick={() => setActiveMethod('')}
                  className="text-gray-600 hover:text-gray-800 underline text-sm"
                >
                  Use a different method
                </button>
              )}
            </div>
          )}

          {activeMethod === 'manual_sqft' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={tempManualValue || ''}
                  className="w-40 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    handleManualInputChange(val)
                  }}
                />
                <span className="text-lg font-medium text-gray-700">square feet</span>
              </div>
              <p className="text-sm text-gray-500">
                💡 Tip: A typical 2-car garage is about 400-600 sq ft
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleConfirmManual}
                  disabled={tempManualValue <= 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    tempManualValue > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Measurement
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('')
                    setTempManualValue(0)
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Use Different Method
                </button>
              </div>
            </div>
          )}

          {activeMethod === 'manual_linear' && (
            <div className="max-w-md mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-4">
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={tempManualValue || ''}
                  className="w-40 px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    handleManualInputChange(val)
                  }}
                />
                <span className="text-lg font-medium text-gray-700">linear feet</span>
              </div>
              <p className="text-sm text-gray-500">
                💡 Tip: Measure the total length of all sides
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleConfirmManual}
                  disabled={tempManualValue <= 0}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    tempManualValue > 0
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Measurement
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMethod('')
                    setTempManualValue(0)
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Use Different Method
                </button>
              </div>
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
            <div className="max-w-md mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-green-600 text-4xl mb-2">✓</div>
                <div className="text-2xl font-bold text-green-800 mb-1">
                  {serviceMeasurement.value.toLocaleString()} {currentServiceConfig.unit === 'linear_ft' ? 'ft' : 'sq ft'}
                </div>
                <p className="text-green-700 font-medium mb-4">
                  {currentServiceConfig.display_name} Complete
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const newValue = { ...value }
                    delete newValue[activeService]
                    onChange(newValue)
                    setTempMapData(null)
                    setTempManualValue(0)
                    // Auto-select first measurement method when re-measuring
                    if (currentServiceConfig?.measurement_methods?.length > 0) {
                      setActiveMethod(currentServiceConfig.measurement_methods[0].type)
                    }
                  }}
                  className="px-4 py-2 text-sm bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Change Measurement
                </button>
              </div>
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