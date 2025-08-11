'use client'

import { useState, useEffect } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface ServiceOption {
  id: string
  name: string
  type: 'addon' | 'modifier' | 'variable'
  priceModification: number
  unit?: string
}

interface ServiceWithOptions {
  serviceId: string
  serviceName: string
  options: ServiceOption[]
}

interface DynamicServiceOptionsProps {
  value: ServiceWithOptions[]
  onChange: (servicesWithOptions: ServiceWithOptions[]) => void
  services: Array<{ id: string; name: string }>
  label?: string
  required?: boolean
  error?: string
}

const COMMON_OPTIONS: Record<string, ServiceOption[]> = {
  'Wood Fence Installation': [
    { id: '1', name: 'Premium Wood Grade', type: 'addon', priceModification: 10 },
    { id: '2', name: 'Stain/Seal Treatment', type: 'addon', priceModification: 5 },
    { id: '3', name: 'Height Over 6ft', type: 'modifier', priceModification: 1.25, unit: 'multiplier' },
    { id: '4', name: 'Difficult Terrain', type: 'modifier', priceModification: 1.15, unit: 'multiplier' }
  ],
  'Driveway Installation': [
    { id: '1', name: 'Decorative Border', type: 'addon', priceModification: 3 },
    { id: '2', name: 'Extra Thickness (5")', type: 'addon', priceModification: 2 },
    { id: '3', name: 'Slope/Grade Work', type: 'modifier', priceModification: 1.20, unit: 'multiplier' },
    { id: '4', name: 'Old Driveway Removal', type: 'addon', priceModification: 4 }
  ],
  'Lawn Mowing': [
    { id: '1', name: 'Edging Included', type: 'addon', priceModification: 15 },
    { id: '2', name: 'Leaf Removal', type: 'addon', priceModification: 25 },
    { id: '3', name: 'Fertilizer Application', type: 'addon', priceModification: 30 },
    { id: '4', name: 'Large Property (>1 acre)', type: 'modifier', priceModification: 1.5, unit: 'multiplier' }
  ]
}

