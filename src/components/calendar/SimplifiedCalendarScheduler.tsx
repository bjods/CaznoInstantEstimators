'use client'

import { useState, useEffect } from 'react'
import { SchedulingConfig, SchedulingSelection, TimeSlot } from '@/types'

interface SimplifiedCalendarSchedulerProps {
  scheduling: SchedulingConfig
  serviceType?: string
  value?: SchedulingSelection
  onChange: (value: SchedulingSelection | null) => void
  error?: string
}

export function SimplifiedCalendarScheduler({
  scheduling,
  serviceType,
  value,
  onChange,
  error
}: SimplifiedCalendarSchedulerProps) {
  const [selectedStartDate, setSelectedStartDate] = useState<string>(value?.start_date || '')
  const [selectedEndDate, setSelectedEndDate] = useState<string>(value?.end_date || '')
  const [selectedAppointment, setSelectedAppointment] = useState<string>(value?.appointment_datetime || '')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  const today = new Date()
  const maxDate = new Date()
  maxDate.setDate(today.getDate() + (scheduling.max_days_ahead || 30))

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const minDate = formatDateForInput(today)
  const maxDateStr = formatDateForInput(maxDate)

  // Simple mode: Handle date range selection
  const handleSimpleDateChange = (field: 'start' | 'end', dateStr: string) => {
    if (field === 'start') {
      setSelectedStartDate(dateStr)
      // If end date is before start date, clear it
      if (selectedEndDate && selectedEndDate < dateStr) {
        setSelectedEndDate('')
      }
    } else {
      setSelectedEndDate(dateStr)
    }

    // Update parent with new selection
    const newSelection: SchedulingSelection = {
      mode: 'simple',
      start_date: field === 'start' ? dateStr : selectedStartDate,
      end_date: field === 'end' ? dateStr : selectedEndDate,
    }

    // Only call onChange if we have at least a start date
    if (newSelection.start_date) {
      onChange(newSelection)
    }
  }

  // Meeting mode: Handle appointment selection
  const handleAppointmentChange = (appointmentDatetime: string) => {
    setSelectedAppointment(appointmentDatetime)
    
    const newSelection: SchedulingSelection = {
      mode: 'meeting',
      appointment_datetime: appointmentDatetime,
      duration: scheduling.meeting_mode?.duration || 60
    }

    onChange(newSelection)
  }

  // Load available time slots for meeting mode
  const loadAvailableSlots = async (date: string) => {
    if (scheduling.mode !== 'meeting' || !scheduling.meeting_mode) return

    setLoading(true)
    try {
      // For now, generate simple time slots based on business hours
      // In the future, this would integrate with the Google Calendar API
      const dayOfWeek = new Date(date).toLocaleDateString('en', { weekday: 'lowercase' }) as keyof typeof scheduling.business_hours
      const businessHours = scheduling.business_hours[dayOfWeek]

      if (!businessHours) {
        setAvailableSlots([])
        return
      }

      // Generate time slots (simplified version)
      const slots: TimeSlot[] = []
      const [startHour, startMinute] = businessHours.start.split(':').map(Number)
      const [endHour, endMinute] = businessHours.end.split(':').map(Number)
      
      const duration = scheduling.meeting_mode.duration
      const buffer = scheduling.meeting_mode.buffer || 0
      
      let currentHour = startHour
      let currentMinute = startMinute

      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const slotTime = new Date(date)
        slotTime.setHours(currentHour, currentMinute, 0, 0)
        
        // Check if this slot would end before business hours end
        const slotEnd = new Date(slotTime.getTime() + duration * 60000)
        const businessEnd = new Date(date)
        businessEnd.setHours(endHour, endMinute, 0, 0)
        
        if (slotEnd <= businessEnd) {
          slots.push({
            datetime: slotTime,
            available: true // For now, assume all slots are available
          })
        }

        // Move to next slot
        currentMinute += duration + buffer
        while (currentMinute >= 60) {
          currentMinute -= 60
          currentHour++
        }
      }

      setAvailableSlots(slots)
    } catch (error) {
      console.error('Error loading time slots:', error)
      setAvailableSlots([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate minimum end date for simple mode
  const getMinEndDate = () => {
    if (!selectedStartDate) return minDate
    
    const startDate = new Date(selectedStartDate)
    const minDuration = scheduling.simple_mode?.min_duration_days || 1
    const minEndDate = new Date(startDate)
    minEndDate.setDate(startDate.getDate() + minDuration - 1)
    
    return formatDateForInput(minEndDate)
  }

  // Calculate maximum end date for simple mode
  const getMaxEndDate = () => {
    if (!selectedStartDate) return maxDateStr
    
    const startDate = new Date(selectedStartDate)
    const maxDuration = scheduling.simple_mode?.max_duration_days || 30
    const maxEndDate = new Date(startDate)
    maxEndDate.setDate(startDate.getDate() + maxDuration - 1)
    
    const absoluteMaxDate = new Date(maxDateStr)
    return maxEndDate < absoluteMaxDate ? formatDateForInput(maxEndDate) : maxDateStr
  }

  if (!scheduling.enabled) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {scheduling.mode === 'simple' ? 'Select Date Range' : 'Schedule Appointment'}
      </h3>

      {scheduling.mode === 'simple' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={selectedStartDate}
                onChange={(e) => handleSimpleDateChange('start', e.target.value)}
                min={minDate}
                max={maxDateStr}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {scheduling.simple_mode?.allow_date_ranges && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date {selectedStartDate ? '*' : '(optional)'}
                </label>
                <input
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => handleSimpleDateChange('end', e.target.value)}
                  min={getMinEndDate()}
                  max={getMaxEndDate()}
                  disabled={!selectedStartDate}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            )}
          </div>

          {selectedStartDate && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-800 mb-1">
                Selected Period
              </h4>
              <p className="text-sm text-green-700">
                {selectedEndDate && selectedEndDate !== selectedStartDate
                  ? `${new Date(selectedStartDate).toLocaleDateString()} - ${new Date(selectedEndDate).toLocaleDateString()}`
                  : new Date(selectedStartDate).toLocaleDateString()
                }
              </p>
            </div>
          )}
        </div>
      )}

      {scheduling.mode === 'meeting' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              onChange={(e) => {
                setSelectedAppointment('')
                loadAvailableSlots(e.target.value)
              }}
              min={minDate}
              max={maxDateStr}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {availableSlots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleAppointmentChange(slot.datetime.toISOString())}
                      disabled={!slot.available}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${slot.available 
                          ? selectedAppointment === slot.datetime.toISOString()
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {slot.datetime.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedAppointment && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-800 mb-1">
                Selected Appointment
              </h4>
              <p className="text-sm text-green-700">
                {new Date(selectedAppointment).toLocaleDateString()} at{' '}
                {new Date(selectedAppointment).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Duration: {scheduling.meeting_mode?.duration || 60} minutes
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}