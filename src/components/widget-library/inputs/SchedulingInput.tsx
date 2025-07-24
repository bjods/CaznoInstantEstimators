'use client'

import { SimplifiedCalendarScheduler } from '@/components/calendar/SimplifiedCalendarScheduler'
import { SchedulingConfig, SchedulingSelection } from '@/types'

interface SchedulingInputProps {
  scheduling: SchedulingConfig
  serviceType?: string
  value?: SchedulingSelection
  onChange: (value: SchedulingSelection | null) => void
  onMeetingBooked?: (appointment: SchedulingSelection) => void
  error?: string
}

export function SchedulingInput({
  scheduling,
  serviceType,
  value,
  onChange,
  onMeetingBooked,
  error
}: SchedulingInputProps) {
  const handleSchedulingChange = (selection: SchedulingSelection | null) => {
    onChange(selection)
    
    // If meeting mode and appointment is selected, trigger completion
    if (selection && selection.mode === 'meeting' && selection.appointment_datetime && onMeetingBooked) {
      onMeetingBooked(selection)
    }
  }

  if (!scheduling.enabled) {
    return null
  }

  return (
    <div className="space-y-2">
      <SimplifiedCalendarScheduler
        scheduling={scheduling}
        serviceType={serviceType}
        value={value}
        onChange={handleSchedulingChange}
        error={error}
      />
    </div>
  )
}