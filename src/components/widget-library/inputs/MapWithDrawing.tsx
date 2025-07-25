'use client'

import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '@/lib/google-maps-loader'

export interface MapWithDrawingProps {
  value: {
    shapes: Array<{
      id: string
      coordinates: google.maps.LatLngLiteral[]
      area?: number
    }>
    measurements: {
      totalArea?: number
    }
  }
  onChange: (value: MapWithDrawingProps['value']) => void
  address?: string
  mode: 'linear' | 'area' | 'placement'
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
  const [drawMode, setDrawMode] = useState(false)
  const [currentPolygon, setCurrentPolygon] = useState<google.maps.Polygon | null>(null)
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([])
  const [polylines, setPolylines] = useState<google.maps.Polyline[]>([])
  
  // Load Google Maps
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

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    const mapInstance = new google.maps.Map(mapRef.current, {
      zoom: 20,
      center: { lat: 40.7128, lng: -74.0060 },
      mapTypeId: 'satellite',
      tilt: 0,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      rotateControl: false,
      clickableIcons: false,
      disableDefaultUI: false
    })

    setMap(mapInstance)
  }, [isLoaded])

  // Handle address geocoding separately
  useEffect(() => {
    if (!map || !address || !address.trim()) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        map.setCenter(results[0].geometry.location)
        map.setZoom(19)
        
        // Add marker at property location
        new google.maps.Marker({
          position: results[0].geometry.location,
          map: map
        })
      }
    })
  }, [map, address])

  // Drawing manager
  useEffect(() => {
    if (!map || (mode !== 'area' && mode !== 'linear')) return

    const isLinear = mode === 'linear'
    const drawingMode = drawMode ? (isLinear ? google.maps.drawing.OverlayType.POLYLINE : google.maps.drawing.OverlayType.POLYGON) : null

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode,
      drawingControl: false,
      polygonOptions: {
        fillColor: '#fbbf24',
        fillOpacity: 0.3,
        strokeColor: '#fbbf24',
        strokeWeight: 3,
        clickable: true,
        editable: false
      },
      polylineOptions: {
        strokeColor: '#ef4444',
        strokeWeight: 4,
        clickable: true,
        editable: false
      }
    })

    drawingManager.setMap(map)

    // Listen for shape completion
    const shapeCompleteListener = isLinear 
      ? google.maps.event.addListener(
          drawingManager,
          'polylinecomplete',
          (polyline: google.maps.Polyline) => {
            // Calculate length
            const path = polyline.getPath()
            const length = google.maps.geometry.spherical.computeLength(path.getArray()) * 3.28084 // to feet
            
            // Add to polylines array
            setPolylines(prev => [...prev, polyline])
            
            // Update value
            const shapeId = `shape-${Date.now()}`
            const coordinates = path.getArray().map(latLng => ({
              lat: latLng.lat(),
              lng: latLng.lng()
            }))
            
            const updatedShapes = [...value.shapes, { id: shapeId, coordinates, length }]
            const totalLength = updatedShapes.reduce((sum, shape) => sum + (shape.length || 0), 0)
            
            onChange({
              shapes: updatedShapes,
              measurements: { totalLength }
            })
            
            // Add click listener for deletion
            polyline.addListener('click', () => {
              polyline.setMap(null)
              setPolylines(prev => prev.filter(p => p !== polyline))
              
              // Update value
              const filteredShapes = updatedShapes.filter(s => s.id !== shapeId)
              const newTotalLength = filteredShapes.reduce((sum, shape) => sum + (shape.length || 0), 0)
              
              onChange({
                shapes: filteredShapes,
                measurements: { totalLength: newTotalLength }
              })
            })
          }
        )
      : google.maps.event.addListener(
          drawingManager,
          'polygoncomplete',
          (polygon: google.maps.Polygon) => {
            // Calculate area
            const path = polygon.getPath()
            const area = google.maps.geometry.spherical.computeArea(path.getArray()) * 10.764 // to sq ft
            
            // Add to polygons array
            const newPolygon = polygon
            setPolygons(prev => [...prev, newPolygon])
            
            // Update value
            const shapeId = `shape-${Date.now()}`
            const coordinates = path.getArray().map(latLng => ({
              lat: latLng.lat(),
              lng: latLng.lng()
            }))
            
            const updatedShapes = [...value.shapes, { id: shapeId, coordinates, area }]
            const totalArea = updatedShapes.reduce((sum, shape) => sum + (shape.area || 0), 0)
            
            onChange({
              shapes: updatedShapes,
              measurements: { totalArea }
            })
            
            // Add click listener for deletion
            polygon.addListener('click', () => {
              polygon.setMap(null)
              setPolygons(prev => prev.filter(p => p !== polygon))
              
              // Update value
              const filteredShapes = updatedShapes.filter(s => s.id !== shapeId)
              const newTotalArea = filteredShapes.reduce((sum, shape) => sum + (shape.area || 0), 0)
              
              onChange({
                shapes: filteredShapes,
                measurements: { totalArea: newTotalArea }
              })
            })
          }
        )

    // Change cursor when in draw mode
    if (drawMode) {
      map.setOptions({ draggableCursor: 'crosshair' })
    } else {
      map.setOptions({ draggableCursor: null })
    }

    return () => {
      drawingManager.setMap(null)
      google.maps.event.removeListener(shapeCompleteListener)
    }
  }, [map, mode, drawMode, value.shapes, onChange])

  const clearAll = () => {
    polygons.forEach(polygon => polygon.setMap(null))
    polylines.forEach(polyline => polyline.setMap(null))
    setPolygons([])
    setPolylines([])
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
          
        </label>
      )}

      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600">
          {drawMode ? (
            <span className="text-blue-600">
              {mode === 'linear' 
                ? 'Draw mode active - Click to create lines, double-click to finish a line'
                : 'Draw mode active - Click to create shapes, click original point to finish shape'
              }
            </span>
          ) : (
            <span>
              {mode === 'linear' 
                ? 'Click "Draw" to start drawing lines'
                : 'Click "Draw" to start drawing areas'
              }
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDrawMode(!drawMode)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              drawMode
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {drawMode ? 'Stop Drawing' : 'Draw'}
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
        <div 
          ref={mapRef} 
          className="w-full h-[600px]"
          style={{ display: isLoaded ? 'block' : 'none' }}
        />
        {!isLoaded && (
          <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {value.shapes.length > 0 && (
        <div className="mt-3 space-y-2">
          <div className="text-sm font-medium text-gray-900">
            {mode === 'linear' ? (
              <>Total Length: {(value.measurements.totalLength || 0).toFixed(0)} ft</>
            ) : (
              <>Total Area: {(value.measurements.totalArea || 0).toFixed(0)} sq ft</>
            )}
          </div>
          {value.shapes.length > 1 && (
            <div className="text-xs text-gray-500">
              {value.shapes.length} {mode === 'linear' ? 'lines' : 'shapes'} drawn (click a {mode === 'linear' ? 'line' : 'shape'} to delete)
            </div>
          )}
        </div>
      )}

      {helpText && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  )
}