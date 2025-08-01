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

    let listenerCleanup: google.maps.MapsEventListener | null = null

    // Clean up previous autocomplete instance
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current)
      autocompleteRef.current = null
    }

    // Remove any existing pac-containers for this input
    const existingContainers = document.querySelectorAll('.pac-container')
    existingContainers.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    })

    try {
      // Try the new PlaceAutocompleteElement API first
      if (typeof google !== 'undefined' && 
          google.maps && 
          google.maps.places && 
          google.maps.places.PlaceAutocompleteElement) {
        
        console.log('Using new PlaceAutocompleteElement API')
        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement()
        
        // Set up event listener for the new API
        placeAutocomplete.addEventListener('gmp-placeselect', (event: any) => {
          const place = event.place
          if (place && place.formattedAddress) {
            onChange(place.formattedAddress)
          } else if (place && place.displayName) {
            onChange(place.displayName)
          }
        })
        
        // Apply same styling as input
        placeAutocomplete.className = "w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
        
        // Replace input with PlaceAutocompleteElement
        if (inputRef.current?.parentNode) {
          inputRef.current.parentNode.replaceChild(placeAutocomplete, inputRef.current)
          // Update ref to point to new element
          inputRef.current = placeAutocomplete as any
        }
        
      } else {
        // Fallback to legacy Autocomplete API
        console.log('Using legacy Autocomplete API')
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address', 'geometry', 'address_components', 'place_id']
        })

        listenerCleanup = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place && place.formatted_address) {
            onChange(place.formatted_address)
          }
        })
        
        autocompleteRef.current = autocomplete
      }
    } catch (error) {
      console.error('Error setting up Google Places Autocomplete:', error)
      setError('Failed to initialize address autocomplete')
    }

    return () => {
      if (listenerCleanup) {
        google.maps.event.removeListener(listenerCleanup)
      }
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
      // Clean up pac-containers on unmount
      const containers = document.querySelectorAll('.pac-container')
      containers.forEach(container => {
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      })
    }
  }, [isLoaded]) // Removed onChange from dependencies to prevent re-creation

  if (error) {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-lg font-medium text-gray-700">
            {label}
            
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