import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { createGoogleCalendarEvent } from '@/lib/googleCalendar'

interface MeetingEventRequest {
  widgetId: string
  submissionId?: string
  customerEmail?: string
  customerName?: string
  serviceType: string
  appointmentDatetime: string // ISO string
  duration: number // minutes
  location?: string
  notes?: string
  // Configuration options
  createMeetLink?: boolean
  sendCalendarInvite?: boolean
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
    const body: MeetingEventRequest = await request.json()
    
    const {
      widgetId,
      submissionId,
      customerEmail,
      customerName,
      serviceType,
      appointmentDatetime,
      duration,
      location,
      notes,
      createMeetLink = false,
      sendCalendarInvite = false
    } = body
    
    console.log('Creating meeting event:', {
      widgetId,
      submissionId,
      customerEmail: customerEmail ? '***' : undefined,
      serviceType,
      appointmentDatetime,
      duration,
      createMeetLink,
      sendCalendarInvite
    })

    // Get widget configuration
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, business_id, config, name')
      .eq('id', widgetId)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const schedulingConfig = widget.config?.scheduling
    if (!schedulingConfig?.enabled || !schedulingConfig.features?.meeting_booking) {
      return NextResponse.json(
        { success: false, error: 'Meeting booking not enabled for this widget' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Determine which calendar to use
    const primaryCalendar = schedulingConfig.primary_calendar || schedulingConfig.google_calendars?.[0]
    if (!primaryCalendar) {
      return NextResponse.json(
        { success: false, error: 'No calendar configured for meeting creation' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Calculate end time
    const startTime = new Date(appointmentDatetime)
    const endTime = new Date(startTime.getTime() + duration * 60000)

    // Create event description
    const description = [
      `Service: ${serviceType}`,
      customerName ? `Customer: ${customerName}` : undefined,
      customerEmail ? `Email: ${customerEmail}` : undefined,
      location ? `Location: ${location}` : undefined,
      notes ? `Notes: ${notes}` : undefined,
      `Booked via: ${widget.name}`
    ].filter(Boolean).join('\n')

    // Create Google Calendar event
    const eventResult = await createGoogleCalendarEvent(primaryCalendar, {
      summary: `${serviceType} - ${customerName || 'Customer'}`,
      description,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendeeEmail: sendCalendarInvite ? customerEmail : undefined,
      location,
      createMeetLink
    })

    if (!eventResult.success) {
      console.error('Failed to create Google Calendar event:', eventResult.error)
      return NextResponse.json(
        { success: false, error: `Failed to create calendar event: ${eventResult.error}` },
        { status: 500, headers: corsHeaders }
      )
    }

    // Save meeting event record
    const meetingData = {
      business_id: widget.business_id,
      widget_id: widgetId,
      submission_id: submissionId,
      google_calendar_id: primaryCalendar,
      google_event_id: eventResult.eventId!,
      customer_email: customerEmail,
      customer_name: customerName,
      service_type: serviceType,
      appointment_datetime: appointmentDatetime,
      duration,
      meet_link: eventResult.meetLink,
      status: 'scheduled'
    }

    const { data: meeting, error: meetingError } = await supabase
      .from('meeting_events')
      .insert(meetingData)
      .select()
      .single()

    if (meetingError) {
      console.error('Failed to save meeting event:', meetingError)
      // Event was created in Google Calendar but failed to save in our DB
      // This is not critical - the meeting still exists
    }

    return NextResponse.json({
      success: true,
      data: {
        meetingId: meeting?.id,
        googleEventId: eventResult.eventId,
        meetLink: eventResult.meetLink,
        calendarId: primaryCalendar,
        appointmentDatetime: appointmentDatetime,
        duration,
        status: 'scheduled'
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Meeting event creation error:', error)
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
      .from('meeting_events')
      .select('*')
      .in('status', ['scheduled', 'completed'])

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

    const { data: meetings, error } = await query.order('appointment_datetime', { ascending: true })

    if (error) {
      console.error('Failed to fetch meeting events:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch meetings' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({
      success: true,
      data: meetings
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Meeting event fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}