import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAPISecurityHeaders } from '@/lib/security/security-headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get all widgets for the business (in a real app, this would be filtered by authenticated user)
    const { data: widgets, error } = await supabase
      .from('widgets')
      .select('id, name, embed_key, allowed_domains, security_enabled, embed_restrictions, created_at')
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