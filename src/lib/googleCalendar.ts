import { GoogleAuth } from 'google-auth-library'

interface BusyTime {
  start: string
  end: string
}

interface FreeBusyResponse {
  timeMin: string
  timeMax: string
  calendars: {
    [key: string]: {
      busy: BusyTime[]
      errors?: Array<{
        domain: string
        reason: string
      }>
    }
  }
}

// Initialize Google Auth with service account
function getGoogleAuth() {
  try {
    const credentials = {
      type: 'service_account',
      project_id: 'daring-harmony-429818-q6',
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: 'calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com',
      client_id: process.env.GOOGLE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/calendar-reader%40daring-harmony-429818-q6.iam.gserviceaccount.com`
    }

    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    })

    return auth
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error)
    throw new Error('Google Calendar authentication failed')
  }
}

export async function getGoogleCalendarBusyTimes(
  calendars: string[],
  timeMin: string,
  timeMax: string,
  timezone: string = 'America/New_York'
): Promise<BusyTime[]> {
  try {
    // Return empty array if no Google credentials configured
    if (!process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_PRIVATE_KEY_ID) {
      console.warn('Google Calendar credentials not configured, skipping calendar check')
      return []
    }

    const auth = getGoogleAuth()
    const authClient = await auth.getClient()

    // Prepare the freebusy request
    const requestBody = {
      timeMin,
      timeMax,
      timeZone: timezone,
      items: calendars.map(email => ({ id: email }))
    }

    // Make the freebusy query
    const response = await authClient.request({
      url: 'https://www.googleapis.com/calendar/v3/freeBusy',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody
    })

    const freeBusyData = response.data as FreeBusyResponse

    // Aggregate all busy times from all calendars
    const allBusyTimes: BusyTime[] = []

    for (const [calendarId, calendarData] of Object.entries(freeBusyData.calendars)) {
      if (calendarData.errors?.length) {
        console.warn(`Calendar ${calendarId} has errors:`, calendarData.errors)
        continue
      }

      if (calendarData.busy?.length) {
        allBusyTimes.push(...calendarData.busy)
      }
    }

    // Sort busy times by start time
    allBusyTimes.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    console.log(`Found ${allBusyTimes.length} busy periods across ${calendars.length} calendars`)
    return allBusyTimes

  } catch (error) {
    console.error('Google Calendar API error:', error)
    
    // Return empty array to gracefully degrade
    // This allows the system to still work with just business hours
    return []
  }
}

export async function testGoogleCalendarConnection(
  calendars: string[],
  timezone: string = 'America/New_York'
): Promise<{
  success: boolean
  accessibleCalendars: string[]
  errors: Array<{ calendar: string; error: string }>
}> {
  try {
    const auth = getGoogleAuth()
    const authClient = await auth.getClient()

    // Test with a small time window (next hour)
    const now = new Date()
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)

    const requestBody = {
      timeMin: now.toISOString(),
      timeMax: nextHour.toISOString(),
      timeZone: timezone,
      items: calendars.map(email => ({ id: email }))
    }

    const response = await authClient.request({
      url: 'https://www.googleapis.com/calendar/v3/freeBusy',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody
    })

    const freeBusyData = response.data as FreeBusyResponse
    
    const accessibleCalendars: string[] = []
    const errors: Array<{ calendar: string; error: string }> = []

    for (const [calendarId, calendarData] of Object.entries(freeBusyData.calendars)) {
      if (calendarData.errors?.length) {
        errors.push({
          calendar: calendarId,
          error: calendarData.errors.map(e => `${e.domain}: ${e.reason}`).join(', ')
        })
      } else {
        accessibleCalendars.push(calendarId)
      }
    }

    return {
      success: true,
      accessibleCalendars,
      errors
    }

  } catch (error) {
    console.error('Google Calendar test failed:', error)
    return {
      success: false,
      accessibleCalendars: [],
      errors: [{ calendar: 'all', error: error instanceof Error ? error.message : 'Unknown error' }]
    }
  }
}