'use client'

import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

export interface MapWithDrawingProps {
  value: {
    shapes: Array<{
      id: string
      coordinates: google.maps.LatLngLiteral[]
      area?: number
      length?: number
    }>
    measurements: {
      totalArea?: number // total square feet for all shapes
      totalLength?: number // total length for all lines
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
  value = { shapes: [], measurements: {} },
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
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<google.maps.LatLngLiteral[]>([])
  const [previewLine, setPreviewLine] = useState<google.maps.Polyline | null>(null)
  const [startMarker, setStartMarker] = useState<google.maps.Marker | null>(null)
  
  // Completed shapes
  const [completedShapes, setCompletedShapes] = useState<Array<google.maps.Polygon | google.maps.Polyline>>([])

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

  // Mouse move handler for live preview
  useEffect(() => {
    if (!map || !isDrawing || currentPath.length === 0) return

    const mouseMoveListener = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return

      const mousePos = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      const previewPath = [...currentPath, mousePos]

      if (previewLine) {
        previewLine.setPath(previewPath)
      } else {
        const line = new google.maps.Polyline({
          path: previewPath,
          geodesic: true,
          strokeColor: '#2563eb',
          strokeOpacity: 0.6,
          strokeWeight: 2,
          icons: [{
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 3 },
            offset: '100%'
          }]
        })
        line.setMap(map)
        setPreviewLine(line)
      }
    }

    const listener = map.addListener('mousemove', mouseMoveListener)
    
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [map, isDrawing, currentPath, previewLine])

  // Click handler for drawing
  useEffect(() => {
    if (!map) return

    const clickListener = (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return

      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      
      if (mode === 'area') {
        if (!isDrawing) {
          // Start new shape
          setIsDrawing(true)
          setCurrentPath([newPoint])
          
          // Create start marker
          const marker = new google.maps.Marker({
            position: newPoint,
            map: map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#2563eb',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            title: 'Click here to close shape'
          })
          setStartMarker(marker)
        } else {
          // Check if clicking on start point to close shape
          const startPoint = currentPath[0]
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(startPoint),
            new google.maps.LatLng(newPoint)
          )
          
          if (distance < 10 && currentPath.length >= 3) {
            // Close the shape
            completeShape()
          } else {
            // Add point to current path
            setCurrentPath(prev => [...prev, newPoint])
          }
        }
      }
    }

    const listener = map.addListener('click', clickListener)
    
    return () => {
      if (listener) {
        google.maps.event.removeListener(listener)
      }
    }
  }, [map, mode, isDrawing, currentPath])

  const completeShape = () => {
    if (currentPath.length < 3) return

    const shapeId = `shape-${Date.now()}`
    const area = calculatePolygonArea(currentPath)
    
    // Create completed polygon
    const polygon = new google.maps.Polygon({
      paths: currentPath,
      strokeColor: '#10b981',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#10b981',
      fillOpacity: 0.2,
      clickable: true
    })
    polygon.setMap(map)
    
    // Add click listener for deletion
    polygon.addListener('click', () => deleteShape(shapeId))
    
    setCompletedShapes(prev => [...prev, polygon])
    
    // Update value
    const newShape = {
      id: shapeId,
      coordinates: currentPath,
      area
    }
    
    const updatedShapes = [...value.shapes, newShape]
    const totalArea = updatedShapes.reduce((sum, shape) => sum + (shape.area || 0), 0)
    
    onChange({
      shapes: updatedShapes,
      measurements: { totalArea }
    })
    
    // Reset drawing state
    resetDrawing()
  }

  const deleteShape = (shapeId: string) => {
    const updatedShapes = value.shapes.filter(shape => shape.id !== shapeId)
    const totalArea = updatedShapes.reduce((sum, shape) => sum + (shape.area || 0), 0)
    
    // Find and remove the polygon from map
    const shapeIndex = value.shapes.findIndex(shape => shape.id === shapeId)
    if (shapeIndex !== -1 && completedShapes[shapeIndex]) {
      completedShapes[shapeIndex].setMap(null)
      setCompletedShapes(prev => prev.filter((_, index) => index !== shapeIndex))
    }
    
    onChange({
      shapes: updatedShapes,
      measurements: { totalArea }
    })
  }

  const resetDrawing = () => {
    setIsDrawing(false)
    setCurrentPath([])
    
    if (previewLine) {
      previewLine.setMap(null)
      setPreviewLine(null)
    }
    
    if (startMarker) {
      startMarker.setMap(null)
      setStartMarker(null)
    }
  }

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

  const clearAll = () => {
    // Clear all completed shapes
    completedShapes.forEach(shape => shape.setMap(null))
    setCompletedShapes([])
    
    // Reset current drawing
    resetDrawing()
    
    // Update value
    onChange({
      shapes: [],
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

      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">
          {isDrawing ? (
            <span className="text-blue-600">Drawing... Click start point to close shape</span>
          ) : (
            <span>Click to start drawing</span>
          )}
        </div>
        <div className="flex gap-2">
          {isDrawing && (
            <button
              type="button"
              onClick={resetDrawing}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>
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

      {/* Results */}
      {value.shapes.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-sm font-medium text-gray-900">
            Total Area: {(value.measurements.totalArea || 0).toFixed(0)} sq ft
          </div>
          {value.shapes.length > 1 && (
            <div className="text-xs text-gray-500">
              {value.shapes.length} shapes drawn
            </div>
          )}
        </div>
      )}
    </div>
  )
}