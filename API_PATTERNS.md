# API Route Patterns

## Basic Route Structure

Every API route must follow this pattern:

```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Use service key for API routes
)

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Extract params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    // Validate
    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }
    
    // Query database
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) throw error
    
    // Return success
    return NextResponse.json({ data })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json()
    
    // Validate required fields
    const required = ['field1', 'field2']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Insert to database
    const { data, error } = await supabase
      .from('table_name')
      .insert(body)
      .select()
      .single()
      
    if (error) throw error
    
    // Return created resource
    return NextResponse.json({ data }, { status: 201 })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Dynamic Route Pattern

```typescript
// src/app/api/widgets/[embedKey]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { embedKey: string } }
) {
  try {
    const { embedKey } = params
    
    const { data: widget, error } = await supabase
      .from('widgets')
      .select(`
        *,
        business:businesses(*)
      `)
      .eq('embed_key', embedKey)
      .eq('is_active', true)
      .single()
      
    if (error || !widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ 
      data: widget,
      // Add cache headers for performance
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Response Patterns

### Success Response
```typescript
// Single resource
return NextResponse.json({
  data: resource
})

// List with pagination
return NextResponse.json({
  data: resources,
  meta: {
    total: count,
    page: 1,
    per_page: 20
  }
})

// Action completed
return NextResponse.json({
  success: true,
  message: 'Email sent successfully'
})
```

### Error Response
```typescript
// Client error (4xx)
return NextResponse.json({
  error: {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: {
      field: 'email',
      issue: 'Invalid email format'
    }
  }
}, { status: 400 })

// Server error (5xx)
return NextResponse.json({
  error: {
    message: 'Something went wrong',
    code: 'INTERNAL_ERROR'
  }
}, { status: 500 })
```

## Common API Patterns

### Widget Config API
```typescript
// src/app/api/widget-config/[embedKey]/route.ts
export async function GET(request: NextRequest, { params }) {
  const { data: widget } = await supabase
    .from('widgets')
    .select('theme, config, fields')
    .eq('embed_key', params.embedKey)
    .single()
    
  // Return only what frontend needs
  return NextResponse.json({
    theme: widget.theme,
    config: widget.config,
    fields: widget.fields
  })
}
```

### Estimate Submission API
```typescript
// src/app/api/estimates/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Create estimate
  const { data: estimate } = await supabase
    .from('estimates')
    .insert({
      widget_id: body.widgetId,
      customer: body.customer,
      service: body.service,
      measurements: body.measurements,
      metadata: {
        ip: request.ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      }
    })
    .select()
    .single()
    
  // Trigger async processes (pricing, notifications)
  await triggerPricingWebhook(estimate.id)
  
  return NextResponse.json({
    success: true,
    estimateId: estimate.id,
    message: 'Your estimate has been submitted'
  })
}
```

### List with Filters API
```typescript
// src/app/api/estimates/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Parse query params
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  // Build query
  let query = supabase
    .from('estimates')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
    
  // Apply filters
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error, count } = await query
  
  return NextResponse.json({
    data,
    meta: {
      total: count,
      page,
      per_page: limit,
      total_pages: Math.ceil(count / limit)
    }
  })
}
```

### Update with Partial Data
```typescript
// src/app/api/estimates/[id]/route.ts
export async function PATCH(request: NextRequest, { params }) {
  const updates = await request.json()
  
  // Only update provided fields
  const { data, error } = await supabase
    .from('estimates')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()
    
  if (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 400 }
    )
  }
  
  return NextResponse.json({ data })
}
```

## Webhook Pattern

```typescript
// src/app/api/webhook/route.ts
export async function POST(request: NextRequest) {
  // Verify webhook signature (if applicable)
  const signature = request.headers.get('x-webhook-signature')
  if (!verifySignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  const event = await request.json()
  
  // Process based on event type
  switch (event.type) {
    case 'estimate.created':
      await handleNewEstimate(event.data)
      break
    case 'payment.completed':
      await handlePayment(event.data)
      break
    default:
      console.log('Unhandled event type:', event.type)
  }
  
  // Always return 200 to acknowledge receipt
  return NextResponse.json({ received: true })
}
```

## Authentication Pattern

```typescript
// src/app/api/protected/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Check authentication
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // User is authenticated, proceed with request
  const { data } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', session.user.id)
    
  return NextResponse.json({ data })
}
```

## Rate Limiting Pattern

```typescript
// Simple in-memory rate limiting
const rateLimits = new Map()

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const limit = 10 // 10 requests per minute
  
  // Get or create rate limit entry
  const userLimits = rateLimits.get(ip) || []
  const recentRequests = userLimits.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  // Record this request
  recentRequests.push(now)
  rateLimits.set(ip, recentRequests)
  
  // Continue with request processing
  // ...
}
```

## Testing API Routes

### Manual Testing with cURL
```bash
# GET request
curl http://localhost:3000/api/widgets/test-key

# POST request
curl -X POST http://localhost:3000/api/estimates \
  -H "Content-Type: application/json" \
  -d '{"widgetId": "123", "customer": {"name": "Test"}}'

# PATCH request
curl -X PATCH http://localhost:3000/api/estimates/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

### Testing Checklist
- [ ] Returns correct status codes
- [ ] Validates required fields
- [ ] Handles missing/invalid data
- [ ] Returns consistent response format
- [ ] Includes appropriate error messages
- [ ] Works with real database