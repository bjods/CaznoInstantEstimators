# Cazno Client Onboarding Flow

## Overview
This document outlines the step-by-step process for onboarding new clients to Cazno's instant estimator system.

## Phase 1: Initial Client Contact (Sales)

### 1. Discovery Call (30 min)
- [ ] Understand their business type and services
- [ ] Current lead generation process and pain points
- [ ] Average project values and pricing structure
- [ ] Website platform (WordPress, Squarespace, etc.)
- [ ] Monthly lead volume goals
- [ ] Decision makers involved

### 2. Demo & Proposal
- [ ] Show live widget demo on test site
- [ ] Walk through their specific use case
- [ ] Provide pricing based on lead volume
- [ ] Send proposal with ROI calculations

## Phase 2: Client Setup (Technical)

### 1. Gather Business Information
```
Company Name: ___________________
Contact Email: __________________
Phone: _________________________
Website URL: ___________________
Services Offered: ______________
Service Area: __________________
Logo URL: ______________________
Brand Colors: __________________
```

### 2. Widget Configuration Requirements
```
Widget Name: ___________________
Type of Calculator: ____________
Steps/Questions Needed:
1. _____________________________
2. _____________________________
3. _____________________________
4. _____________________________

Pricing Structure:
- Base prices: _________________
- Variables: ___________________
- Modifiers: ___________________

Form Fields Needed:
- [ ] Name (first/last or full)
- [ ] Email
- [ ] Phone
- [ ] Address
- [ ] Service selection
- [ ] Measurements/quantities
- [ ] Additional options
- [ ] File uploads
- [ ] Scheduling

Quote Display Options:
- [ ] Instant pricing
- [ ] Price ranges
- [ ] "Contact for quote"
- [ ] Appointment booking
```

### 3. Theme Customization
```
Background Color: ______________
Card Background: _______________
Primary Color: _________________
Text Colors: ___________________
Button Colors: _________________
```

## Phase 3: Implementation (Claude Code)

### 1. Create Business in Supabase
```sql
-- Template command for Claude Code
INSERT INTO businesses (name, slug, email, phone, settings)
VALUES (
  'CLIENT_NAME',
  'client-slug',
  'client@email.com',
  'PHONE',
  '{
    "theme": {
      "primaryColor": "#0066cc",
      "secondaryColor": "#f5f5f5"
    },
    "business_info": {
      "services": ["Service 1", "Service 2"],
      "service_area": "Service Area"
    }
  }'::jsonb
);
```

### 2. Create Widget Configuration
- Use WIDGET_CONFIG_GUIDE.md as reference
- Build step-by-step form flow
- Configure pricing calculator if needed
- Set up theme to match brand

### 3. Test Widget
- [ ] Test on mobile devices
- [ ] Verify all form fields work
- [ ] Check pricing calculations
- [ ] Test lead submission
- [ ] Verify email notifications

## Phase 4: Client Deployment

### 1. Provide Embed Code
- [ ] Send iframe embed code
- [ ] Include installation instructions
- [ ] Provide test link

### 2. Installation Support
- [ ] Help with WordPress/Squarespace/etc.
- [ ] Test on live site
- [ ] Mobile responsiveness check
- [ ] UTM tracking setup

### 3. Training
- [ ] Show dashboard access
- [ ] Explain lead management
- [ ] Review analytics
- [ ] Set up notifications

## Phase 5: Launch & Support

### 1. Go Live Checklist
- [ ] Widget properly embedded
- [ ] Leads flowing to dashboard
- [ ] Email notifications working
- [ ] Client has dashboard access
- [ ] Analytics tracking properly

### 2. First Week Follow-up
- [ ] Check lead volume
- [ ] Gather initial feedback
- [ ] Make any adjustments
- [ ] Review conversion rates

### 3. Ongoing Support
- Weekly check-ins for first month
- Monthly performance reviews
- Quarterly business reviews
- Feature requests and updates

## Implementation Templates

### Quick Start SQL Commands

#### Fencing Company Example
```sql
-- Create business
INSERT INTO businesses (name, slug, email, phone)
VALUES ('ABC Fencing', 'abc-fencing', 'contact@abcfencing.com', '555-0123');

-- Get business_id from response, then create widget
-- See WIDGET_CONFIG_GUIDE.md for full configuration
```

#### Concrete Company Example
```sql
-- Create business
INSERT INTO businesses (name, slug, email, phone)
VALUES ('XYZ Concrete', 'xyz-concrete', 'info@xyzconcrete.com', '555-0456');

-- Widget configuration will follow...
```

## Client Communication Templates

### Welcome Email
```
Subject: Welcome to Cazno - Let's Get Your Calculator Live!

Hi [Name],

Welcome to Cazno! I'm excited to help you start generating more qualified leads with your custom instant estimator.

Our next steps:
1. I'll build your custom calculator based on our discussion
2. You'll receive the embed code within 24 hours
3. We'll schedule a quick call to help you install it
4. You'll start seeing leads immediately!

What I need from you:
- Logo file (if you have one)
- Any specific form fields beyond what we discussed
- Your website platform (WordPress, Squarespace, etc.)

Looking forward to getting you live!

Best,
[Your name]
```

### Delivery Email
```
Subject: Your Cazno Calculator is Ready!

Hi [Name],

Great news - your custom calculator is ready to embed on your website!

Your embed code and instructions are attached. The widget will:
✓ Automatically resize to fit your site
✓ Work perfectly on mobile devices
✓ Send leads directly to your dashboard
✓ Track source data with UTM parameters

Dashboard access: https://cazno.app/dashboard
Login: [their email]
Password: [temporary password]

Let's schedule 15 minutes to help you install it: [Calendar link]

Best,
[Your name]
```

## Success Metrics

Track these KPIs for each client:
- Time from signup to go-live (target: <48 hours)
- Widget conversion rate (target: >10%)
- Lead quality score (client feedback)
- Monthly lead volume
- Client retention rate
- Support ticket volume

## Notes for Claude Code Implementation

When implementing for a new client:
1. Always reference WIDGET_CONFIG_GUIDE.md
2. Use existing component patterns
3. Test mobile experience thoroughly
4. Verify pricing calculations if applicable
5. Ensure proper validation on all required fields
6. Set appropriate theme colors to match brand

Remember: Each business is unique - adapt the widget configuration to their specific needs while maintaining consistency in the implementation approach.