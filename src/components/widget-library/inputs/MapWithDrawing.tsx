'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export interface MapWithDrawingProps {
  value: {
    mode: 'linear' | 'area' | 'placement'
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
  mode?: 'linear' | 'area' | 'placement'
  label?: string
  helpText?: string
  required?: boolean
}

export function MapWithDrawing({
  value,
  onChange,
  address,
  mode: defaultMode = 'area',
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
      zoom: 18,
      center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
      mapTypeId: 'satellite'
    })

    setMap(mapInstance)

    // Initialize with default mode if value is empty
    if (!value.mode) {
      onChange({
        mode: defaultMode,
        coordinates: [],
        measurements: {}
      })
    }

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
  }, [isLoaded, address, defaultMode, value.mode, onChange])

  useEffect(() => {
    if (!map) return

    const clickListener = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return

      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      
      if (value.mode === 'linear') {
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
          mode: 'linear',
          coordinates: newPath,
          measurements: { length }
        })
      } else if (value.mode === 'area') {
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
            mode: 'area',
            coordinates: newPath,
            measurements: { area, squareFeet: area }
          })
        }
      } else if (value.mode === 'placement') {
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
            mode: 'placement',
            coordinates: [startPoint, newPoint],
            measurements: { width, height }
          })
        }
      }
    }

    map.addListener('click', clickListener)
    
    return () => {
      google.maps.event.removeListener(clickListener)
    }
  }, [map, value.mode, drawingPath, currentDrawing, onChange])

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
      mode: value.mode,
      coordinates: [],
      measurements: {}
    })
  }

  const setMode = (mode: 'linear' | 'area' | 'placement') => {
    clearDrawing()
    onChange({
      mode,
      coordinates: [],
      measurements: {}
    })
  }

  // Use current mode or default mode
  const currentMode = value.mode || defaultMode

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

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setMode('linear')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentMode === 'linear' 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Linear
        </button>
        <button
          type="button"
          onClick={() => setMode('area')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentMode === 'area' 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Area
        </button>
        <button
          type="button"
          onClick={() => setMode('placement')}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            currentMode === 'placement' 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Placement
        </button>
        <button
          type="button"
          onClick={clearDrawing}
          className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
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

      {value.measurements && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Measurements</h4>
          {value.measurements.length && (
            <p className="text-sm text-gray-600">Length: {value.measurements.length.toFixed(2)} feet</p>
          )}
          {(value.measurements.area || value.measurements.squareFeet) && (
            <p className="text-sm text-gray-600">Area: {(value.measurements.area || value.measurements.squareFeet || 0).toFixed(2)} square feet</p>
          )}
          {value.measurements.width && value.measurements.height && (
            <div className="text-sm text-gray-600">
              <p>Width: {value.measurements.width.toFixed(2)} feet</p>
              <p>Height: {value.measurements.height.toFixed(2)} feet</p>
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-gray-500">
        <p>
          <strong>{currentMode === 'linear' ? 'Linear' : currentMode === 'area' ? 'Area' : 'Placement'} Mode:</strong>{' '}
          {currentMode === 'linear' && 'Click points to draw a line'}
          {currentMode === 'area' && 'Click points to draw a polygon'}
          {currentMode === 'placement' && 'Click two points to draw a rectangle'}
        </p>
      </div>

      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}