import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAPISecurityHeaders } from '@/lib/security/security-headers'
import { z } from 'zod'

// Validation schema for security settings update
const securityUpdateSchema = z.object({
  allowed_domains: z.array(z.string().min(1, 'Domain cannot be empty')).optional(),
  security_enabled: z.boolean().optional(),
  embed_restrictions: z.object({
    require_https: z.boolean().optional(),
    block_iframes: z.boolean().optional(),
    max_embeds_per_domain: z.number().min(1).max(1000).optional(),
    rate_limit_per_hour: z.number().min(100).max(10000).optional()
  }).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { widgetId: string } }
) {
  try {
    const supabase = createClient()
    const { widgetId } = params

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getAPISecurityHeaders() }
      )
    }

    // Validate widget ID format
    if (!widgetId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(widgetId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid widget ID format' },
        { status: 400, headers: getAPISecurityHeaders() }
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

    // Get widget security settings (only for user's businesses)
    const { data: widget, error } = await supabase
      .from('widgets')
      .select('id, name, embed_key, allowed_domains, security_enabled, embed_restrictions')
      .eq('id', widgetId)
      .in('business_id', businessIds)
      .single()

    if (error || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: getAPISecurityHeaders() }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: widget.id,
        name: widget.name,
        embed_key: widget.embed_key,
        allowed_domains: widget.allowed_domains || [],
        security_enabled: widget.security_enabled !== false, // Default to true
        embed_restrictions: widget.embed_restrictions || {
          require_https: true,
          block_iframes: false,
          max_embeds_per_domain: 10,
          rate_limit_per_hour: 1000
        }
      }
    }, { headers: getAPISecurityHeaders() })

  } catch (error) {
    console.error('Error fetching widget security settings:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getAPISecurityHeaders() }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { widgetId: string } }
) {
  try {
    const supabase = createClient()
    const { widgetId } = params

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401, headers: getAPISecurityHeaders() }
      )
    }

    // Validate widget ID format
    if (!widgetId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(widgetId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid widget ID format' },
        { status: 400, headers: getAPISecurityHeaders() }
      )
    }

    // Parse and validate request body
    let updateData
    try {
      const body = await request.json()
      updateData = securityUpdateSchema.parse(body)
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400, headers: getAPISecurityHeaders() }
      )
    }

    // Validate domains if provided
    if (updateData.allowed_domains) {
      for (const domain of updateData.allowed_domains) {
        // Basic domain validation
        const domainRegex = /^(\*\.)?[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/
        if (!domainRegex.test(domain)) {
          return NextResponse.json(
            { success: false, error: `Invalid domain format: ${domain}` },
            { status: 400, headers: getAPISecurityHeaders() }
          )
        }
      }
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

    // Check if widget exists and user has access
    const { data: existingWidget } = await supabase
      .from('widgets')
      .select('id, business_id')
      .eq('id', widgetId)
      .in('business_id', businessIds)
      .single()

    if (!existingWidget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' },
        { status: 404, headers: getAPISecurityHeaders() }
      )
    }

    // Update widget security settings
    const { data: updatedWidget, error: updateError } = await supabase
      .from('widgets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', widgetId)
      .select('id, name, embed_key, allowed_domains, security_enabled, embed_restrictions')
      .single()

    if (updateError || !updatedWidget) {
      console.error('Error updating widget security settings:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update security settings' },
        { status: 500, headers: getAPISecurityHeaders() }
      )
    }

    // Log security configuration change
    await supabase.rpc('log_security_event', {
      p_event_type: 'security_config_updated',
      p_widget_id: widgetId,
      p_business_id: existingWidget.business_id,
      p_source_domain: null,
      p_source_ip: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 'unknown',
      p_user_agent: request.headers.get('user-agent'),
      p_request_details: {
        allowed_domains: updateData.allowed_domains,
        security_enabled: updateData.security_enabled,
        embed_restrictions: updateData.embed_restrictions
      },
      p_severity: 'info'
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedWidget.id,
        name: updatedWidget.name,
        embed_key: updatedWidget.embed_key,
        allowed_domains: updatedWidget.allowed_domains || [],
        security_enabled: updatedWidget.security_enabled !== false,
        embed_restrictions: updatedWidget.embed_restrictions || {
          require_https: true,
          block_iframes: false,
          max_embeds_per_domain: 10,
          rate_limit_per_hour: 1000
        }
      }
    }, { headers: getAPISecurityHeaders() })

  } catch (error) {
    console.error('Error updating widget security settings:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: getAPISecurityHeaders() }
    )
  }
}