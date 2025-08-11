'use client'

import { useState, useEffect } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'

interface Service {
  id: string
  name: string
  basePrice: number
  pricingMethod: 'fixed' | 'per_sqft' | 'per_linear_ft' | 'per_hour' | 'custom'
  unit?: string
}

interface ServicePricingTableProps {
  value: Service[]
  onChange: (services: Service[]) => void
  businessType?: string
  label?: string
  required?: boolean
  error?: string
}

// Pre-populated services by business type
const SUGGESTED_SERVICES: Record<string, Service[]> = {
  fencing: [
    { id: '1', name: 'Wood Fence Installation', basePrice: 25, pricingMethod: 'per_linear_ft' },
    { id: '2', name: 'Chain Link Fence', basePrice: 15, pricingMethod: 'per_linear_ft' },
    { id: '3', name: 'Vinyl Fence Installation', basePrice: 35, pricingMethod: 'per_linear_ft' },
    { id: '4', name: 'Fence Repair', basePrice: 150, pricingMethod: 'fixed' },
    { id: '5', name: 'Gate Installation', basePrice: 500, pricingMethod: 'fixed' }
  ],
  concrete: [
    { id: '1', name: 'Driveway Installation', basePrice: 8, pricingMethod: 'per_sqft' },
    { id: '2', name: 'Patio Installation', basePrice: 10, pricingMethod: 'per_sqft' },
    { id: '3', name: 'Sidewalk Installation', basePrice: 6, pricingMethod: 'per_sqft' },
    { id: '4', name: 'Stamped Concrete', basePrice: 15, pricingMethod: 'per_sqft' },
    { id: '5', name: 'Concrete Repair', basePrice: 200, pricingMethod: 'fixed' }
  ],
  landscaping: [
    { id: '1', name: 'Lawn Mowing', basePrice: 50, pricingMethod: 'fixed' },
    { id: '2', name: 'Sod Installation', basePrice: 2, pricingMethod: 'per_sqft' },
    { id: '3', name: 'Tree Trimming', basePrice: 150, pricingMethod: 'per_hour' },
    { id: '4', name: 'Mulch Installation', basePrice: 75, pricingMethod: 'custom', unit: 'per yard' },
    { id: '5', name: 'Garden Design', basePrice: 500, pricingMethod: 'fixed' }
  ],
  roofing: [
    { id: '1', name: 'Asphalt Shingle Roof', basePrice: 4, pricingMethod: 'per_sqft' },
    { id: '2', name: 'Metal Roof Installation', basePrice: 8, pricingMethod: 'per_sqft' },
    { id: '3', name: 'Roof Repair', basePrice: 300, pricingMethod: 'fixed' },
    { id: '4', name: 'Gutter Installation', basePrice: 10, pricingMethod: 'per_linear_ft' },
    { id: '5', name: 'Roof Inspection', basePrice: 200, pricingMethod: 'fixed' }
  ]
}

