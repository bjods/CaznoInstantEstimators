'use client'

import { useState } from 'react'

interface ServiceOption {
  value: string
  title: string
  description: string
  image?: string
}

export interface ServiceSelectionProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  helpText?: string
  required?: boolean
  multiple?: boolean
  options: ServiceOption[]
}

export function ServiceSelection({
  value = [],
  onChange,
  label,
  helpText,
  required = false,
  multiple = false,
  options
}: ServiceSelectionProps) {
  const handleServiceToggle = (serviceValue: string) => {
    if (multiple) {
      const newValue = value.includes(serviceValue)
        ? value.filter(v => v !== serviceValue)
        : [...value, serviceValue]
      onChange(newValue)
    } else {
      onChange([serviceValue])
    }
  }

  return (
    <div className="space-y-6">
      {label && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h2>
          {helpText && (
            <p className="text-lg text-gray-600">{helpText}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((service) => {
          const isSelected = value.includes(service.value)
          
          return (
            <div
              key={service.value}
              onClick={() => handleServiceToggle(service.value)}
              className={`relative cursor-pointer rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                isSelected 
                  ? 'ring-4 ring-blue-500 bg-white' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Service Image */}
              <div className="aspect-[4/3] w-full bg-gray-200 overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="mx-auto h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs">Photo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

            </div>
          )
        })}
      </div>

      {multiple && value.length > 0 && (
        <div className="text-center pt-4">
          <p className="text-lg font-medium text-green-700">
            {value.length} service{value.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  )
}