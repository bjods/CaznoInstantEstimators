# Claude Code Strict Coding Guidelines

## Project Overview
You are building a custom instant estimate system for home service businesses. The system uses Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase. Each business gets a dynamically configured widget that adapts based on JSON configuration.

## Core Principles

### 1. JSONB First - Maximum Flexibility
```typescript
// ✅ CORRECT - Flexible JSONB
interface Estimate {
  customer: Record<string, any>  // Can have any fields
  service: Record<string, any>   // Varies by business
  measurements: Record<string, any> // Different for each service type
}

// ❌ WRONG - Rigid schema
interface Estimate {
  customerName: string
  customerEmail: string
  fenceHeight: number  // Too specific!
}
```

### 2. Component Composition Over Configuration
```typescript
// ✅ CORRECT - Small, composable components
export function LinearFeetInput({ value, onChange, ...props }) {
  return <input type="number" value={value} onChange={e => onChange(e.target.value)} {...props} />
}

// ❌ WRONG - Giant configurable component
export function SuperInput({ type, validation, styling, behavior, ...more }) {
  // 200 lines of conditional logic
}
```

### 3. Dynamic Loading Pattern
Every widget component must follow this pattern:
```typescript
// 1. Load configuration
// 2. Show skeleton while loading
// 3. Render dynamic components based on config
// 4. Handle errors gracefully
```

## File Structure Rules

### Component Files
- One component per file
- Export as named export (not default)
- Include types in the same file
- Use .tsx extension

```typescript
// src/components/widget-library/inputs/TextInput.tsx
export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

export function TextInput({ value, onChange, label, required }: TextInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border rounded-lg"
      />
    </div>
  )
}
```

### API Routes
- Always validate input
- Return consistent response format
- Handle errors with proper status codes

```typescript
// src/app/api/[route]/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      )
    }
    
    // Process
    const result = await doSomething(body)
    
    // Return
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Database Queries

### Always Use JSONB for Flexibility
```typescript
// ✅ CORRECT - Flexible queries
const { data } = await supabase
  .from('estimates')
  .insert({
    customer: formData.customer,  // Any shape
    service: formData.service,    // Any fields
    measurements: formData.measurements // Flexible
  })

// ❌ WRONG - Trying to normalize everything
const { data } = await supabase
  .from('estimates')
  .insert({
    customer_name: formData.name,
    customer_email: formData.email,
    fence_type: formData.fenceType  // Too specific!
  })
```

### Query Patterns
```typescript
// List with pagination
const { data, count } = await supabase
  .from('estimates')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 20)

// Get single with relations
const { data: widget } = await supabase
  .from('widgets')
  .select('*, business:businesses(*)')
  .eq('embed_key', embedKey)
  .single()

// Update with JSONB merge
const { data } = await supabase
  .from('widgets')
  .update({ 
    config: { 
      ...existingConfig, 
      ...updates 
    } 
  })
  .eq('id', widgetId)
```

## Component Library Rules

### Widget Library Components Must:
1. Accept `value` and `onChange` props
2. Be completely stateless
3. Work with any data shape
4. Use Tailwind classes only
5. Be accessible (labels, ARIA)

```typescript
// Component map in src/components/widget-library/index.ts
export const ComponentMap = {
  'text_input': TextInput,
  'number_input': NumberInput,
  'linear_feet_input': LinearFeetInput,
  'radio_group': RadioGroup,
  'material_gallery': MaterialGallery,
  // etc...
} as const

export type ComponentType = keyof typeof ComponentMap
```

## State Management

### Form State Pattern
```typescript
// Always use this pattern for forms
const [formData, setFormData] = useState<Record<string, any>>({})

const updateField = (name: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [name]: value
  }))
}

// Pass to components
<TextInput
  value={formData.name || ''}
  onChange={(value) => updateField('name', value)}
/>
```

### Loading States
```typescript
// Every async operation needs loading state
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleSubmit = async () => {
  setLoading(true)
  setError(null)
  
  try {
    await doAsyncThing()
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}
```

## Styling Rules

### Tailwind Only
- No CSS modules
- No styled-components
- No inline styles (except dynamic values)
- Use `cn()` utility for conditional classes

```typescript
// ✅ CORRECT
<div className={cn(
  "px-4 py-2 rounded-lg",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>

// ❌ WRONG
<div style={{ padding: '1rem', backgroundColor: isActive ? 'blue' : 'white' }}>
```

### Responsive Design
- Mobile first
- Test at 375px, 768px, 1024px
- Use Tailwind responsive prefixes

```typescript
<div className="px-4 md:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Error Handling

### User-Facing Errors
```typescript
// Always show helpful error messages
try {
  await submitEstimate(data)
} catch (error) {
  // Show user-friendly message
  setError("Unable to submit your request. Please try again.")
  
  // Log actual error for debugging
  console.error('Estimate submission failed:', error)
}
```

### API Error Responses
```typescript
// Consistent error format
return NextResponse.json({
  error: {
    message: "User-friendly message here",
    code: "SPECIFIC_ERROR_CODE",
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  }
}, { status: 400 })
```

## Testing Approach

### Manual Testing Checklist
Before considering any feature complete:
- [ ] Works on mobile (375px)
- [ ] Works on tablet (768px)
- [ ] Works on desktop (1024px+)
- [ ] Handles loading states
- [ ] Shows errors gracefully
- [ ] Keyboard accessible
- [ ] Form validation works
- [ ] Data saves correctly

## Performance Rules

### Image Optimization
```typescript
import Image from 'next/image'

// ✅ CORRECT
<Image src="/logo.png" alt="Logo" width={200} height={50} />

// ❌ WRONG
<img src="/logo.png" alt="Logo" />
```

### Dynamic Imports for Heavy Components
```typescript
// For map components, charts, etc.
const MapDrawing = dynamic(() => import('./MapDrawing'), {
  loading: () => <div>Loading map...</div>,
  ssr: false
})
```

## Security Rules

### Never Trust Client Data
```typescript
// Always validate on server
export async function POST(request: Request) {
  const data = await request.json()
  
  // Validate everything
  if (!isValidEmail(data.email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  
  // Sanitize before saving
  const cleaned = sanitizeInput(data)
  await supabase.from('estimates').insert(cleaned)
}
```

### Environment Variables
```typescript
// Public vars (client-side safe)
process.env.NEXT_PUBLIC_SUPABASE_URL

// Private vars (server-only)
process.env.SUPABASE_SERVICE_KEY  // Never expose!
```

## Comments and Documentation

### Component Comments
```typescript
/**
 * Dynamic widget renderer that loads configuration and renders
 * appropriate components based on the config.steps array
 */
export function DynamicWidget({ config }: { config: WidgetConfig }) {
  // Implementation
}
```

### TODO Comments
```typescript
// TODO: Add validation for phone numbers
// TODO: Implement real-time updates
// FIXME: Handle edge case when config is empty
```

## Git Commit Messages
When creating files, organize commits logically:
- `feat: add widget loader component`
- `fix: handle empty config in dynamic widget`
- `style: update form input styling`
- `refactor: extract common form logic`

## Remember
1. Ship fast, perfect later
2. Make it work, then make it pretty
3. Flexibility over rigid structure
4. User experience over developer experience
5. Real data over fake data