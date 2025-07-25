import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, priority } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Send an email to support@cazno.com
    // 2. Store the message in a database
    // 3. Create a support ticket
    
    // For now, we'll just log it and return success
    console.log('Support request received:', {
      name,
      email,
      subject,
      message,
      priority,
      timestamp: new Date().toISOString()
    })

    // In a real implementation, you might use a service like:
    // - Nodemailer for sending emails
    // - A ticketing system API
    // - Store in Supabase for tracking

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}