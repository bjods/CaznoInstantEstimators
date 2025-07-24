import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { businessName, phone, slug } = await request.json()

    // Check if user already has a business
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('business_id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'User already has a business' },
        { status: 400 }
      )
    }

    // Create the business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        name: businessName,
        slug: slug || businessName.toLowerCase().replace(/\s+/g, '-'),
        email: user.email,
        phone: phone || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (businessError) {
      console.error('Business creation error:', businessError)
      return NextResponse.json(
        { success: false, error: 'Failed to create business' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { business }
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}