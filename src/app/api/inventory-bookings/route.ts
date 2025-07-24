import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

interface InventoryBookingRequest {
  widgetId: string
  submissionId?: string
  customerEmail?: string
  customerName?: string
  inventoryItemId: string
  serviceType: string
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD for multi-day rentals
  quantity: number
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
    const body: InventoryBookingRequest = await request.json()
    
    const {
      widgetId,
      submissionId,
      customerEmail,
      customerName,
      inventoryItemId,
      serviceType,
      startDate,
      endDate,
      quantity,
      notes
    } = body
    
    console.log('Creating inventory booking:', {
      widgetId,
      submissionId,
      customerEmail: customerEmail ? '***' : undefined,
      inventoryItemId,
      serviceType,
      startDate,
      endDate,
      quantity
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

    // Get inventory item to validate it exists and belongs to this business
    const { data: inventoryItem, error: inventoryError } = await supabase
      .from('inventory_items')
      .select('id, quantity, name')
      .eq('id', inventoryItemId)
      .eq('business_id', widget.business_id)
      .eq('is_active', true)
      .single()

    if (inventoryError || !inventoryItem) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    // Check if enough inventory is available for the date range
    const dateRangeQuery = supabase
      .from('inventory_bookings')
      .select('quantity')
      .eq('inventory_item_id', inventoryItemId)
      .eq('status', 'active')
      .lte('start_date', endDate || startDate)

    if (endDate) {
      dateRangeQuery.or(`end_date.is.null,end_date.gte.${startDate}`)
    } else {
      dateRangeQuery.or(`end_date.is.null,end_date.gte.${startDate}`)
    }

    const { data: conflictingBookings, error: conflictError } = await dateRangeQuery

    if (conflictError) {
      console.error('Error checking inventory conflicts:', conflictError)
      return NextResponse.json(
        { success: false, error: 'Failed to check availability' },
        { status: 500, headers: corsHeaders }
      )
    }

    const bookedQuantity = conflictingBookings?.reduce((sum, booking) => sum + booking.quantity, 0) || 0
    const availableQuantity = inventoryItem.quantity - bookedQuantity

    if (availableQuantity < quantity) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient inventory. Available: ${availableQuantity}, Requested: ${quantity}` 
        },
        { status: 409, headers: corsHeaders }
      )
    }

    // Create the inventory booking
    const bookingData = {
      business_id: widget.business_id,
      widget_id: widgetId,
      submission_id: submissionId,
      inventory_item_id: inventoryItemId,
      customer_email: customerEmail,
      customer_name: customerName,
      service_type: serviceType,
      start_date: startDate,
      end_date: endDate,
      quantity,
      status: 'active',
      notes
    }

    const { data: booking, error: bookingError } = await supabase
      .from('inventory_bookings')
      .insert(bookingData)
      .select()
      .single()

    if (bookingError) {
      console.error('Failed to create inventory booking:', bookingError)
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingId: booking.id,
        inventoryItem: inventoryItem.name,
        startDate: booking.start_date,
        endDate: booking.end_date,
        quantity: booking.quantity,
        status: booking.status
      }
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Inventory booking creation error:', error)
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
    const inventoryItemId = searchParams.get('inventoryItemId')
    const date = searchParams.get('date') // YYYY-MM-DD format

    if (!businessId && !widgetId) {
      return NextResponse.json(
        { success: false, error: 'businessId or widgetId required' },
        { status: 400, headers: corsHeaders }
      )
    }

    let query = supabase
      .from('inventory_bookings')
      .select(`
        *,
        inventory_items (
          name,
          type,
          sku
        )
      `)
      .eq('status', 'active')

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    if (widgetId) {
      query = query.eq('widget_id', widgetId)
    }

    if (inventoryItemId) {
      query = query.eq('inventory_item_id', inventoryItemId)
    }

    if (date) {
      query = query.lte('start_date', date).or(`end_date.is.null,end_date.gte.${date}`)
    }

    const { data: bookings, error } = await query.order('start_date', { ascending: true })

    if (error) {
      console.error('Failed to fetch inventory bookings:', error)
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
    console.error('Inventory booking fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}