export function ServicePricingTable({ 
  value = [], 
  onChange, 
  businessType = '',
  label = 'Services & Pricing',
  required = false,
  error
}: ServicePricingTableProps) {
  const theme = useWidgetTheme()
  // Ensure value is always an array
  const initialServices = Array.isArray(value) ? value : []
  const [services, setServices] = useState<Service[]>(initialServices)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)

  useEffect(() => {
    // Sync with prop changes
    const propServices = Array.isArray(value) ? value : []
    if (JSON.stringify(propServices) !== JSON.stringify(services)) {
      setServices(propServices)
    }
  }, [value])

  useEffect(() => {
    onChange(services)
  }, [services])

  const addService = (service?: Service) => {
    const newService: Service = service || {
      id: Date.now().toString(),
      name: '',
      basePrice: 0,
      pricingMethod: 'fixed'
    }
    setServices([...services, newService])
    setEditingId(newService.id)
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ))
  }

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id))
  }

  const getPricingMethodLabel = (method: Service['pricingMethod'], unit?: string) => {
    switch (method) {
      case 'fixed': return 'Fixed Price'
      case 'per_sqft': return 'Per Sq Ft'
      case 'per_linear_ft': return 'Per Linear Ft'
      case 'per_hour': return 'Per Hour'
      case 'custom': return unit || 'Custom'
      default: return method
    }
  }

  const suggestedServices = SUGGESTED_SERVICES[businessType?.toLowerCase()] || []
  const unusedSuggestions = suggestedServices.filter(suggested => 
    !services.some(service => service.name === suggested.name)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium" style={{ color: theme.labelText }}>
          {label} {required && <span style={{ color: theme.errorColor }}>*</span>}
        </label>
        <button
          type="button"
          onClick={() => addService()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors"
          style={{
            backgroundColor: theme.primaryColor,
            color: theme.primaryButtonText
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${theme.primaryColor}dd`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.primaryColor
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Suggestions */}
      {showSuggestions && unusedSuggestions.length > 0 && services.length === 0 && (
        <div 
          className="p-4 rounded-lg border"
          style={{ 
            backgroundColor: `${theme.primaryColor}10`,
            borderColor: theme.primaryColor
          }}
        >
          <p className="text-sm mb-3" style={{ color: theme.primaryText }}>
            Quick add common {businessType} services:
          </p>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map(suggestion => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => addService({
                  ...suggestion,
                  id: Date.now().toString()
                })}
                className="px-3 py-1.5 text-xs rounded-md transition-colors"
                style={{
                  backgroundColor: theme.inputBackground,
                  color: theme.primaryText,
                  border: `1px solid ${theme.borderColor}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primaryColor
                  e.currentTarget.style.color = theme.primaryButtonText
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.inputBackground
                  e.currentTarget.style.color = theme.primaryText
                }}
              >
                + {suggestion.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Services Table */}
      {services.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.borderColor}` }}>
                <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: theme.secondaryText }}>
                  Service Name
                </th>
                <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: theme.secondaryText }}>
                  Pricing Method
                </th>
                <th className="text-left py-2 px-3 text-sm font-medium" style={{ color: theme.secondaryText }}>
                  Base Price
                </th>
                <th className="text-right py-2 px-3 text-sm font-medium" style={{ color: theme.secondaryText }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr 
                  key={service.id}
                  style={{ 
                    borderBottom: index < services.length - 1 ? `1px solid ${theme.borderColor}` : undefined 
                  }}
                >
                  <td className="py-3 px-3">
                    {editingId === service.id ? (
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, { name: e.target.value })}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="w-full px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          border: `1px solid ${theme.inputBorder}`
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: theme.primaryText }}>
                        {service.name || 'Unnamed Service'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <select
                      value={service.pricingMethod}
                      onChange={(e) => updateService(service.id, { 
                        pricingMethod: e.target.value as Service['pricingMethod'] 
                      })}
                      className="text-sm px-2 py-1 rounded"
                      style={{
                        backgroundColor: theme.inputBackground,
                        color: theme.inputText,
                        border: `1px solid ${theme.inputBorder}`
                      }}
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="per_sqft">Per Sq Ft</option>
                      <option value="per_linear_ft">Per Linear Ft</option>
                      <option value="per_hour">Per Hour</option>
                      <option value="custom">Custom Unit</option>
                    </select>
                    {service.pricingMethod === 'custom' && (
                      <input
                        type="text"
                        value={service.unit || ''}
                        onChange={(e) => updateService(service.id, { unit: e.target.value })}
                        placeholder="e.g., per yard"
                        className="mt-1 w-full text-sm px-2 py-1 rounded"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          border: `1px solid ${theme.inputBorder}`
                        }}
                      />
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm" style={{ color: theme.secondaryText }}>$</span>
                      <input
                        type="number"
                        value={service.basePrice}
                        onChange={(e) => updateService(service.id, { 
                          basePrice: parseFloat(e.target.value) || 0 
                        })}
                        className="w-24 px-2 py-1 rounded text-sm"
                        style={{
                          backgroundColor: theme.inputBackground,
                          color: theme.inputText,
                          border: `1px solid ${theme.inputBorder}`
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(service.id)}
                        className="p-1 rounded transition-colors"
                        style={{ color: theme.secondaryText }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = theme.primaryColor
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = theme.secondaryText
                        }}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteService(service.id)}
                        className="p-1 rounded transition-colors"
                        style={{ color: theme.secondaryText }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = theme.errorColor
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = theme.secondaryText
                        }}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {services.length === 0 && (
        <div 
          className="text-center py-8 rounded-lg border-2 border-dashed"
          style={{ 
            borderColor: theme.borderColor,
            backgroundColor: `${theme.inputBackground}50`
          }}
        >
          <p className="text-sm mb-2" style={{ color: theme.secondaryText }}>
            No services added yet
          </p>
          <p className="text-xs" style={{ color: theme.secondaryText }}>
            Click "Add Service" or select from suggestions above
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm mt-1" style={{ color: theme.errorColor }}>{error}</p>
      )}
    </div>
  )
}