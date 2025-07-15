# System Architecture

## Overview

Instant Estimate System is a custom form builder for home service businesses that generates instant price quotes. Each business gets dynamically configured widgets that adapt based on JSON configuration stored in Supabase.

## Core Architecture Principles

1. **One Codebase, Infinite Variations** - Single deployment serves all clients through configuration
2. **JSONB for Flexibility** - No rigid schemas, businesses can have completely different data structures
3. **Real-time First** - Live updates through Supabase subscriptions
4. **API-Driven** - Clean separation between frontend and backend
5. **Progressive Enhancement** - Works without JavaScript, enhances when available

## Frontend Architecture

### Routes Structure
```
/                          → Landing page (marketing)
/login                     → Authentication (Supabase Auth UI)
/dashboard                 → Business dashboard (protected)
/dashboard/estimates       → View and manage leads
/dashboard/widgets         → Manage widgets
/dashboard/widgets/[id]    → Customize specific widget
/dashboard/settings        → Business settings
/dashboard/billing         → Subscription management
/widget/[embedKey]         → Public widget (embeddable)
/api/*                     → Backend API routes
```

### Component Architecture
```
components/
├── widget/                # Widget-specific components
│   ├── WidgetLoader       # Loads config and initializes
│   ├── DynamicWidget      # Renders form based on config
│   └── WidgetSkeleton     # Loading state
├── widget-library/        # Reusable form components
│   ├── inputs/           # TextInput, NumberInput, etc.
│   ├── selectors/        # RadioGroup, Dropdown, etc.
│   └── special/          # MapDrawing, PriceDisplay, etc.
├── dashboard/            # Dashboard components
│   ├── EstimatesTable    # Real-time lead management
│   ├── WidgetCustomizer  # Visual widget editor
│   └── Analytics         # Conversion tracking
└── ui/                   # Shared UI primitives
```

## Backend Architecture

### Database Design
- **PostgreSQL** via Supabase
- **JSONB fields** for flexibility:
  - `customer` - Any customer fields
  - `service` - Service-specific data
  - `measurements` - Varies by service type
  - `pricing` - Complex pricing structures
  - `config` - Widget configuration

### API Structure
```
/api/widget-config/[embedKey]  → GET widget configuration
/api/estimates                 → POST new estimate
/api/estimates/[id]           → PATCH update estimate
/api/webhook/pricing          → POST trigger pricing calculation
/api/webhook/stripe           → POST handle payments
```

### Real-time Updates
```javascript
// Supabase Channels
business-[id]     → All updates for a business
widget-[id]       → Widget-specific events
estimates:new     → New lead notifications
estimates:update  → Status changes
```

## Data Flow

### Widget Load & Submit Flow
```
1. Customer visits client website
2. Widget iframe loads from our domain
3. WidgetLoader fetches config via embed key
4. DynamicWidget renders form based on config
5. Customer fills out multi-step form
6. On submit:
   a. Estimate saved to database
   b. Webhook triggers n8n workflow
   c. n8n calculates pricing with AI
   d. Database updated with pricing
   e. Customer sees instant quote
   f. Business gets real-time notification
```

### Pricing Calculation Flow
```
Estimate Created → n8n Webhook → Get Pricing Rules → 
Build AI Prompt → Call GPT-4 → Parse Response → 
Update Database → Notify Customer
```

## Security Model

### Authentication
- **Supabase Auth** for user management
- **Magic links** for passwordless login
- **OAuth** support (Google, etc.)

### Authorization
- **Row Level Security (RLS)** in PostgreSQL
- **Embed keys** for public widget access
- **API keys** for service-to-service

### Data Protection
- All sensitive data in PostgreSQL (not client-side)
- HTTPS everywhere
- Sanitized inputs
- Rate limiting on APIs

## Deployment Architecture

### Infrastructure
```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│  Vercel (Edge)  │────▶│  Supabase      │
│  - Next.js App  │     │  - PostgreSQL   │
│  - API Routes   │     │  - Auth         │
│  - Static Files │     │  - Realtime     │
│                 │     │  - Edge Funcs   │
└─────────────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   Cloudflare    │     │   n8n Cloud    │
│   - CDN         │     │   - Workflows   │
│   - DDoS        │     │   - Webhooks    │
│   - Analytics   │     │   - AI Calls    │
│                 │     │                 │
└─────────────────┘     └─────────────────┘
```

### Environments
- **Development**: Local Next.js + Supabase CLI
- **Staging**: Vercel preview deployments
- **Production**: Vercel production + Supabase project

## Performance Optimizations

### Frontend
- Component code splitting
- Dynamic imports for heavy components
- Edge caching for widget configs
- Optimistic UI updates
- Progressive form enhancement

### Backend
- Database indexes on common queries
- Materialized views for analytics
- Connection pooling
- Edge function caching

## Monitoring & Analytics

### Application Monitoring
- Vercel Analytics (Core Web Vitals)
- Sentry (Error tracking)
- Custom event tracking in database

### Business Metrics
- Widget views
- Conversion funnel
- Average quote value
- Response times
- Customer acquisition cost

## Scaling Strategy

### Phase 1 (0-50 clients)
- Single Vercel project
- One Supabase instance
- Manual onboarding

### Phase 2 (50-500 clients)
- Multiple Vercel projects (regional)
- Supabase read replicas
- Automated onboarding
- Dedicated n8n instance

### Phase 3 (500+ clients)
- Multi-tenant architecture
- Sharded databases
- Custom CDN setup
- Enterprise features

## Key Technical Decisions

1. **Why Supabase over custom backend?**
   - Built-in auth, real-time, and RLS
   - Faster development
   - Scales automatically

2. **Why JSONB over normalized tables?**
   - Each business has different needs
   - No migrations for new fields
   - Flexible pricing structures

3. **Why Next.js App Router?**
   - Server components for performance
   - Built-in API routes
   - Excellent DX with TypeScript

4. **Why n8n for pricing?**
   - Visual workflow builder
   - Easy for non-devs to modify
   - Built-in AI integrations

## Development Workflow

### Local Development
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Supabase
supabase start

# Terminal 3: n8n
docker run -p 5678:5678 n8nio/n8n
```

### Testing Strategy
- Component testing with React Testing Library
- API testing with Postman/Thunder Client
- E2E testing with Playwright
- Load testing with k6

### Deployment Process
1. Push to GitHub
2. Vercel auto-deploys preview
3. Test preview deployment
4. Merge to main
5. Vercel deploys to production
6. Run database migrations if needed

## Future Considerations

### Planned Features
- White-label options
- Mobile apps (React Native)
- Advanced analytics dashboard
- AI-powered lead scoring
- CRM integrations
- Multi-language support

### Technical Debt to Address
- Add comprehensive test coverage
- Implement request caching
- Add database backups
- Set up staging environment
- Document API with OpenAPI