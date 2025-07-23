import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ embedKey: string }> }
) {
  try {
    const body = await request.json()
    const { widgetId, businessId, formData, pricing } = body

    if (!widgetId || !businessId || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Extract customer data
    const customer = {
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          ['name', 'email', 'phone', 'address'].includes(key)
        )
      )
    }

    // Extract service data
    const service = {
      type: formData.fenceType || formData.serviceType || '',
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          !['name', 'email', 'phone', 'address', 'linearFeet', 'gateCount'].includes(key) &&
          !key.includes('feet') && !key.includes('count') && !key.includes('area')
        )
      )
    }

    // Extract measurements
    const measurements = {
      linearFeet: formData.linearFeet || 0,
      gateCount: formData.gateCount || 0,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          key.includes('feet') || key.includes('count') || key.includes('area')
        )
      )
    }

    // Create estimate record
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .insert({
        business_id: businessId,
        widget_id: widgetId,
        customer,
        service,
        measurements,
        pricing: pricing || null, // Include pricing breakdown if available
        status: 'new',
        metadata: {
          source: 'widget',
          widgetKey: (await params).embedKey,
          submittedAt: new Date().toISOString(),
          hasPricing: !!pricing
        }
      })
      .select()
      .single()

    if (estimateError) {
      console.error('Error creating estimate:', estimateError)
      return NextResponse.json(
        { error: 'Failed to create estimate' },
        { status: 500 }
      )
    }

    // Log widget submission event
    await supabase
      .from('events')
      .insert({
        business_id: businessId,
        widget_id: widgetId,
        estimate_id: estimate.id,
        event_type: 'estimate_submitted',
        event_category: 'conversion',
        event_data: {
          formData: Object.keys(formData),
          timestamp: new Date().toISOString()
        }
      })

    // Update widget submission count
    await supabase.rpc('increment', {
      table_name: 'widgets',
      row_id: widgetId,
      column_name: 'submission_count'
    }).then(() => 
      supabase
        .from('widgets')
        .update({ last_submission_at: new Date().toISOString() })
        .eq('id', widgetId)
    )

    return NextResponse.json({ 
      success: true, 
      estimateId: estimate.id,
      message: 'Estimate submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting estimate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}