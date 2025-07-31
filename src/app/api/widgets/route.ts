import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAPISecurityHeaders } from '@/lib/security/security-headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getAPISecurityHeaders() }
      )
    }

    // Get user's business IDs from user_profiles
    const { data: userProfiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('business_id')
      .eq('user_id', user.id)

    if (profileError || !userProfiles || userProfiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No business access found' },
        { status: 403, headers: getAPISecurityHeaders() }
      )
    }

    const businessIds = userProfiles.map(profile => profile.business_id)

    // Get widgets only for user's businesses
    const { data: widgets, error } = await supabase
      .from('widgets')
      .select('id, name, embed_key, allowed_domains, security_enabled, embed_restrictions, created_at')
      .in('business_id', businessIds)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching widgets:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch widgets' },
        { status: 500, headers: getAPISecurityHeaders() }
      )
    }

    const processedWidgets = widgets.map(widget => ({
      id: widget.id,
      name: widget.name,
      embed_key: widget.embed_key,
      allowed_domains: widget.allowed_domains || [],
      security_enabled: widget.security_enabled !== false,
      embed_restrictions: widget.embed_restrictions || {
        require_https: true,
        block_iframes: false,
        max_embeds_per_domain: 10,
        rate_limit_per_hour: 1000
      },
      created_at: widget.created_at
    }))

    return NextResponse.json({
      success: true,
      data: processedWidgets
    }, { headers: getAPISecurityHeaders() })

  } catch (error) {
    console.error('Error in widgets API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getAPISecurityHeaders() }
    )
  }
}