export function DynamicServiceOptions({ 
  value = [], 
  onChange, 
  services = [],
  label = 'Service Options & Add-ons',
  required = false,
  error
}: DynamicServiceOptionsProps) {
  const theme = useWidgetTheme()
  // Ensure values are always arrays
  const initialValue = Array.isArray(value) ? value : []
  const safeServices = Array.isArray(services) ? services : []
  const [servicesWithOptions, setServicesWithOptions] = useState<ServiceWithOptions[]>(initialValue)
  const [activeServiceId, setActiveServiceId] = useState<string>(safeServices[0]?.id || '')

  useEffect(() => {
    // Initialize with empty options for each service
    const initialized = safeServices.map(service => {
      const existing = servicesWithOptions.find(s => s.serviceId === service.id)
      return existing || {
        serviceId: service.id,
        serviceName: service.name,
        options: []
      }
    })
    setServicesWithOptions(initialized)
  }, [safeServices])

  useEffect(() => {
    onChange(servicesWithOptions)
  }, [servicesWithOptions])

  const activeService = servicesWithOptions.find(s => s.serviceId === activeServiceId)
  const commonOptions = activeService ? COMMON_OPTIONS[activeService.serviceName] || [] : []

  const addOption = (serviceId: string, option?: ServiceOption) => {
    const newOption: ServiceOption = option || {
      id: Date.now().toString(),
      name: '',
      type: 'addon',
      priceModification: 0
    }

    setServicesWithOptions(prev => prev.map(service => 
      service.serviceId === serviceId
        ? { ...service, options: [...service.options, newOption] }
        : service
    ))
  }

  const updateOption = (serviceId: string, optionId: string, updates: Partial<ServiceOption>) => {
    setServicesWithOptions(prev => prev.map(service => 
      service.serviceId === serviceId
        ? {
            ...service,
            options: service.options.map(opt => 
              opt.id === optionId ? { ...opt, ...updates } : opt
            )
          }
        : service
    ))
  }

  const deleteOption = (serviceId: string, optionId: string) => {
    setServicesWithOptions(prev => prev.map(service => 
      service.serviceId === serviceId
        ? { ...service, options: service.options.filter(opt => opt.id !== optionId) }
        : service
    ))
  }

  const getTypeLabel = (type: ServiceOption['type']) => {
    switch (type) {
      case 'addon': return 'Add-on (Fixed $)'
      case 'modifier': return 'Modifier (%)'
      case 'variable': return 'Variable'
      default: return type
    }
  }

  if (safeServices.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: theme.secondaryText }}>
        <p className="text-sm">Add services first to configure options</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium" style={{ color: theme.labelText }}>
        {label} {required && <span style={{ color: theme.errorColor }}>*</span>}
      </label>

      {/* Service tabs */}
      <div className="flex flex-wrap gap-2 border-b" style={{ borderColor: theme.borderColor }}>
        {safeServices.map(service => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActiveServiceId(service.id)}
            className="px-4 py-2 text-sm font-medium transition-colors relative"
            style={{
              color: activeServiceId === service.id ? theme.primaryColor : theme.secondaryText,
              borderBottom: activeServiceId === service.id ? `2px solid ${theme.primaryColor}` : 'none',
              marginBottom: '-1px'
            }}
          >
            {service.name}
            {servicesWithOptions.find(s => s.serviceId === service.id)?.options.length > 0 && (
              <span 
                className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${theme.primaryColor}20`,
                  color: theme.primaryColor
                }}
              >
                {servicesWithOptions.find(s => s.serviceId === service.id)?.options.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active service options */}
      {activeService && (
        <div className="space-y-4">
          {/* Common suggestions */}
          {commonOptions.length > 0 && activeService.options.length === 0 && (
            <div 
              className="p-4 rounded-lg border"
              style={{ 
                backgroundColor: `${theme.primaryColor}10`,
                borderColor: theme.primaryColor
              }}
            >
              <p className="text-sm mb-3" style={{ color: theme.primaryText }}>
                Common options for {activeService.serviceName}:
              </p>
              <div className="space-y-2">
                {commonOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => addOption(activeService.serviceId, {
                      ...option,
                      id: Date.now().toString()
                    })}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm rounded transition-colors text-left"
                    style={{
                      backgroundColor: theme.inputBackground,
                      color: theme.primaryText,
                      border: `1px solid ${theme.borderColor}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${theme.primaryColor}20`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme.inputBackground
                    }}
                  >
                    <span>{option.name}</span>
                    <span style={{ color: theme.secondaryText }}>
                      {option.type === 'addon' && `+$${option.priceModification}`}
                      {option.type === 'modifier' && `×${option.priceModification}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add option button */}
          <button
            type="button"
            onClick={() => addOption(activeService.serviceId)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors"
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.primaryButtonText
            }}
          >
            <PlusIcon className="w-4 h-4" />
            Add Option for {activeService.serviceName}
          </button>

          {/* Options list */}
          {activeService.options.length > 0 && (
            <div className="space-y-3">
              {activeService.options.map((option, index) => (
                <div 
                  key={option.id}
                  className="p-4 rounded-lg border"
                  style={{ 
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.borderColor
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs" style={{ color: theme.secondaryText }}>
                        Option Name
                      </label>
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => updateOption(activeService.serviceId, option.id, { name: e.target.value })}
                        placeholder="e.g., Premium Materials"
                        className="w-full mt-1 px-3 py-2 rounded text-sm"
                        style={{
                          backgroundColor: theme.cardBackground,
                          color: theme.inputText,
                          border: `1px solid ${theme.inputBorder}`
                        }}
                      />
                    </div>

                    <div>
                      <label className="text-xs" style={{ color: theme.secondaryText }}>
                        Type
                      </label>
                      <select
                        value={option.type}
                        onChange={(e) => updateOption(activeService.serviceId, option.id, { 
                          type: e.target.value as ServiceOption['type'] 
                        })}
                        className="w-full mt-1 px-3 py-2 rounded text-sm"
                        style={{
                          backgroundColor: theme.cardBackground,
                          color: theme.inputText,
                          border: `1px solid ${theme.inputBorder}`
                        }}
                      >
                        <option value="addon">Add-on (Fixed $)</option>
                        <option value="modifier">Modifier (% or ×)</option>
                        <option value="variable">Variable</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs" style={{ color: theme.secondaryText }}>
                        {option.type === 'addon' ? 'Additional Cost' : 'Multiplier'}
                      </label>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm" style={{ color: theme.secondaryText }}>
                          {option.type === 'addon' ? '$' : '×'}
                        </span>
                        <input
                          type="number"
                          step={option.type === 'modifier' ? '0.01' : '1'}
                          value={option.priceModification}
                          onChange={(e) => updateOption(activeService.serviceId, option.id, { 
                            priceModification: parseFloat(e.target.value) || 0 
                          })}
                          className="flex-1 px-3 py-2 rounded text-sm"
                          style={{
                            backgroundColor: theme.cardBackground,
                            color: theme.inputText,
                            border: `1px solid ${theme.inputBorder}`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteOption(activeService.serviceId, option.id)}
                    className="mt-3 text-sm flex items-center gap-1 transition-colors"
                    style={{ color: theme.secondaryText }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = theme.errorColor
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = theme.secondaryText
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {activeService.options.length === 0 && commonOptions.length === 0 && (
            <div 
              className="text-center py-8 rounded-lg border-2 border-dashed"
              style={{ 
                borderColor: theme.borderColor,
                backgroundColor: `${theme.inputBackground}50`
              }}
            >
              <p className="text-sm mb-2" style={{ color: theme.secondaryText }}>
                No options for {activeService.serviceName} yet
              </p>
              <p className="text-xs" style={{ color: theme.secondaryText }}>
                Add options that customers can select
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm mt-1" style={{ color: theme.errorColor }}>{error}</p>
      )}
    </div>
  )
}