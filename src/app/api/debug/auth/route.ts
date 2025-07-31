import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  try {
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({
        authenticated: false,
        error: authError.message,
        user: null,
        profiles: []
      })
    }

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        error: 'No user found',
        user: null,
        profiles: []
      })
    }

    // Get user profiles
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, businesses(name, email, slug)')
      .eq('user_id', user.id)

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profiles: userProfiles || [],
      profileError: profileError?.message || null
    })

  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      user: null,
      profiles: []
    })
  }
}