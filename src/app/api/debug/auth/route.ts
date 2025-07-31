import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Get all cookies for debugging
    const cookies = request.cookies.getAll()
    const supabaseCookies = cookies.filter(cookie => 
      cookie.name.startsWith('sb-') || cookie.name.includes('supabase')
    )

    if (authError) {
      return NextResponse.json({
        authenticated: false,
        error: authError.message,
        user: null,
        profiles: [],
        debug: {
          hasSupabaseUrl: !!supabaseUrl,
          hasSupabaseKey: !!supabaseAnonKey,
          totalCookies: cookies.length,
          supabaseCookies: supabaseCookies.map(c => ({name: c.name, hasValue: !!c.value})),
          userAgent: request.headers.get('user-agent'),
          origin: request.headers.get('origin'),
          referer: request.headers.get('referer')
        }
      })
    }

    if (!user) {
      // Still show debug info even when no user
      return NextResponse.json({
        authenticated: false,
        error: 'No user found',
        user: null,
        profiles: [],
        debug: {
          hasSupabaseUrl: !!supabaseUrl,
          hasSupabaseKey: !!supabaseAnonKey,
          totalCookies: cookies.length,
          supabaseCookies: supabaseCookies.map(c => ({name: c.name, hasValue: !!c.value})),
          userAgent: request.headers.get('user-agent'),
          origin: request.headers.get('origin'),
          referer: request.headers.get('referer')
        }
      })
    }

    // Get user profiles
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, businesses(name, email, slug)')
      .eq('user_id', user.id)

    // Also check if brad@cazno.io exists in database
    const { data: bradUser, error: bradError } = await supabase
      .from('user_profiles')
      .select('*, businesses(name, email, slug)')
      .eq('user_id', '16a6e419-e238-4b89-891a-71c6d3aa79f1')

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profiles: userProfiles || [],
      profileError: profileError?.message || null,
      debug: {
        hasSupabaseUrl: !!supabaseUrl,
        hasSupabaseKey: !!supabaseAnonKey,
        totalCookies: cookies.length,
        supabaseCookies: supabaseCookies.map(c => ({name: c.name, hasValue: !!c.value})),
        bradUserProfiles: bradUser || [],
        bradError: bradError?.message || null
      }
    })

  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      user: null,
      profiles: [],
      debug: {
        errorType: error?.constructor?.name || 'Unknown',
        errorStack: error instanceof Error ? error.stack : null
      }
    })
  }
}