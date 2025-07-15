# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cazno is an instant estimate system for home service businesses (fencing, concrete, landscaping, etc.) that allows them to embed dynamic price estimation widgets on their websites. The system uses JSONB fields for maximum flexibility, allowing each business to have completely different data structures without rigid schemas.

## Tech Stack

- **Framework**: Next.js 15.3.4 with App Router and TypeScript
- **Database**: Supabase (PostgreSQL with JSONB)
- **Styling**: Tailwind CSS (exclusively - no CSS files)
- **Authentication**: Supabase Auth (planned)
- **Automation**: n8n for workflow automation and AI pricing

## Common Commands

```bash
# Development
npm run dev        # Start development server with Turbopack

# Production
npm run build      # Create production build
npm run start      # Start production server

# Code Quality
npm run lint       # Run ESLint
```

## Architecture & Key Design Decisions

### Core Principles
1. **Flexibility First**: JSONB fields allow businesses to have completely different data structures
2. **Component-Based**: Small, reusable components with consistent interfaces
3. **Real-time Ready**: Built on Supabase for instant updates
4. **API-Driven**: Clean separation between frontend and backend

### Widget System Architecture
- Widgets are loaded dynamically via embed key
- Configuration stored as JSONB in `widgets` table
- Multi-step forms rendered from JSON configuration
- Component mapping system for different input types:
  ```typescript
  // src/app/widget/[embedKey]/components/ComponentRegistry.tsx
  const componentMap = {
    'text': TextInput,
    'radio': RadioGroup,
    'number': NumberInput,
    'linearFeet': LinearFeetInput,
    // Add new components here
  }
  ```

### Database Schema
- **businesses**: Customer accounts with subscription management
- **widgets**: Widget configurations (JSONB) and settings
- **estimates**: Form submissions with JSONB data
- **pricing_rules**: Flexible pricing configuration
- **events**: Analytics and tracking
- All tables include RLS policies and automatic timestamps

### API Patterns
All APIs follow consistent patterns:
```typescript
// Success
{ success: true, data: any }

// Error
{ success: false, error: string }
```

## Development Setup

1. Create Supabase project at https://supabase.com
2. Run database migrations:
   ```sql
   -- Execute contents of DATABASE_SCHEMA.sql in Supabase SQL editor
   ```
3. Configure environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Key Patterns to Follow

### Component Development
- Use value/onChange pattern for all form inputs
- Keep components small and focused
- Place widget components in `src/components/widgets/`
- Use TypeScript interfaces for all props

### Styling
- Use Tailwind CSS exclusively
- Follow mobile-first approach
- Use consistent spacing scale
- Never create .css files

### API Development
- Validate all required fields
- Return appropriate HTTP status codes
- Use consistent error messages
- Handle CORS for widget embedding

### State Management
- Use React hooks for local state
- Prepare for Supabase real-time subscriptions
- Keep widget state isolated from app state

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Protected dashboard pages
│   └── widget/        # Public widget renderer
├── components/
│   ├── ui/           # Shared UI primitives
│   └── widgets/      # Widget-specific components
├── lib/              # Utilities and configurations
├── hooks/            # Custom React hooks
└── types/            # TypeScript type definitions
```

## Current Implementation Status

### Completed
- Basic widget loading and rendering
- Multi-step form system
- Component registry for dynamic rendering
- Database schema with RLS
- API endpoints for widget config and submissions
- Dashboard structure (without auth)

### In Progress
- Authentication implementation
- Dashboard functionality
- Real-time updates
- Pricing integration with n8n

## Important Notes

- Always check existing patterns before implementing new features
- The system is designed to support ANY type of home service business
- Widget configurations are completely flexible - no assumptions about fields
- Use JSONB fields for any business-specific data
- Follow the established component patterns for consistency