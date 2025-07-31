'use client'

import { useState, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface Widget {
  id: string
  name: string
  embed_key: string
}

interface WidgetSelectorProps {
  widgets: Widget[]
  selectedWidgetId: string | null
  onWidgetChange: (widgetId: string | null) => void
  className?: string
}

export default function WidgetSelector({ 
  widgets, 
  selectedWidgetId, 
  onWidgetChange,
  className = ""
}: WidgetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Don't show selector if only one widget
  if (widgets.length <= 1) {
    return null
  }

  const selectedWidget = selectedWidgetId 
    ? widgets.find(w => w.id === selectedWidgetId)
    : null

  const displayText = selectedWidget 
    ? selectedWidget.name 
    : 'All Widgets'

  return (
    <div className={`relative ${className}`}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Widget
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
          >
            <span className="block truncate">{displayText}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </span>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
              <ul className="max-h-60 overflow-auto rounded-md py-1 text-base focus:outline-none sm:text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onWidgetChange(null)
                      setIsOpen(false)
                    }}
                    className={`relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left hover:bg-blue-50 ${
                      !selectedWidgetId ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`}
                  >
                    <span className="block truncate font-medium">All Widgets</span>
                    <span className="text-xs text-gray-500">Combined analytics for all widgets</span>
                  </button>
                </li>
                {widgets.map((widget) => (
                  <li key={widget.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onWidgetChange(widget.id)
                        setIsOpen(false)
                      }}
                      className={`relative w-full cursor-pointer select-none py-2 pl-3 pr-9 text-left hover:bg-blue-50 ${
                        selectedWidgetId === widget.id ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      <span className="block truncate font-medium">{widget.name}</span>
                      <span className="text-xs text-gray-500">Widget: {widget.embed_key}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}