'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export interface MapWithDrawingProps {
  value: {
    coordinates: google.maps.LatLngLiteral[]
    measurements: {
      length?: number // feet for linear
      area?: number // square feet for area
      squareFeet?: number // alias for area
      width?: number // feet for placement
      height?: number // feet for placement
    }
  }
  onChange: (value: MapWithDrawingProps['value']) => void
  address?: string
  mode: 'linear' | 'area' | 'placement' // Required from config
  label?: string
  helpText?: string
  required?: boolean
}

export function MapWithDrawing({
  value = { coordinates: [], measurements: {} },
  onChange,
  address,
  mode,
  label,
  helpText,
  required
}: MapWithDrawingProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentDrawing, setCurrentDrawing] = useState<google.maps.Polyline | google.maps.Polygon | google.maps.Rectangle | null>(null)
  const [drawingPath, setDrawingPath] = useState<google.maps.LatLngLiteral[]>([])

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
          libraries: ['places', 'geometry']
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
    if (!isLoaded || !mapRef.current) return

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 20,
      center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
      mapTypeId: 'satellite',
      tilt: 0, // Force top-down view
      streetViewControl: false, // Remove street view
      mapTypeControl: false, // Remove map type switcher
      fullscreenControl: false, // Remove fullscreen button
      rotateControl: false, // Remove rotation control
      scaleControl: true, // Keep scale for measurements
      zoomControl: true // Keep zoom controls
    })

    setMap(mapInstance)

    // Geocode address if provided
    if (address) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          mapInstance.setCenter(results[0].geometry.location)
          mapInstance.setZoom(19) // Closer zoom for property-level work
        }
      })
    }
  }, [isLoaded, address])

  useEffect(() => {
    if (!map) return

    const clickListener = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return

      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      
      if (mode === 'linear') {
        const newPath = [...drawingPath, newPoint]
        setDrawingPath(newPath)
        
        if (currentDrawing) {
          (currentDrawing as google.maps.Polyline).setPath(newPath)
        } else {
          const polyline = new google.maps.Polyline({
            path: newPath,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          })
          polyline.setMap(map)
          setCurrentDrawing(polyline)
        }
        
        const length = calculatePolylineLength(newPath)
        onChange({
          coordinates: newPath,
          measurements: { length }
        })
      } else if (mode === 'area') {
        const newPath = [...drawingPath, newPoint]
        setDrawingPath(newPath)
        
        if (currentDrawing) {
          (currentDrawing as google.maps.Polygon).setPath(newPath)
        } else {
          const polygon = new google.maps.Polygon({
            paths: newPath,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
          })
          polygon.setMap(map)
          setCurrentDrawing(polygon)
        }
        
        if (newPath.length >= 3) {
          const area = calculatePolygonArea(newPath)
          onChange({
            coordinates: newPath,
            measurements: { area, squareFeet: area }
          })
        }
      } else if (mode === 'placement') {
        if (drawingPath.length === 0) {
          setDrawingPath([newPoint])
        } else {
          const startPoint = drawingPath[0]
          const bounds = new google.maps.LatLngBounds()
          bounds.extend(startPoint)
          bounds.extend(newPoint)
          
          if (currentDrawing) {
            (currentDrawing as google.maps.Rectangle).setBounds(bounds)
          } else {
            const rectangle = new google.maps.Rectangle({
              bounds,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            })
            rectangle.setMap(map)
            setCurrentDrawing(rectangle)
          }
          
          const { width, height } = calculateRectangleDimensions(startPoint, newPoint)
          onChange({
            coordinates: [startPoint, newPoint],
            measurements: { width, height }
          })
        }
      }
    }

    const listener = map.addListener('click', clickListener)
    
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [map, mode, drawingPath, currentDrawing, onChange])

  const calculatePolylineLength = (path: google.maps.LatLngLiteral[]): number => {
    if (path.length < 2) return 0
    
    let totalLength = 0
    for (let i = 0; i < path.length - 1; i++) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(path[i]),
        new google.maps.LatLng(path[i + 1])
      )
      totalLength += distance
    }
    
    return totalLength * 3.28084 // Convert meters to feet
  }

  const calculatePolygonArea = (path: google.maps.LatLngLiteral[]): number => {
    if (path.length < 3) return 0
    
    const area = google.maps.geometry.spherical.computeArea(
      path.map(p => new google.maps.LatLng(p))
    )
    
    return area * 10.764 // Convert square meters to square feet
  }

  const calculateRectangleDimensions = (point1: google.maps.LatLngLiteral, point2: google.maps.LatLngLiteral) => {
    const ne = { lat: Math.max(point1.lat, point2.lat), lng: Math.max(point1.lng, point2.lng) }
    const sw = { lat: Math.min(point1.lat, point2.lat), lng: Math.min(point1.lng, point2.lng) }
    const nw = { lat: ne.lat, lng: sw.lng }
    const se = { lat: sw.lat, lng: ne.lng }
    
    const width = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(nw),
      new google.maps.LatLng(ne)
    ) * 3.28084 // Convert to feet
    
    const height = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(sw),
      new google.maps.LatLng(nw)
    ) * 3.28084 // Convert to feet
    
    return { width, height }
  }

  const clearDrawing = () => {
    if (currentDrawing) {
      currentDrawing.setMap(null)
      setCurrentDrawing(null)
    }
    setDrawingPath([])
    onChange({
      coordinates: [],
      measurements: {}
    })
  }

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
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={clearDrawing}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-96"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
        {!isLoaded && (
          <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Loading map...</p>
          </div>
        )}
      </div>

      {value.measurements && Object.keys(value.measurements).length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          {value.measurements.length && (
            <span>Length: {value.measurements.length.toFixed(0)} ft</span>
          )}
          {(value.measurements.area || value.measurements.squareFeet) && (
            <span>Area: {(value.measurements.area || value.measurements.squareFeet || 0).toFixed(0)} sq ft</span>
          )}
          {value.measurements.width && value.measurements.height && (
            <span>{value.measurements.width.toFixed(0)} × {value.measurements.height.toFixed(0)} ft</span>
          )}
        </div>
      )}
    </div>
  )
}