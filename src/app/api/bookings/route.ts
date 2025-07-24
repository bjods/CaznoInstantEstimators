import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface BookingRequest {
  widgetId: string
  submissionId?: string
  customerEmail?: string
  customerName?: string
  inventoryItemId?: string
  serviceType: string
  appointmentDatetime: string // ISO string
  duration: number // minutes
  notes?: string
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

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: BookingRequest = await request.json()
    
    const {
      widgetId,
      submissionId,
      customerEmail,
      customerName,
      inventoryItemId,
      serviceType,
      appointmentDatetime,
      duration,
      notes
    } = body
    
    console.log('Creating booking:', {
      widgetId,
      submissionId,
      customerEmail: customerEmail ? '***' : undefined,
      serviceType,
      appointmentDatetime,
      duration
    })

    // Get widget to find business_id
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, business_id')
      .eq('id', widgetId)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Check for booking conflicts
    const appointmentDate = new Date(appointmentDatetime)
    const appointmentEnd = new Date(appointmentDate.getTime() + duration * 60000)

    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id, appointment_datetime, duration')
      .eq('business_id', widget.business_id)
      .gte('appointment_datetime', appointmentDate.toISOString())
      .lte('appointment_datetime', appointmentEnd.toISOString())
      .in('status', ['pending', 'confirmed'])

    if (conflictError) {
      console.error('Error checking for conflicts:', conflictError)
      return NextResponse.json(
        { success: false, error: 'Failed to check availability' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Check for actual time conflicts (not just start times)
    const hasConflict = conflictingBookings?.some(booking => {
      const existingStart = new Date(booking.appointment_datetime)
      const existingEnd = new Date(existingStart.getTime() + booking.duration * 60000)
      
      // Check if there's any overlap
      return appointmentDate < existingEnd && appointmentEnd > existingStart
    })

    if (hasConflict) {
      return NextResponse.json(
        { success: false, error: 'Time slot is no longer available' },
        { status: 409, headers: corsHeaders }
      )
    }

    // Create the booking
    const bookingData = {
      business_id: widget.business_id,
      widget_id: widgetId,
      submission_id: submissionId,
      customer_email: customerEmail,
      customer_name: customerName,
      inventory_item_id: inventoryItemId,
      service_type: serviceType,
      appointment_datetime: appointmentDatetime,
      duration,
      status: 'pending',
      notes
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single()

    if (bookingError) {
      console.error('Failed to create booking:', bookingError)
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingId: booking.id,
        appointmentDatetime: booking.appointment_datetime,
        status: booking.status
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Booking creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')
    const widgetId = searchParams.get('widgetId')
    const date = searchParams.get('date') // YYYY-MM-DD format

    if (!businessId && !widgetId) {
      return NextResponse.json(
        { success: false, error: 'businessId or widgetId required' },
        { status: 400, headers: corsHeaders }
      )
    }

    let query = supabase
      .from('bookings')
      .select('*')
      .in('status', ['pending', 'confirmed', 'completed'])

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    if (widgetId) {
      query = query.eq('widget_id', widgetId)
    }

    if (date) {
      const startOfDay = `${date}T00:00:00.000Z`
      const endOfDay = `${date}T23:59:59.999Z`
      query = query.gte('appointment_datetime', startOfDay).lte('appointment_datetime', endOfDay)
    }

    const { data: bookings, error } = await query.order('appointment_datetime', { ascending: true })

    if (error) {
      console.error('Failed to fetch bookings:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({
      success: true,
      data: bookings
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}