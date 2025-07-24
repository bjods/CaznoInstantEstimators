import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface AvailabilityRequest {
  widgetId: string
  date: string // YYYY-MM-DD format
  serviceType?: string
  inventoryType?: string
  quantity?: number
}

// Handle CORS preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

function generateTimeSlots(
  startTime: string, 
  endTime: string, 
  duration: number, 
  buffer: number,
  date: string,
  timezone: string
): { datetime: Date; time: string }[] {
  const slots: { datetime: Date; time: string }[] = []
  
  // Parse start and end times
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)
  
  // Create date objects for the specific date
  const startDateTime = new Date(`${date}T${startTime}:00`)
  const endDateTime = new Date(`${date}T${endTime}:00`)
  
  // Generate slots
  let currentTime = new Date(startDateTime)
  
  while (currentTime < endDateTime) {
    // Check if we have enough time for a full appointment before end time
    const slotEndTime = new Date(currentTime.getTime() + duration * 60000)
    if (slotEndTime <= endDateTime) {
      slots.push({
        datetime: new Date(currentTime),
        time: currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      })
    }
    
    // Move to next slot (duration + buffer)
    currentTime = new Date(currentTime.getTime() + (duration + buffer) * 60000)
  }
  
  return slots
}

async function checkGoogleCalendarBusy(
  calendars: string[],
  date: string,
  timezone: string
): Promise<{ start: string; end: string }[]> {
  if (!calendars.length) {
    return []
  }

  try {
    const { getGoogleCalendarBusyTimes } = await import('@/lib/googleCalendar')
    
    // Create time range for the entire day
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`
    
    const busyTimes = await getGoogleCalendarBusyTimes(
      calendars,
      startOfDay,
      endOfDay,
      timezone
    )
    
    return busyTimes

  } catch (error) {
    console.error('Failed to check Google Calendar:', error)
    // Return empty array to gracefully degrade
    return []
  }
}

function removeConflicts(
  slots: { datetime: Date; time: string }[],
  busyTimes: { start: string; end: string }[],
  buffer: number
): { datetime: Date; time: string; available: boolean }[] {
  return slots.map(slot => {
    const slotStart = slot.datetime
    const slotEnd = new Date(slotStart.getTime() + 60 * 60000) // Assume 60min appointments for conflict checking
    
    // Check if slot conflicts with any busy time
    const hasConflict = busyTimes.some(busy => {
      const busyStart = new Date(busy.start)
      const busyEnd = new Date(busy.end)
      
      // Add buffer time to busy periods
      const busyStartWithBuffer = new Date(busyStart.getTime() - buffer * 60000)
      const busyEndWithBuffer = new Date(busyEnd.getTime() + buffer * 60000)
      
      // Check for overlap
      return slotStart < busyEndWithBuffer && slotEnd > busyStartWithBuffer
    })
    
    return {
      ...slot,
      available: !hasConflict
    }
  })
}

async function checkInventoryAvailability(
  supabase: any,
  businessId: string,
  inventoryType: string,
  date: string,
  quantity: number = 1
): Promise<number> {
  // Get total inventory for this type
  const { data: inventory, error: inventoryError } = await supabase
    .from('inventory_items')
    .select('quantity')
    .eq('business_id', businessId)
    .eq('type', inventoryType)
    .eq('is_active', true)
  
  if (inventoryError || !inventory?.length) {
    return 0
  }
  
  const totalInventory = inventory.reduce((sum: number, item: any) => sum + item.quantity, 0)
  
  // Get bookings for this date
  const startOfDay = `${date}T00:00:00.000Z`
  const endOfDay = `${date}T23:59:59.999Z`
  
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .eq('business_id', businessId)
    .gte('appointment_datetime', startOfDay)
    .lte('appointment_datetime', endOfDay)
    .in('status', ['pending', 'confirmed'])
  
  if (bookingsError) {
    console.error('Error checking bookings:', bookingsError)
    return 0
  }
  
  // Calculate used inventory for this date
  const usedInventory = bookings?.length || 0
  
  return Math.max(0, totalInventory - usedInventory)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: AvailabilityRequest = await request.json()
    
    const { widgetId, date, serviceType, inventoryType, quantity = 1 } = body
    
    // Get widget configuration
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, business_id, config')
      .eq('id', widgetId)
      .single()
    
    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: corsHeaders }
      )
    }
    
    const schedulingConfig = widget.config?.scheduling
    if (!schedulingConfig?.enabled) {
      return NextResponse.json(
        { success: false, error: 'Scheduling not enabled for this widget' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    // Get day of week
    const dateObj = new Date(date)
    const dayOfWeek = dateObj.toLocaleDateString('en', { weekday: 'lowercase' }) as keyof typeof schedulingConfig.business_hours
    const businessHours = schedulingConfig.business_hours[dayOfWeek]
    
    // Check if business is open this day
    if (!businessHours) {
      return NextResponse.json({
        success: true,
        data: {
          date,
          slots: [],
          reason: 'Closed on this day'
        }
      }, { headers: corsHeaders })
    }
    
    // Generate base time slots from business hours
    const baseSlots = generateTimeSlots(
      businessHours.start,
      businessHours.end,
      schedulingConfig.duration,
      schedulingConfig.buffer,
      date,
      schedulingConfig.timezone
    )
    
    // Check Google Calendar conflicts if configured
    let availableSlots = baseSlots.map(slot => ({ ...slot, available: true }))
    
    if (schedulingConfig.google_calendars?.length) {
      const busyTimes = await checkGoogleCalendarBusy(
        schedulingConfig.google_calendars,
        date,
        schedulingConfig.timezone
      )
      
      availableSlots = removeConflicts(
        baseSlots,
        busyTimes,
        schedulingConfig.buffer
      )
    }
    
    // Check inventory availability if needed
    let inventoryAvailable = undefined
    if (inventoryType) {
      inventoryAvailable = await checkInventoryAvailability(
        supabase,
        widget.business_id,
        inventoryType,
        date,
        quantity
      )
      
      // Mark slots as unavailable if insufficient inventory
      if (inventoryAvailable < quantity) {
        availableSlots = availableSlots.map(slot => ({
          ...slot,
          available: false
        }))
      }
    }
    
    // Filter out past times if date is today
    const now = new Date()
    const isToday = dateObj.toDateString() === now.toDateString()
    
    if (isToday) {
      const minNoticeMs = (schedulingConfig.min_hours_notice || 2) * 60 * 60 * 1000
      const cutoffTime = new Date(now.getTime() + minNoticeMs)
      
      availableSlots = availableSlots.map(slot => ({
        ...slot,
        available: slot.available && slot.datetime > cutoffTime
      }))
    }
    
    return NextResponse.json({
      success: true,
      data: {
        date,
        slots: availableSlots,
        inventoryAvailable,
        businessHours,
        schedulingConfig: {
          duration: schedulingConfig.duration,
          buffer: schedulingConfig.buffer,
          timezone: schedulingConfig.timezone
        }
      }
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('Availability check error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}