'use client'

import { useState } from 'react'
import { useWidgetTheme } from '@/contexts/WidgetThemeContext'

interface CalendarPlaceholderProps {
  label?: string
  description?: string
  duration?: number
  timezone_note?: string
  value?: any
  onChange?: (value: any) => void
  name?: string
  error?: string
}

export function CalendarPlaceholder({
  label = "Select Demo Time",
  description = "We will show you exactly how Cazno can work for your business and help you calculate your potential ROI.",
  duration = 30,
  timezone_note = "All times shown in your local timezone",
  value,
  onChange,
  name,
  error
}: CalendarPlaceholderProps) {
  const theme = useWidgetTheme()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(value || null)

  // Mock calendar slots for demo purposes
  const mockSlots = [
    { id: '1', day: 'Today', date: 'Dec 8', time: '2:00 PM', available: true },
    { id: '2', day: 'Today', date: 'Dec 8', time: '3:30 PM', available: true },
    { id: '3', day: 'Tomorrow', date: 'Dec 9', time: '10:00 AM', available: true },
    { id: '4', day: 'Tomorrow', date: 'Dec 9', time: '2:00 PM', available: false },
    { id: '5', day: 'Tomorrow', date: 'Dec 9', time: '4:00 PM', available: true },
    { id: '6', day: 'Monday', date: 'Dec 11', time: '9:00 AM', available: true },
    { id: '7', day: 'Monday', date: 'Dec 11', time: '11:00 AM', available: true },
    { id: '8', day: 'Monday', date: 'Dec 11', time: '2:00 PM', available: true },
  ]

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId)
    const selectedSlotData = mockSlots.find(slot => slot.id === slotId)
    if (onChange && selectedSlotData) {
      onChange({
        slotId,
        day: selectedSlotData.day,
        date: selectedSlotData.date,
        time: selectedSlotData.time,
        duration
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold mb-3" style={{ color: theme.primaryText }}>
          {label}
        </h3>
        <p className="text-base leading-relaxed mb-2" style={{ color: theme.secondaryText }}>
          {description}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm" style={{ color: theme.secondaryText }}>
          <span>🕒 {duration} minute demo</span>
          <span>•</span>
          <span>{timezone_note}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {['Today', 'Tomorrow', 'Monday'].map(day => {
          const daySlots = mockSlots.filter(slot => slot.day === day)
          const dayDate = daySlots[0]?.date

          return (
            <div key={day} className="space-y-3">
              <h4 className="font-medium text-lg" style={{ color: theme.primaryText }}>
                {day} {dayDate && <span className="text-sm font-normal" style={{ color: theme.secondaryText }}>({dayDate})</span>}
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daySlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available ? handleSlotSelect(slot.id) : null}
                    disabled={!slot.available}
                    className={`
                      p-3 rounded-lg border text-sm font-medium transition-all duration-200
                      ${slot.available ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                      ${selectedSlot === slot.id ? 'ring-2' : ''}
                    `}
                    style={{
                      backgroundColor: selectedSlot === slot.id 
                        ? `${theme.primaryColor}20` 
                        : slot.available 
                          ? theme.cardBackground 
                          : `${theme.backgroundColor}50`,
                      borderColor: selectedSlot === slot.id 
                        ? theme.primaryColor 
                        : theme.borderColor,
                      color: slot.available ? theme.primaryText : theme.secondaryText,
                      ringColor: selectedSlot === slot.id ? theme.primaryColor : 'transparent'
                    }}
                  >
                    {slot.time}
                    {!slot.available && <div className="text-xs mt-1">Unavailable</div>}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Time Display */}
      {selectedSlot && (
        <div 
          className="mt-8 p-4 rounded-lg border"
          style={{ 
            backgroundColor: `${theme.primaryColor}10`,
            borderColor: theme.primaryColor 
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
            <span className="font-medium" style={{ color: theme.primaryText }}>
              Demo scheduled for {mockSlots.find(slot => slot.id === selectedSlot)?.day} at {mockSlots.find(slot => slot.id === selectedSlot)?.time}
            </span>
          </div>
        </div>
      )}

      {/* Calendar Integration Note */}
      <div 
        className="mt-6 p-4 rounded-lg text-center text-sm"
        style={{ 
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
          color: theme.secondaryText 
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>📅</span>
          <span className="font-medium">Calendar Integration Coming Soon</span>
        </div>
        <p>This is a placeholder. In production, this will connect to your Google Calendar or preferred scheduling system.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${theme.errorColor}10` }}>
          <div className="flex items-start space-x-2">
            <svg className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: theme.errorColor }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm" style={{ color: theme.errorColor }}>
              {error}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}