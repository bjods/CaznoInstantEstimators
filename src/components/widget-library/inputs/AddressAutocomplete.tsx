'use client'

import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

export interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
  onEnter?: () => void
}

export function AddressAutocomplete({
  value,
  onChange,
  label,
  placeholder = "Enter address...",
  helpText,
  required,
  onEnter
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await loadGoogleMaps()
        setIsLoaded(true)
      } catch (err) {
        setError('Failed to load Google Maps')
        console.error('Google Maps loading error:', err)
      }
    }

    initGoogleMaps()
  }, [])

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
    })

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChange(place.formatted_address)
      }
    })

    autocompleteRef.current = autocomplete

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [isLoaded, onChange])

  if (error) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-lg font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="p-3 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-lg font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnter) {
            e.preventDefault()
            onEnter()
          }
        }}
        placeholder={!isLoaded ? "Loading..." : placeholder}
        disabled={!isLoaded}
        required={required}
        autoComplete="off"
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}