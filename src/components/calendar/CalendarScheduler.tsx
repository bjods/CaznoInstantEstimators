'use client'

import { useState, useEffect } from 'react'
import { SchedulingConfig, TimeSlot } from '@/types'

interface CalendarSchedulerProps {
  scheduling: SchedulingConfig
  serviceType?: string
  inventoryType?: string
  requiredQuantity?: number
  widgetId: string
  selectedDate?: Date
  selectedSlot?: { datetime: Date; time: string }
  onSlotSelect: (slot: { datetime: Date; time: string } | null) => void
  onDateSelect?: (date: Date) => void
}

interface AvailabilityData {
  date: string
  slots: Array<{
    datetime: string
    time: string
    available: boolean
  }>
  inventoryAvailable?: number
  businessHours?: {
    start: string
    end: string
  }
  reason?: string
}

export function CalendarScheduler({
  scheduling,
  serviceType,
  inventoryType,
  requiredQuantity = 1,
  widgetId,
  selectedDate,
  selectedSlot,
  onSlotSelect,
  onDateSelect
}: CalendarSchedulerProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate date range based on configuration
  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + (scheduling.max_days_ahead || 30))

  const minDate = new Date()
  minDate.setHours(minDate.getHours() + (scheduling.min_hours_notice || 2))

  useEffect(() => {
    if (currentDate) {
      fetchAvailability(currentDate)
    }
  }, [currentDate, widgetId])

  const fetchAvailability = async (date: Date) => {
    setLoading(true)
    setError(null)

    try {
      const dateString = date.toISOString().split('T')[0]
      
      const response = await fetch('/api/calendar/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId,
          date: dateString,
          serviceType,
          inventoryType,
          quantity: requiredQuantity
        })
      })

      const result = await response.json()

      if (result.success) {
        setAvailabilityData(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load availability')
      console.error('Availability fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
    onDateSelect?.(date)
    onSlotSelect(null) // Clear selected slot when date changes
  }

  const handleSlotSelect = (slot: { datetime: string; time: string }) => {
    const slotWithDate = {
      datetime: new Date(slot.datetime),
      time: slot.time
    }
    onSlotSelect(slotWithDate)
  }

  const isDateDisabled = (date: Date) => {
    // Disable past dates
    if (date < minDate) return true
    
    // Disable dates beyond max range
    if (date > maxDate) return true
    
    // Check if business is open on this day
    const dayOfWeek = date.toLocaleDateString('en', { weekday: 'lowercase' }) as keyof typeof scheduling.business_hours
    const businessHours = scheduling.business_hours[dayOfWeek]
    
    return !businessHours
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Schedule Appointment
      </h3>

      {/* Date Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <DatePicker
          selected={currentDate}
          onChange={handleDateChange}
          minDate={minDate}
          maxDate={maxDate}
          filterDate={(date) => !isDateDisabled(date)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Selected Date Display */}
      {currentDate && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Availability for {formatDate(currentDate)}
          </p>
        </div>
      )}

      {/* Time Slots */}
      <div className="space-y-4">
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 mt-2">Loading availability...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {availabilityData && !loading && (
          <>
            {availabilityData.reason && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-600">{availabilityData.reason}</p>
              </div>
            )}

            {availabilityData.slots.length > 0 && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availabilityData.slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && handleSlotSelect(slot)}
                      disabled={!slot.available}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${slot.available 
                          ? selectedSlot?.time === slot.time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </>
            )}

            {availabilityData.slots.length === 0 && !availabilityData.reason && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-sm text-gray-600">No time slots available for this date.</p>
              </div>
            )}

            {/* Inventory Information */}
            {inventoryType && typeof availabilityData.inventoryAvailable === 'number' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  {availabilityData.inventoryAvailable >= requiredQuantity 
                    ? `✓ ${inventoryType} available (${availabilityData.inventoryAvailable} in stock)`
                    : `⚠ Insufficient ${inventoryType} available (${availabilityData.inventoryAvailable} in stock, ${requiredQuantity} needed)`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected Appointment Summary */}
      {selectedSlot && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="text-sm font-medium text-green-800 mb-1">
            Selected Appointment
          </h4>
          <p className="text-sm text-green-700">
            {formatDate(selectedSlot.datetime)} at {selectedSlot.time}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Duration: {scheduling.duration} minutes
          </p>
        </div>
      )}
    </div>
  )
}

// Simple date picker component (you might want to use a library like react-datepicker)
function DatePicker({ 
  selected, 
  onChange, 
  minDate, 
  maxDate, 
  filterDate, 
  className 
}: {
  selected: Date
  onChange: (date: Date) => void
  minDate: Date
  maxDate: Date
  filterDate: (date: Date) => boolean
  className: string
}) {
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value + 'T00:00:00')
    if (filterDate(date)) {
      onChange(date)
    }
  }

  return (
    <input
      type="date"
      value={formatDateForInput(selected)}
      onChange={handleChange}
      min={formatDateForInput(minDate)}
      max={formatDateForInput(maxDate)}
      className={className}
    />
  )
}