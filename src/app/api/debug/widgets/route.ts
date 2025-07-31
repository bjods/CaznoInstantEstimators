import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  try {
    // Bypass authentication - just show what widgets exist for brad's user ID
    const bradUserId = '16a6e419-e238-4b89-891a-71c6d3aa79f1'
    
    // Get user profiles for brad
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('business_id')
      .eq('user_id', bradUserId)

    if (profileError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to get user profiles',
        debug: { profileError: profileError.message }
      })
    }

    const businessIds = userProfiles?.map(profile => profile.business_id) || []

    // Get widgets for those businesses
    const { data: widgets, error: widgetsError } = await supabase
      .from('widgets')
      .select('id, business_id, name, embed_key, is_active, created_at')
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })

    // Get all widgets in database for comparison
    const { data: allWidgets, error: allWidgetsError } = await supabase
      .from('widgets')
      .select('id, business_id, name, embed_key, is_active')
      .order('created_at', { ascending: false })

    // Get all businesses
    const { data: allBusinesses, error: businessesError } = await supabase
      .from('businesses')
      .select('id, name, email, slug')

    // Get all user profiles
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('user_profiles')
      .select('user_id, business_id, role')

    return NextResponse.json({
      success: true,
      bradUserId,
      userProfiles: userProfiles || [],
      businessIds,
      bradWidgets: widgets || [],
      totalWidgets: allWidgets?.length || 0,
      allWidgets: allWidgets || [],
      allBusinesses: allBusinesses || [],
      allProfiles: allProfiles || [],
      errors: {
        profileError: profileError?.message || null,
        widgetsError: widgetsError?.message || null,
        allWidgetsError: allWidgetsError?.message || null,
        businessesError: businessesError?.message || null,
        allProfilesError: allProfilesError?.message || null
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        errorType: error?.constructor?.name || 'Unknown'
      }
    })
  }
}