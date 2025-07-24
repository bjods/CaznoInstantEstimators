import { NextRequest, NextResponse } from 'next/server'

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
    const body = await request.json()
    const { calendars, timezone = 'America/New_York' } = body

    if (!calendars || !Array.isArray(calendars) || calendars.length === 0) {
      return NextResponse.json(
        { success: false, error: 'calendars array is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if Google Calendar credentials are configured
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_PRIVATE_KEY_ID) {
      return NextResponse.json({
        success: false,
        error: 'Google Calendar credentials not configured',
        details: {
          serviceAccount: 'calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
          missingEnvVars: [
            !process.env.GOOGLE_PRIVATE_KEY && 'GOOGLE_PRIVATE_KEY',
            !process.env.GOOGLE_PRIVATE_KEY_ID && 'GOOGLE_PRIVATE_KEY_ID',
            !process.env.GOOGLE_CLIENT_ID && 'GOOGLE_CLIENT_ID'
          ].filter(Boolean),
          instructions: 'Please set the required environment variables and ensure the service account has access to the calendars.'
        }
      }, { headers: corsHeaders })
    }

    // Test Google Calendar connection
    const { testGoogleCalendarConnection } = await import('@/lib/googleCalendar')
    
    const result = await testGoogleCalendarConnection(calendars, timezone)

    return NextResponse.json({
      success: result.success,
      data: {
        serviceAccount: 'calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
        testedCalendars: calendars,
        accessibleCalendars: result.accessibleCalendars,
        errors: result.errors,
        timezone,
        instructions: result.errors.length > 0 ? [
          '1. Share each calendar with: calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
          '2. Grant "See all event details" permission',
          '3. Ensure the calendar email addresses are correct'
        ] : undefined
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Calendar test error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to test Google Calendar connection',
      details: {
        serviceAccount: 'calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        instructions: [
          '1. Verify Google Calendar credentials are set correctly',
          '2. Share calendars with: calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
          '3. Grant "See all event details" permission',
          '4. Check that calendar email addresses are correct'
        ]
      }
    }, { status: 500, headers: corsHeaders })
  }
}