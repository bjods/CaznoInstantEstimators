'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export interface AddressAutocompleteProps {
  value: string
  onChange: (address: string, placeDetails?: google.maps.places.PlaceResult) => void
  label?: string
  placeholder?: string
  helpText?: string
  required?: boolean
}

export function AddressAutocomplete({
  value,
  onChange,
  label,
  placeholder = "Enter address...",
  helpText,
  required
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        setError('Google Maps API key not found')
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        })

        await loader.load()
        setIsLoaded(true)
      } catch (err) {
        setError('Failed to load Google Maps')
        console.error('Google Maps loading error:', err)
      }
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      fields: ['formatted_address', 'geometry', 'address_components']
    })

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.formatted_address) {
        onChange(place.formatted_address, place)
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
          <label className="block text-sm font-medium text-gray-700">
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
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={!isLoaded ? "Loading Google Maps..." : placeholder}
        disabled={!isLoaded}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors disabled:bg-gray-50"
      />
      
      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}