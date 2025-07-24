'use client'

import { CalendarScheduler } from '@/components/calendar/CalendarScheduler'
import { SchedulingConfig } from '@/types'

interface SchedulingInputProps {
  widgetId: string
  scheduling: SchedulingConfig
  serviceType?: string
  inventoryType?: string
  requiredQuantity?: number
  value?: {
    datetime: Date
    time: string
  }
  onChange: (value: { datetime: Date; time: string } | null) => void
  onMeetingBooked?: (appointmentSlot: { datetime: Date; time: string }) => void
  error?: string
}

export function SchedulingInput({
  widgetId,
  scheduling,
  serviceType,
  inventoryType,
  requiredQuantity,
  value,
  onChange,
  onMeetingBooked,
  error
}: SchedulingInputProps) {
  const handleSlotSelect = (slot: { datetime: Date; time: string } | null) => {
    onChange(slot)
    
    // If meeting booking is enabled and a slot is selected, trigger completion
    if (slot && scheduling.features?.meeting_booking && onMeetingBooked) {
      onMeetingBooked(slot)
    }
  }
  if (!scheduling.enabled) {
    return null
  }

  return (
    <div className="space-y-2">
      <CalendarScheduler
        widgetId={widgetId}
        scheduling={scheduling}
        serviceType={serviceType}
        inventoryType={inventoryType}
        requiredQuantity={requiredQuantity}
        selectedSlot={value}
        onSlotSelect={handleSlotSelect}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}