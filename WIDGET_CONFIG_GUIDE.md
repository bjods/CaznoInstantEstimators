# Widget Configuration Guide for Supabase

This guide explains how to create and configure widgets in Supabase for each company using the Cazno instant estimator system. 

**Note**: The Cazno dashboard is now view-only for analytics and lead management. Widget creation and configuration must be done directly in the Supabase database using the SQL editor.

## Table of Contents
1. [Database Structure](#database-structure)
2. [Creating a New Business](#creating-a-new-business)
3. [Creating a Widget](#creating-a-widget)
4. [Widget Security Configuration](#widget-security-configuration)
5. [Widget Iframe Implementation](#widget-iframe-implementation)
6. [Analytics Dashboard Configuration](#analytics-dashboard-configuration)
7. [Component Labeling and Display](#component-labeling-and-display)
8. [Component Reference](#component-reference)
9. [Submission Flow Configuration](#submission-flow-configuration)
10. [Scheduling Configuration](#scheduling-configuration)
11. [Configuration Examples](#configuration-examples)

## Database Structure

### businesses table
```sql
- id: UUID (auto-generated)
- name: string (company name)
- slug: string (URL-friendly name)
- email: string
- phone: string
- settings: JSONB (theme, business info, etc.)
```

### widgets table
```sql
- id: UUID (auto-generated)
- business_id: UUID (foreign key to businesses)
- name: string (widget display name)
- embed_key: string (unique key for embedding)
- config: JSONB (step configuration)
- theme: JSONB (visual customization)
- is_active: boolean
- has_pricing: boolean (indicates if widget has instant pricing)
- has_booking: boolean (indicates if widget has appointment booking)
- show_instant_estimate: boolean (displays pricing on quote step)
- appointment_booking: boolean (enables appointment scheduling)
```

## Creating a New Business

```sql
INSERT INTO businesses (name, slug, email, phone, settings)
VALUES (
  'Your Company Name',
  'your-company-slug',
  'contact@company.com',
  '555-0123',
  '{
    "theme": {
      "primaryColor": "#0066cc",
      "secondaryColor": "#f5f5f5"
    },
    "business_info": {
      "services": ["Service 1", "Service 2"],
      "service_area": "Your Service Area"
    }
  }'::jsonb
);
```

## Creating a Widget

### Basic Widget Structure
```json
{
  "steps": [
    {
      "id": "unique-step-id",
      "title": "Step Title",  // This title appears above the progress bar
      "components": [
        {
          "type": "component_type",
          "props": {
            "name": "field_name",
            "label": "Field Label",
            "required": true,
            // component-specific props
          }
        }
      ]
    }
  ],
  "priceDisplay": "instant",
  "thankYouMessage": "Thank you message here",
  "showInstantQuote": true,
  
  "pricingCalculator": {
    // Optional: Add real-time pricing to your widget
    // See Pricing Calculator section below for full documentation
  },
  
  "quoteStep": {
    // Optional: Add a dedicated quote/estimate step at the end
    // See Quote Step Configuration section below for full documentation
  },
  
  "notifications": {
    // Optional: Configure email notifications for leads
    // See Email Notifications section below for full documentation
  }
}
```

**Important**: The `title` field in each step is displayed as the main heading above the progress bar. This helps users understand what information they're providing at each stage of the form.

## Widget Theming & Colors

The widget theming system allows you to completely customize the visual appearance of your widgets to match your brand. All colors are controlled through the `theme` field in the widget configuration.

### Theme Configuration

```json
{
  "theme": {
    // Background colors
    "backgroundColor": "#000000",
    "cardBackground": "#1f2937",
    
    // Text colors  
    "primaryText": "#ffffff",
    "secondaryText": "#9ca3af",
    "labelText": "#f3f4f6",
    
    // Accent colors
    "primaryColor": "#60a5fa",
    "successColor": "#34d399", 
    "errorColor": "#f87171",
    
    // Input colors
    "inputBackground": "#374151",
    "inputBorder": "#4b5563",
    "inputFocusBorder": "#60a5fa",
    "inputText": "#ffffff",
    "inputPlaceholder": "#9ca3af",
    
    // Button colors
    "primaryButton": "#60a5fa",
    "primaryButtonHover": "#3b82f6",
    "primaryButtonText": "#ffffff", 
    "secondaryButton": "#374151",
    "secondaryButtonHover": "#4b5563",
    "secondaryButtonText": "#f3f4f6",
    
    // Progress bar
    "progressBackground": "#374151",
    "progressFill": "#60a5fa",
    
    // Border colors
    "borderColor": "#4b5563",
    "borderColorLight": "#374151"
  }
}
```

### Theme Properties

#### Background Colors
- **backgroundColor**: Main widget background color
- **cardBackground**: Background for cards and containers

#### Text Colors
- **primaryText**: Main text color (headings, important text)
- **secondaryText**: Secondary text color (descriptions, help text)
- **labelText**: Form label text color

#### Accent Colors
- **primaryColor**: Main brand color (buttons, links, highlights)
- **successColor**: Success states and positive feedback
- **errorColor**: Error states and validation messages

#### Input Colors
- **inputBackground**: Form input background color
- **inputBorder**: Default input border color
- **inputFocusBorder**: Input border color when focused
- **inputText**: Text color inside inputs
- **inputPlaceholder**: Placeholder text color

#### Button Colors
- **primaryButton**: Primary button background
- **primaryButtonHover**: Primary button hover state
- **primaryButtonText**: Primary button text color
- **secondaryButton**: Secondary button background
- **secondaryButtonHover**: Secondary button hover state
- **secondaryButtonText**: Secondary button text color

#### Progress & UI Elements
- **progressBackground**: Progress bar background
- **progressFill**: Progress bar fill color
- **borderColor**: General border color
- **borderColorLight**: Light border color for subtle dividers

### Example Theme Configurations

#### Dark Theme (Default)
```json
{
  "theme": {
    "backgroundColor": "#000000",
    "cardBackground": "#1f2937",
    "primaryText": "#ffffff",
    "secondaryText": "#9ca3af",
    "labelText": "#f3f4f6",
    "primaryColor": "#60a5fa",
    "inputBackground": "#374151",
    "inputBorder": "#4b5563",
    "inputFocusBorder": "#60a5fa",
    "inputText": "#ffffff",
    "inputPlaceholder": "#9ca3af"
  }
}
```

#### Light Theme
```json
{
  "theme": {
    "backgroundColor": "#ffffff",
    "cardBackground": "#f9fafb", 
    "primaryText": "#111827",
    "secondaryText": "#6b7280",
    "labelText": "#374151",
    "primaryColor": "#3b82f6",
    "inputBackground": "#ffffff",
    "inputBorder": "#d1d5db",
    "inputFocusBorder": "#3b82f6", 
    "inputText": "#111827",
    "inputPlaceholder": "#9ca3af"
  }
}
```

#### Brand-Specific Theme (Green)
```json
{
  "theme": {
    "backgroundColor": "#0f172a",
    "cardBackground": "#1e293b",
    "primaryText": "#f1f5f9",
    "secondaryText": "#94a3b8",
    "labelText": "#e2e8f0",
    "primaryColor": "#10b981",
    "successColor": "#059669",
    "errorColor": "#ef4444",
    "inputBackground": "#334155",
    "inputBorder": "#475569",
    "inputFocusBorder": "#10b981",
    "inputText": "#f1f5f9",
    "inputPlaceholder": "#94a3b8"
  }
}
```

### Color Format

All colors should be provided as hex values (e.g., `#ffffff`, `#3b82f6`). The theming system will automatically apply these colors to all widget components including:

- Form inputs (text, number, email, etc.)
- Buttons and CTAs
- Progress indicators
- Labels and text
- Borders and dividers
- Background colors
- Hover and focus states

### Best Practices

1. **Contrast**: Ensure sufficient contrast between text and background colors for accessibility
2. **Consistency**: Use a cohesive color palette that matches your brand
3. **Testing**: Test your theme with different widget types to ensure readability
4. **Fallbacks**: The system provides sensible defaults if any color is not specified

### SQL Insert Example
```sql
INSERT INTO widgets (
  business_id, 
  name, 
  embed_key, 
  config, 
  theme, 
  is_active,
  has_pricing,
  has_booking,
  show_instant_estimate,
  appointment_booking,
  allowed_domains,
  security_enabled,
  embed_restrictions
) VALUES (
  'business-uuid-here',
  'Widget Display Name',
  'unique-embed-key',
  '{ /* config JSON here */ }'::jsonb,
  '{
    "primaryColor": "#0066cc",
    "secondaryColor": "#f5f5f5",
    "fontFamily": "Inter",
    "borderRadius": "8px"
  }'::jsonb,
  true,
  true,  -- has_pricing: indicates widget includes pricing calculator
  false, -- has_booking: indicates widget includes appointment booking
  true,  -- show_instant_estimate: displays pricing on quote step
  false, -- appointment_booking: enables appointment scheduling
  -- NEW SECURITY FIELDS:
  ARRAY['example.com', '*.subdomain.example.com', 'trusted-site.org'], -- allowed_domains
  true,  -- security_enabled: enables domain validation
  '{
    "require_https": true,
    "block_iframes": false,
    "max_embeds_per_domain": 10,
    "rate_limit_per_hour": 1000
  }'::jsonb -- embed_restrictions
);
```

### Widget Type Configuration

When creating widgets, set the boolean flags to control dashboard analytics:

- **has_pricing / show_instant_estimate**: Set to `true` for widgets with pricing calculators
- **has_booking / appointment_booking**: Set to `true` for widgets with appointment booking
- **Both false**: For simple lead capture forms without pricing or booking

The dashboard will automatically show relevant metrics based on these flags:
- Pricing widgets show estimate values, daily/monthly estimate charts
- Booking widgets show appointment counts, booking completion rates, appointment time charts
- All widgets show form completion rates and lead analytics

## Widget Security Configuration

### Domain Validation & Embedding Security

The security system restricts which domains can embed your widgets, protecting against unauthorized usage and data theft. These settings can be configured through the **Dashboard Settings** interface or directly in the database.

### Configuring Security Through Dashboard

1. **Navigate to Settings**: Go to `/dashboard/settings` in your browser
2. **Widget Security Settings**: Each widget shows its current security configuration
3. **Edit Security**: Click "Edit Security" to modify settings
4. **Configure Domains**: Add or remove allowed domains using the interface
5. **Save Changes**: Security updates take effect immediately

### Dashboard Security Features

#### Visual Security Status
- **🟢 Secured**: Widget has domain validation enabled with allowed domains configured
- **🟡 Unsecured**: Widget has security disabled or no domains configured

#### Domain Management Interface
- **Add Domains**: Type domain and click "Add" (supports wildcards like *.example.com)
- **Remove Domains**: Click "Remove" next to any domain to delete it
- **Domain Validation**: Real-time validation ensures proper domain format

#### Security Controls
- **Security Toggle**: Enable/disable domain validation with a simple switch
- **HTTPS Enforcement**: Require widgets to be embedded only on HTTPS sites
- **Rate Limiting**: Set per-domain request limits (100-10,000 requests/hour)
- **Embed Limits**: Control how many pages per domain can embed the widget

### Security Fields

#### allowed_domains (TEXT[] - Array of domains)
Controls which domains can embed this widget. Supports exact matches and wildcard subdomains.

**Examples:**
```sql
-- Allow specific domains only
ARRAY['example.com', 'app.example.com', 'staging.example.com']

-- Allow wildcards for subdomains  
ARRAY['example.com', '*.example.com'] -- Allows any subdomain of example.com

-- Allow multiple different domains
ARRAY['client1.com', 'client2.org', '*.app.client3.com']

-- NULL = Allow all domains (not recommended for production)
NULL

-- Empty array = Block all domains (widget cannot be embedded)
ARRAY[]::TEXT[]
```

#### security_enabled (BOOLEAN)
Master switch for security features. Set to `true` to enable domain validation.

```sql
security_enabled = true  -- Enforces domain whitelist
security_enabled = false -- Legacy mode, allows any domain
```

#### embed_restrictions (JSONB)
Fine-grained security controls for widget embedding.

```json
{
  "require_https": true,           // Only allow embedding on HTTPS sites
  "block_iframes": false,          // Prevent widget from being iframed (future feature)
  "max_embeds_per_domain": 10,     // Max number of unique pages per domain
  "rate_limit_per_hour": 1000      // Max requests per hour per domain
}
```

### Security Configuration Examples

#### High Security Configuration (Recommended)
```sql
-- For production widgets with sensitive data
allowed_domains = ARRAY['mycompany.com', 'www.mycompany.com', 'app.mycompany.com'],
security_enabled = true,
embed_restrictions = '{
  "require_https": true,
  "block_iframes": false,
  "max_embeds_per_domain": 5,
  "rate_limit_per_hour": 500
}'::jsonb
```

#### Development Configuration
```sql
-- For testing across multiple domains
allowed_domains = ARRAY['localhost', '*.vercel.app', '*.netlify.app', 'staging.mycompany.com'],
security_enabled = true,
embed_restrictions = '{
  "require_https": false,  -- Allow HTTP for local development
  "block_iframes": false,
  "max_embeds_per_domain": 100,
  "rate_limit_per_hour": 10000
}'::jsonb
```

#### Multi-Client Configuration
```sql
-- For agencies managing multiple client websites
allowed_domains = ARRAY[
  'client1.com', '*.client1.com',
  'client2.org', 'www.client2.org',
  'agency-demos.com', '*.agency-demos.com'
],
security_enabled = true,
embed_restrictions = '{
  "require_https": true,
  "block_iframes": false,
  "max_embeds_per_domain": 20,
  "rate_limit_per_hour": 2000
}'::jsonb
```

### Security Monitoring

The system automatically tracks:

#### Domain Usage (`widget_domain_usage` table)
- Which domains are embedding your widget
- Total requests per domain
- Blocked/unauthorized attempts
- First and last seen timestamps

#### Security Events (`security_events` table)
- Unauthorized domain access attempts
- Rate limit violations
- Suspicious activity patterns
- Input validation failures

### Viewing Security Data

```sql
-- See which domains are using your widget
SELECT * FROM widget_domain_summary 
WHERE widget_id = 'your-widget-id'
ORDER BY total_requests DESC;

-- View recent security events
SELECT * FROM security_events_summary
WHERE widget_id = 'your-widget-id'
AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Check unauthorized access attempts
SELECT source_domain, COUNT(*) as attempts
FROM security_events
WHERE widget_id = 'your-widget-id'
AND event_type = 'unauthorized_domain'
GROUP BY source_domain
ORDER BY attempts DESC;
```

### Important Security Notes

1. **Always use HTTPS in production** - Set `require_https: true`
2. **Be specific with domains** - Avoid using wildcards unless necessary
3. **Monitor security events** - Check for unauthorized access attempts regularly
4. **Update allowed domains promptly** - Remove domains when clients leave
5. **Use rate limiting** - Prevent abuse and DDoS attacks

### Migrating Existing Widgets

For existing widgets without security configuration:

```sql
-- Add security to existing widget
UPDATE widgets
SET 
  allowed_domains = ARRAY['your-domain.com', 'www.your-domain.com'],
  security_enabled = true,
  embed_restrictions = '{
    "require_https": true,
    "block_iframes": false,
    "max_embeds_per_domain": 10,
    "rate_limit_per_hour": 1000
  }'::jsonb
WHERE id = 'your-widget-id';
```

### Testing Domain Validation

1. **Test Allowed Domain**: Embed widget on an allowed domain - should work
2. **Test Blocked Domain**: Try embedding on unauthorized domain - should be blocked
3. **Test Wildcards**: If using `*.example.com`, test various subdomains
4. **Check Security Events**: Verify blocked attempts are logged

### Troubleshooting

**Widget not loading?**
- Check if domain is in `allowed_domains` array
- Verify `security_enabled = true`
- Check for typos in domain names (must match exactly)
- Look for security events: `SELECT * FROM security_events WHERE widget_id = 'your-widget-id'`

**Need to temporarily disable security?**
```sql
UPDATE widgets SET security_enabled = false WHERE id = 'your-widget-id';
-- Remember to re-enable after testing!
```

## Widget Iframe Implementation

### Iframe Only Access

Widgets can only be accessed through iframe embedding to ensure complete style isolation and prevent CSS conflicts between your website and the widget. Direct widget access has been disabled for security.

#### Basic Iframe Embedding

```html
<iframe 
  src="https://yourdomain.com/iframe/your-widget-embed-key"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Instant Estimate Widget">
</iframe>
```

#### React/Next.js Component Embedding

```tsx
import WidgetIframe from '@/components/widget/WidgetIframe'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <WidgetIframe 
        embedKey="your-widget-embed-key"
        className="rounded-lg shadow-lg"
      />
    </div>
  )
}
```

#### Auto-Resizing Iframe

The iframe automatically adjusts its height based on the widget content. The widget sends resize messages to the parent window:

```javascript
// The widget automatically sends messages like this:
window.parent.postMessage({
  type: 'widget-resize',
  height: actualContentHeight
}, '*');

// Your page can listen for these messages:
window.addEventListener('message', (event) => {
  if (event.data.type === 'widget-resize') {
    const iframe = document.getElementById('widget-iframe');
    iframe.style.height = event.data.height + 'px';
  }
});
```


### Embedding Best Practices

1. **Use Iframe Embedding**: Prevents CSS conflicts and provides better security
2. **Set Proper Dimensions**: Start with 800px height, let auto-resize handle the rest
3. **Add Loading States**: Show a skeleton or spinner while the widget loads
4. **Handle Errors**: Provide fallback content if the widget fails to load
5. **Mobile Responsive**: Ensure the iframe is responsive on mobile devices

```html
<!-- Example with loading state -->
<div id="widget-container" style="position: relative; min-height: 600px;">
  <div id="widget-loading" style="text-align: center; padding: 100px 0;">
    Loading instant estimate form...
  </div>
  <iframe 
    id="widget-iframe"
    src="https://yourdomain.com/iframe/your-widget-embed-key"
    width="100%"
    height="800"
    frameborder="0"
    style="border: none; border-radius: 8px; display: none;"
    onload="document.getElementById('widget-loading').style.display='none'; this.style.display='block';"
    title="Instant Estimate Widget">
  </iframe>
</div>
```

### Security Considerations

- **Domain Validation**: Ensure your widget's `allowed_domains` includes your website
- **HTTPS Only**: Always embed widgets over HTTPS in production
- **CSP Headers**: Configure Content Security Policy to allow iframe embedding
- **Sandbox Attributes**: Use appropriate iframe sandbox attributes for security

```html
<!-- Secure iframe with sandbox attributes -->
<iframe 
  src="https://yourdomain.com/iframe/your-widget-embed-key"
  width="100%" 
  height="800"
  frameborder="0"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  title="Instant Estimate Widget">
</iframe>
```

## Analytics Dashboard Configuration

The Cazno dashboard provides adaptive analytics based on your widget configuration. The dashboard automatically detects widget capabilities and shows relevant metrics.

### Dashboard Types

#### Instant Pricing Widgets
Widgets with pricing calculators (`has_pricing: true` or `show_instant_estimate: true`) display:

**Key Metrics:**
- Total Submissions (with weekly growth)
- Form Completion Rate (percentage of started forms completed)
- Total Estimate Value (all-time estimates combined)
- After Hours Rate (submissions outside business hours)

**Analytics Charts:**
- Daily Estimate Values (last 7 days)
- Monthly Estimate Values (last 6 months)
- Estimates by Service Type (breakdown by service)
- Business Hours vs After Hours (comparison with values)

#### Booking/Appointment Widgets
Widgets with appointment booking (`has_booking: true` or `appointment_booking: true`) display:

**Key Metrics:**
- Total Submissions
- Form Completion Rate
- Total Appointments (booked appointments)
- Booking Completion Rate (percentage who complete booking)

**Analytics Charts:**
- Daily Bookings (last 7 days)
- Appointment Times Distribution (preferred booking hours 8 AM - 7 PM)
- Business Hours vs After Hours
- Booking patterns and preferences

#### Simple Lead Capture Widgets
Widgets without pricing or booking (`both flags false`) display:

**Key Metrics:**
- Total Submissions
- Form Completion Rate
- Top Lead Sources (with counts)
- After Hours Rate

**Analytics Charts:**
- Estimates by Service Type (form submissions by service)
- Business Hours vs After Hours

### Submission Analytics

All widget types track detailed submission analytics:

```sql
-- Key submission tracking fields
current_step TEXT                    -- Which step user is currently on
last_interaction_at TIMESTAMP        -- When user last interacted
quote_viewed_at TIMESTAMP           -- When user reached quote page  
appointment_scheduled_at TIMESTAMP   -- When user booked appointment
completion_status TEXT              -- 'started', 'in_progress', 'complete'
estimated_price NUMERIC             -- Calculated price (if pricing enabled)
service_type TEXT                   -- Selected service type
appointment_date TIMESTAMP          -- Scheduled appointment date/time
booking_confirmed BOOLEAN           -- Whether booking was confirmed
```

### Time-Based Analytics

The dashboard provides time-based breakdowns:

#### Business Hours vs After Hours
- **Business Hours**: 8 AM - 6 PM, Monday-Friday
- **After Hours**: Evenings, nights, weekends
- **Metrics**: Submission counts, estimate values, capture rates

#### Weekly and Monthly Trends
- **Daily Charts**: Last 7 days for recent activity
- **Monthly Charts**: Last 6 months for trends
- **Growth Indicators**: Week-over-week comparisons

### Lead Source Tracking

Track where your leads are coming from:
- **Direct**: Visitors who typed your URL
- **Google**: Search engine traffic
- **Facebook**: Social media referrals
- **Referral**: Other website referrals
- **Custom**: Campaign-specific sources

### Service Analytics

For multi-service businesses:
- **Service Breakdown**: Submissions per service type
- **Value by Service**: Average and total estimate values
- **Popular Services**: Most requested services
- **Service Performance**: Completion rates by service

### Best Practices for Analytics

1. **Set Widget Flags Correctly**: Ensure `has_pricing` and `has_booking` flags match your widget's actual functionality
2. **Track Service Types**: Use consistent service naming across widgets
3. **Monitor Completion Rates**: Low completion rates may indicate form issues
4. **Analyze Time Patterns**: After-hours capture can indicate market demand
5. **Review Lead Sources**: Focus marketing on top-performing channels
6. **Service Performance**: Identify which services generate the most leads

### Database Views for Custom Analytics

For advanced analytics, query the database directly:

```sql
-- Widget performance summary
SELECT 
  w.name as widget_name,
  w.has_pricing,
  w.has_booking,
  COUNT(s.*) as total_submissions,
  COUNT(CASE WHEN s.completion_status = 'complete' THEN 1 END) as completed_submissions,
  AVG(s.estimated_price) as avg_estimate_value,
  COUNT(CASE WHEN s.appointment_date IS NOT NULL THEN 1 END) as total_appointments
FROM widgets w
LEFT JOIN submissions s ON w.id = s.widget_id
WHERE w.business_id = 'your-business-id'
  AND s.created_at > NOW() - INTERVAL '30 days'
GROUP BY w.id, w.name, w.has_pricing, w.has_booking;

-- Time-based submission patterns
SELECT 
  EXTRACT(hour FROM created_at) as hour_of_day,
  COUNT(*) as submissions,
  AVG(estimated_price) as avg_value
FROM submissions 
WHERE business_id = 'your-business-id'
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY EXTRACT(hour FROM created_at)
ORDER BY hour_of_day;
```

## Component Labeling and Display

### Premium Design Approach

Cazno widgets use a **single-label system** for a clean, professional appearance. Each component displays only its main label directly on the input field - no additional subheadings or duplicate text.

**Key Principles:**
- ✅ **One label per field**: Use the `label` property for the primary field label
- ❌ **No duplicate headings**: Avoid redundant `helpText` when `label` exists
- ✅ **Clean spacing**: Reduced vertical gaps between components
- ❌ **No asterisks**: Required field indication handled through smart validation
- ✅ **Professional validation**: Errors shown only when user attempts to proceed

### Labeling Best Practices

**Good Example:**
```json
{
  "type": "text_input",
  "props": {
    "name": "business_name",
    "label": "Business Name",
    "placeholder": "ABC Fencing & Concrete",
    "required": true
  }
}
```

**Avoid This:**
```json
{
  "type": "text_input", 
  "props": {
    "name": "business_name",
    "label": "Business Name",
    "helpText": "BUSINESS NAME", // ❌ Creates duplicate heading
    "placeholder": "ABC Fencing & Concrete *", // ❌ Don't use asterisks
    "required": true
  }
}
```

### Label Guidelines

**Use `label` for:**
- Primary field identification
- Clear, concise field names
- Professional terminology

**Use `helpText` only when:**
- Additional context is truly needed
- Explaining complex requirements
- Providing examples (rare cases)

**Use `placeholder` for:**
- Example values
- Format hints
- Encouraging input

### Smart Validation System

Cazno widgets feature a **smart validation system** that provides a professional user experience without cluttering the interface with asterisks or constant error messages.

#### How It Works

**1. Clean Initial State:**
- No visual indicators for required fields
- No asterisks or special marking
- Clean, uncluttered interface

**2. Smart Error Handling:**
- Validation only triggered when user tries to proceed
- Clear, contextual error messages
- Automatic error clearing when user starts typing

**3. User-Friendly Messages:**
- Uses field labels in error messages
- Groups all errors in one place
- Professional tone and styling

#### Configuration

Set any field as required by adding `"required": true` to the component props:

```json
{
  "type": "text_input",
  "props": {
    "name": "business_name",
    "label": "Business Name", 
    "required": true,
    "placeholder": "ABC Fencing Co"
  }
}
```

#### Supported Validation

The system validates:
- **Text fields**: Must not be empty or whitespace-only
- **Email fields**: Must not be empty (basic validation)
- **Dropdowns**: Must have a selection (not empty string)
- **Checkboxes**: Must have at least one selection
- **Arrays**: Must not be empty

#### Error Display

When validation fails, users see:
- 📍 **Location**: Error panel appears above the Next button
- 🎨 **Styling**: Subtle background with warning icon
- 📝 **Content**: "Please complete the following required fields:"
- 📋 **List**: Bulleted list of specific field errors

#### Best Practices

**✅ Do:**
- Use clear, descriptive field labels (they become error messages)
- Only mark truly essential fields as required
- Test the validation flow during setup

**❌ Avoid:**
- Making too many fields required (poor UX)
- Using generic field names as labels
- Relying on asterisks or visual markers

## Component Reference

### 1. text_input
Basic text input field.
```json
{
  "type": "text_input",
  "props": {
    "name": "field_name",
    "label": "Field Label",
    "placeholder": "Enter text...",
    "required": true,
    "type": "text", // or "email", "tel"
    "helpText": "Helper text here"
  }
}
```

### 2. radio_group
Single selection from multiple options.
```json
{
  "type": "radio_group",
  "props": {
    "name": "field_name",
    "label": "Choose one option",
    "options": [
      {
        "value": "option1",
        "label": "Option 1",
        "description": "Optional description"
      }
    ],
    "required": true
  }
}
```

### 3. checkbox_group
Multiple selections from options.
```json
{
  "type": "checkbox_group",
  "props": {
    "name": "field_name",
    "label": "Select all that apply",
    "options": [
      {
        "value": "option1",
        "label": "Option 1",
        "description": "Optional description"
      }
    ],
    "required": true,
    "helpText": "Select at least one"
  }
}
```

### 4. number_input
Numeric input field.
```json
{
  "type": "number_input",
  "props": {
    "name": "field_name",
    "label": "Enter number",
    "min": 0,
    "max": 100,
    "step": 1,
    "placeholder": "0",
    "required": true
  }
}
```

### 5. linear_feet_input
Specialized number input for measurements.
```json
{
  "type": "linear_feet_input",
  "props": {
    "name": "field_name",
    "label": "Linear Feet",
    "min": 0,
    "max": 1000,
    "placeholder": "Enter feet",
    "required": true
  }
}
```

### 6. select_dropdown
Dropdown selection.
```json
{
  "type": "select_dropdown",
  "props": {
    "name": "field_name",
    "label": "Select Option",
    "placeholder": "Choose...",
    "options": [
      {
        "value": "option1",
        "label": "Option 1"
      }
    ],
    "required": true
  }
}
```

### 7. text_area
Multi-line text input.
```json
{
  "type": "text_area",
  "props": {
    "name": "field_name",
    "label": "Additional Details",
    "placeholder": "Enter details...",
    "rows": 4,
    "maxLength": 500,
    "helpText": "Maximum 500 characters"
  }
}
```

### 8. date_picker
Date selection input.
```json
{
  "type": "date_picker",
  "props": {
    "name": "field_name",
    "label": "Select Date",
    "min": "2024-01-01",
    "max": "2024-12-31",
    "required": true,
    "helpText": "Choose your preferred date"
  }
}
```

### 9. slider_input
Range slider for numeric values.
```json
{
  "type": "slider_input",
  "props": {
    "name": "field_name",
    "label": "Budget Range",
    "min": 1000,
    "max": 50000,
    "step": 500,
    "showValue": true,
    "required": true
  }
}
```

### 10. toggle_switch
Boolean on/off switch.
```json
{
  "type": "toggle_switch",
  "props": {
    "name": "field_name",
    "label": "Contact me ASAP",
    "helpText": "We'll prioritize your request"
  }
}
```

### 11. file_upload
File upload with preview.
```json
{
  "type": "file_upload",
  "props": {
    "name": "field_name",
    "label": "Upload Photos",
    "accept": "image/*",
    "maxSize": 5242880, // 5MB in bytes
    "helpText": "Upload project photos"
  }
}
```

### 12. address_autocomplete
Google Places address autocomplete.
```json
{
  "type": "address_autocomplete",
  "props": {
    "name": "field_name",
    "label": "Property Address",
    "placeholder": "Start typing address...",
    "required": true,
    "helpText": "Full property address"
  }
}
```

### 13. service_selection
Visual card-based service selection with images, titles, and descriptions.
```json
{
  "type": "service_selection",
  "props": {
    "name": "selected_services",
    "label": "What services do you need?",
    "helpText": "Select all services you're interested in",
    "multiple": true,
    "required": true,
    "options": [
      {
        "value": "concrete_driveway",
        "title": "Concrete Driveways",
        "description": "Professional concrete driveway installation and repair",
        "image": "https://example.com/images/concrete-driveway.jpg"
      },
      {
        "value": "lawn_care",
        "title": "Lawn Care Services", 
        "description": "Weekly lawn maintenance, fertilization, and weed control",
        "image": "https://example.com/images/lawn-care.jpg"
      },
      {
        "value": "snow_removal",
        "title": "Snow Removal",
        "description": "24/7 residential snow plowing and ice management"
      }
    ]
  }
}
```

**Properties:**
- `multiple`: Boolean - Allow multiple service selection (default: false)
- `options`: Array of service objects with:
  - `value`: Unique identifier for the service
  - `title`: Service name displayed on card
  - `description`: Service description text
  - `image`: Optional - URL to service image (shows placeholder if omitted)

**Notes:**
- Cards are displayed in a responsive grid (1-3 columns based on screen size)
- Selected cards show blue ring and checkmark
- Images should be high quality and relevant to the service
- If no image provided, shows placeholder with camera icon
- Cards have hover effects and smooth transitions

### 14. map_with_drawing
Interactive map for area/line drawing. Always shows satellite view with top-down perspective.

**Mode Options:**
- `linear`: Draw lines/polylines for fencing, pipelines, etc. Returns total length in feet.
- `area`: Draw polygons for lawns, patios, driveways. Returns square footage.
- `placement`: Draw rectangles for bin/dumpster placement. Returns width and height.

```json
{
  "type": "map_with_drawing",
  "props": {
    "name": "field_name",
    "label": "Mark Project Area",
    "mode": "area", // REQUIRED: "linear", "area", or "placement"
    "required": true,
    "helpText": "Click to draw on map"
  }
}
```

**Important Notes:**
- The `mode` prop is required and determines the drawing behavior
- Mode cannot be changed by users - it's fixed based on your configuration
- Always pair with an `address_autocomplete` component in a previous step for proper map centering
- Map automatically uses satellite view with no option to change

### 15. measurement_hub
Advanced measurement component that handles multiple services with different measurement methods. Automatically adapts based on selected services from previous steps.

```json
{
  "type": "measurement_hub",
  "props": {
    "name": "measurements",
    "label": "Measure Your Project Areas",
    "helpText": "We need measurements to provide an accurate estimate",
    "required": true,
    "servicesConfig": {
      "service_value": {
        "display_name": "Service Display Name",
        "icon": "🏠", // Optional emoji icon
        "requires_measurement": true, // Set to false for services that don't need measurement
        "unit": "sqft", // or "linear_ft"
        "measurement_methods": [
          {
            "type": "map_area", // or "map_linear", "manual_sqft", "manual_linear", "preset_sizes"
            "label": "Draw on Map",
            "description": "Most accurate", // Optional description
            "options": [ // Only for preset_sizes type
              {"label": "10' × 10'", "value": 100},
              {"label": "12' × 12'", "value": 144}
            ]
          }
        ]
      }
    }
  }
}
```

**Features:**
- Automatically displays tabs for each selected service
- Shows completion status for each service
- Allows multiple measurement methods per service
- Services can be marked as not requiring measurement
- Supports different units (square feet vs linear feet)
- Auto-advances to next service after measurement

**Measurement Method Types:**
- `map_area`: Draw polygons on map for area measurement (returns square footage)
- `map_linear`: Draw polylines on map for linear measurement (returns linear feet)
- `manual_sqft`: Manual input for square footage
- `manual_linear`: Manual input for linear feet
- `preset_sizes`: Pre-defined size options

**Important Notes:**
- Requires `selected_services` or similar field from previous step
- Address is automatically passed from personal info step
- Services not in `servicesConfig` will be ignored
- Set `requires_measurement: false` for services like consultations

## Submission Flow Configuration

The submission flow system enables early capture of leads and flexible completion triggers based on business needs. This ensures you capture partial submissions even if users don't complete the entire form.

### Early Capture & Autosave System

```json
{
  "submissionFlow": {
    "early_capture": true,
    "completion_trigger": "quote_viewed",
    "autosave_enabled": true,
    "partial_lead_notifications": true,
    "min_fields_for_capture": ["email"]
  }
}
```

### Submission Flow Properties

- **early_capture**: `boolean` - Create submission record as soon as minimum fields are entered
- **completion_trigger**: `string` - When to mark submission as complete and send notifications
  - `"quote_viewed"` - Complete when user reaches quote page (default)
  - `"meeting_booked"` - Complete when user books an appointment
  - `"cta_clicked"` - Complete when user clicks any CTA button
  - `"form_submitted"` - Complete only when final form is submitted
- **autosave_enabled**: `boolean` - Continuously save form progress as user fills it out
- **partial_lead_notifications**: `boolean` - Send alerts for incomplete submissions
- **min_fields_for_capture**: `string[]` - Required fields to create initial submission (typically `["email"]`)

### Completion Trigger Examples

#### Quote Viewed (Most Common)
```json
{
  "submissionFlow": {
    "early_capture": true,
    "completion_trigger": "quote_viewed",
    "autosave_enabled": true,
    "partial_lead_notifications": true,
    "min_fields_for_capture": ["email"]
  }
}
```
**Use Case**: Most service businesses want to be notified as soon as someone sees their quote, even if they don't take further action.

#### Meeting Booked (Consultation Businesses)
```json
{
  "submissionFlow": {
    "early_capture": true,
    "completion_trigger": "meeting_booked",
    "autosave_enabled": true,
    "partial_lead_notifications": true,
    "min_fields_for_capture": ["email"]
  }
}
```
**Use Case**: Businesses that require in-person consultations (landscaping, custom work) only want notifications for actual appointments.

#### CTA Clicked (Lead Qualification)
```json
{
  "submissionFlow": {
    "early_capture": true,
    "completion_trigger": "cta_clicked",
    "autosave_enabled": true,
    "partial_lead_notifications": true,
    "min_fields_for_capture": ["email"]
  }
}
```
**Use Case**: Businesses that want to know when someone is interested enough to click "Call Me" or "Get Quote" buttons.

#### Form Submitted (Traditional)
```json
{
  "submissionFlow": {
    "early_capture": true,
    "completion_trigger": "form_submitted",
    "autosave_enabled": true,
    "partial_lead_notifications": false,
    "min_fields_for_capture": ["email"]
  }
}
```
**Use Case**: Businesses that only want completed form submissions (like traditional contact forms).

### How the System Works

1. **Early Capture**: As soon as user enters email (or other required fields), a submission record is created with status `'started'`

2. **Progressive Autosave**: Every form interaction updates the submission record with current form data

3. **Completion Triggers**: Based on configuration, different actions trigger completion:
   - User reaches quote page → `'quote_viewed'`
   - User books appointment → `'meeting_booked'`
   - User clicks CTA button → `'cta_clicked'`
   - User submits final form → `'form_submitted'`

4. **Notifications**: When completion trigger is met, business gets notified with full lead details

5. **Abandoned Lead Recovery**: Submissions that don't reach completion trigger can still be followed up on using the captured contact information

### Database Tracking

The system tracks detailed submission progress:

```sql
-- submissions table includes these tracking fields:
current_step TEXT                    -- Which step user is currently on
last_interaction_at TIMESTAMP        -- When user last interacted
quote_viewed_at TIMESTAMP           -- When user reached quote page  
appointment_scheduled_at TIMESTAMP   -- When user booked appointment
cta_clicked_at TIMESTAMP            -- When user clicked CTA button
cta_button_id TEXT                  -- Which CTA button was clicked
completed_at TIMESTAMP              -- When completion trigger was met
completion_status TEXT              -- 'started', 'in_progress', 'complete', 'abandoned'
```

### Partial Lead Notifications

When `partial_lead_notifications: true`, businesses receive alerts for:
- Users who view quotes but don't complete the trigger action
- Users who abandon forms partway through
- Users who complete contact info but don't finish

This enables proactive follow-up on warm leads.

## Scheduling Configuration

The scheduling system supports two modes to handle different business needs:

1. **Simple Mode**: For rentals, deliveries, and services where customers select date ranges (no real-time availability checking)
2. **Meeting Mode**: For consultations and appointments with Google Calendar integration

### Simple Mode (Rentals/Deliveries)

Use this for businesses like bin rentals, equipment rentals, or deliveries where customers need to specify date ranges but the business handles availability management externally.

```json
{
  "scheduling": {
    "enabled": true,
    "mode": "simple",
    "timezone": "America/New_York",
    "business_hours": {
      "monday": { "start": "08:00", "end": "18:00" },
      "tuesday": { "start": "08:00", "end": "18:00" },
      "wednesday": { "start": "08:00", "end": "18:00" },
      "thursday": { "start": "08:00", "end": "18:00" },
      "friday": { "start": "08:00", "end": "18:00" },
      "saturday": { "start": "09:00", "end": "15:00" },
      "sunday": null
    },
    "max_days_ahead": 60,
    "min_hours_notice": 24,
    "simple_mode": {
      "allow_date_ranges": true,
      "min_duration_days": 1,
      "max_duration_days": 30
    }
  }
}
```

**Simple Mode Features:**
- Customers select start and end dates
- No inventory tracking or real-time availability
- Business handles logistics outside the system
- Date range preferences stored in form submission
- No Google Calendar events created

### Meeting Mode (Consultations/Appointments)

Use this for businesses that offer consultations, estimates, or appointments where specific time slots need to be managed.

```json
{
  "scheduling": {
    "enabled": true,
    "mode": "meeting",
    "timezone": "America/New_York",
    "business_hours": {
      "monday": { "start": "09:00", "end": "17:00" },
      "tuesday": { "start": "09:00", "end": "17:00" },
      "wednesday": { "start": "09:00", "end": "17:00" },
      "thursday": { "start": "09:00", "end": "17:00" },
      "friday": { "start": "09:00", "end": "17:00" },
      "saturday": null,
      "sunday": null
    },
    "max_days_ahead": 30,
    "min_hours_notice": 2,
    "meeting_mode": {
      "duration": 60,
      "buffer": 15,
      "google_calendars": ["your-business-calendar@gmail.com"],
      "primary_calendar": "your-business-calendar@gmail.com",
      "send_calendar_invites": true,
      "create_meet_links": true
    }
  }
}
```

**Meeting Mode Features:**
- Customers select specific appointment times
- Google Calendar integration for availability checking
- Automatic calendar event creation
- Calendar invites sent to customers
- Optional Google Meet links
- Real-time availability validation

### Common Configuration Properties

- **enabled**: `boolean` - Enable/disable scheduling for this widget
- **mode**: `string` - "simple" for date ranges, "meeting" for appointments
- **business_hours**: `object` - Define operating hours for each day of the week
  - Set to `null` for closed days
  - Use 24-hour format for start/end times ("HH:MM")
- **timezone**: `string` - Business timezone (e.g., "America/New_York", "UTC")
- **max_days_ahead**: `number` - Maximum days in advance customers can select (default: 30)
- **min_hours_notice**: `number` - Minimum hours notice required (default: 2)

### Google Calendar Integration

To integrate with Google Calendar for real-time availability:

1. **Service Account Setup**: The system uses the service account `calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com`

2. **Calendar Sharing**: Share your Google Calendars with the service account:
   - Open Google Calendar
   - Go to Settings > [Your Calendar] > Share with specific people
   - Add: `calendar-reader@daring-harmony-429818-q6.iam.gserviceaccount.com`
   - Grant "See all event details" permission

3. **Add Calendar Emails to Configuration**:
```json
{
  "scheduling": {
    "enabled": true,
    "google_calendars": [
      "sales@yourcompany.com",
      "john@yourcompany.com",
      "dispatch@yourcompany.com"
    ],
    "business_hours": { ... },
    "duration": 60,
    "buffer": 15,
    "timezone": "America/New_York"
  }
}
```

### Google Calendar Integration (Meeting Mode Only)

For businesses using meeting mode, Google Calendar integration enables real-time availability checking and automatic event creation.

### Scheduling Input Component

Add the scheduling component to your widget steps:

**Simple Mode Example (Date Range Selection):**
```json
{
  "steps": [
    {
      "id": "bin_dates",
      "title": "Select Rental Period",
      "components": [
        {
          "type": "scheduling_input",
          "props": {
            "name": "rentalPeriod",
            "label": "When do you need the bin?",
            "serviceType": "bin_rental"
          }
        }
      ]
    }
  ]
}
```

**Meeting Mode Example (Appointment Booking):**
```json
{
  "steps": [
    {
      "id": "consultation",
      "title": "Schedule Consultation",
      "components": [
        {
          "type": "scheduling_input",
          "props": {
            "name": "appointmentSlot",
            "label": "Select your preferred time",
            "serviceType": "consultation"
          }
        }
      ]
    }
  ]
}
```

### Scheduling Component Properties

- **name**: `string` - Field name to store the scheduling selection
- **label**: `string` - Display label for the scheduling component
- **serviceType**: `string` - Optional service type for context (used in analytics)

### Data Storage

**Simple Mode:** Stores date range selection in form submission:
```json
{
  "rentalPeriod": {
    "mode": "simple",
    "start_date": "2024-07-28",
    "end_date": "2024-08-02"
  }
}
```

**Meeting Mode:** Stores appointment details in form submission:
```json
{
  "appointmentSlot": {
    "mode": "meeting",
    "appointment_datetime": "2024-07-28T14:00:00.000Z",
    "duration": 60
  }
}
```

### Environment Variables

Set these environment variables for Google Calendar integration:

```env
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PRIVATE_KEY_ID="your_private_key_id"
GOOGLE_CLIENT_ID="your_client_id"
```

### Testing Calendar Integration

Use the test endpoint to validate your Google Calendar setup:

```bash
curl -X POST /api/calendar/test \
  -H "Content-Type: application/json" \
  -d '{
    "calendars": ["sales@yourcompany.com", "dispatch@yourcompany.com"],
    "timezone": "America/New_York"
  }'
```

### Database Tables

The scheduling system uses these additional tables:

#### inventory_items
```sql
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  type TEXT CHECK (type IN ('bin', 'equipment', 'vehicle', 'material')),
  name TEXT NOT NULL,
  sku TEXT,
  quantity INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true
);
```

#### bookings
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  widget_id UUID REFERENCES widgets(id),
  submission_id UUID REFERENCES submissions(id),
  customer_email TEXT,
  customer_name TEXT,
  inventory_item_id UUID REFERENCES inventory_items(id),
  service_type TEXT NOT NULL,
  appointment_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT
);
```

## Configuration Examples

### Fencing Estimator
```json
{
  "steps": [
    {
      "id": "fence-type",
      "title": "Fence Type",
      "components": [
        {
          "type": "radio_group",
          "props": {
            "name": "fence_type",
            "label": "What type of fence do you need?",
            "options": [
              {
                "value": "wood_privacy",
                "label": "Wood Privacy",
                "description": "6ft cedar privacy fence"
              },
              {
                "value": "chain_link",
                "label": "Chain Link",
                "description": "Galvanized chain link"
              }
            ],
            "required": true
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Measurements",
      "components": [
        {
          "type": "linear_feet_input",
          "props": {
            "name": "fence_length",
            "label": "Total Linear Feet",
            "min": 10,
            "max": 1000,
            "required": true
          }
        },
        {
          "type": "number_input",
          "props": {
            "name": "gate_count",
            "label": "Number of Gates",
            "min": 0,
            "max": 10,
            "step": 1
          }
        }
      ]
    }
  ]
}
```

### Landscaping Estimator with Map
```json
{
  "steps": [
    {
      "id": "location",
      "title": "Project Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "address",
            "label": "Property Address",
            "required": true
          }
        },
        {
          "type": "map_with_drawing",
          "props": {
            "name": "project_area",
            "label": "Draw Project Area",
            "mode": "area",
            "required": true,
            "helpText": "Click points to outline the lawn area"
          }
        }
      ]
    }
  ]
}
```

### Multi-Service Home Contractor Estimator
```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Services Needed",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "selected_services",
            "label": "What services do you need?",
            "helpText": "Select all services you're interested in",
            "multiple": true,
            "required": true,
            "options": [
              {
                "value": "concrete_driveway",
                "title": "Concrete Driveways",
                "description": "Professional concrete driveway installation and repair",
                "image": "https://example.com/images/concrete-driveway.jpg"
              },
              {
                "value": "landscaping",
                "title": "Landscaping",
                "description": "Complete landscape design and installation services",
                "image": "https://example.com/images/landscaping.jpg"
              },
              {
                "value": "snow_removal",
                "title": "Snow Removal",
                "description": "24/7 residential snow plowing and ice management"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "project-location", 
      "title": "Project Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "project_address",
            "label": "Property Address",
            "required": true
          }
        }
      ]
    }
  ]
}
```

### Dumpster Rental with Placement Map
```json
{
  "steps": [
    {
      "id": "delivery-location",
      "title": "Delivery Location",
      "components": [
        {
          "type": "address_autocomplete",
          "props": {
            "name": "delivery_address",
            "label": "Delivery Address",
            "required": true
          }
        },
        {
          "type": "map_with_drawing",
          "props": {
            "name": "placement_location",
            "label": "Mark Dumpster Placement",
            "mode": "placement",
            "required": true,
            "helpText": "Click twice to place a rectangle where the dumpster should go"
          }
        }
      ]
    }
  ]
}
```

### Complete Multi-Service Estimator with MeasurementHub
```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Select Services",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "selected_services",
            "label": "What services do you need?",
            "multiple": true,
            "required": true,
            "options": [
              {
                "value": "lawn_care",
                "title": "Lawn Care",
                "description": "Regular maintenance and treatment"
              },
              {
                "value": "patio",
                "title": "Patio Installation",
                "description": "Custom patio design and installation"
              },
              {
                "value": "fence",
                "title": "Fence Installation",
                "description": "Privacy and security fencing"
              },
              {
                "value": "consultation",
                "title": "Design Consultation",
                "description": "Professional landscape design advice"
              }
            ]
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Project Measurements",
      "components": [
        {
          "type": "measurement_hub",
          "props": {
            "name": "measurements",
            "label": "Measure Your Project Areas",
            "required": true,
            "servicesConfig": {
              "lawn_care": {
                "display_name": "Lawn",
                "icon": "🌱",
                "requires_measurement": true,
                "unit": "sqft",
                "measurement_methods": [
                  {
                    "type": "map_area",
                    "label": "Draw on Map",
                    "description": "Most accurate"
                  },
                  {
                    "type": "manual_sqft",
                    "label": "Enter Size"
                  }
                ]
              },
              "patio": {
                "display_name": "Patio",
                "icon": "🏠",
                "requires_measurement": true,
                "unit": "sqft",
                "measurement_methods": [
                  {
                    "type": "map_area",
                    "label": "Draw on Map"
                  },
                  {
                    "type": "manual_sqft",
                    "label": "Enter Size"
                  },
                  {
                    "type": "preset_sizes",
                    "label": "Common Sizes",
                    "options": [
                      {"label": "10' × 10'", "value": 100},
                      {"label": "12' × 12'", "value": 144},
                      {"label": "15' × 15'", "value": 225},
                      {"label": "20' × 20'", "value": 400}
                    ]
                  }
                ]
              },
              "fence": {
                "display_name": "Fence",
                "icon": "🚧",
                "requires_measurement": true,
                "unit": "linear_ft",
                "measurement_methods": [
                  {
                    "type": "map_linear",
                    "label": "Draw on Map",
                    "description": "Draw fence line path"
                  },
                  {
                    "type": "manual_linear",
                    "label": "Enter Linear Feet",
                    "description": "Measure perimeter"
                  }
                ]
              },
              "consultation": {
                "display_name": "Consultation",
                "icon": "💬",
                "requires_measurement": false
              }
            }
          }
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Field Names**: Use snake_case for field names (e.g., `project_type`, `square_feet`)
2. **Step IDs**: Use kebab-case for step IDs (e.g., `project-details`, `contact-info`)
3. **Required Fields**: Mark essential fields as required
4. **Help Text**: Provide clear instructions for complex inputs
5. **Validation**: Use min/max values for numeric inputs
6. **Map Components**: Always pair with address input for proper centering

## Testing Your Widget

After creating a widget, test it at:
```
https://yourdomain.com/iframe/[embed_key]
```

For local testing:
```
http://localhost:3000/iframe/[embed_key]
```

## Quote Step Configuration

The quote step creates a dedicated final page that displays a comprehensive estimate with customizable call-to-action buttons. This step appears after all form steps and provides a professional quote presentation.

### Basic Structure

```json
{
  "steps": [...], // Your existing form steps
  
  "quoteStep": {
    "title": "Your Estimate",
    "subtitle": "Based on the information you provided",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "submit",
        "text": "Get This Quote",
        "type": "primary",
        "action": "submit"
      },
      {
        "id": "call",
        "text": "Call Us Now",
        "type": "secondary", 
        "action": "phone",
        "config": {
          "phoneNumber": "+1-555-123-4567"
        }
      }
    ]
  }
}
```

### Quote Step Properties

#### Core Settings

- **title**: Main heading displayed on the quote page
- **subtitle**: Optional subheading for additional context
- **showDetailedBreakdown**: Whether to show itemized pricing breakdown (requires pricingCalculator)

#### CTA Buttons Configuration

Each button in the `ctaButtons` array supports:

- **id**: Unique identifier for the button
- **text**: Button label text
- **type**: Visual style - `"primary"` (blue background) or `"secondary"` (white with blue border)
- **action**: Button behavior - see actions below
- **config**: Additional configuration based on action type

### CTA Button Actions

#### 1. Submit Action
Submits the form data and pricing to your system.

```json
{
  "id": "submit",
  "text": "Get This Quote",
  "type": "primary",
  "action": "submit"
}
```

#### 2. Phone Action
Opens the phone dialer with a pre-filled number.

```json
{
  "id": "call",
  "text": "Call Us Now",
  "type": "secondary",
  "action": "phone",
  "config": {
    "phoneNumber": "+1-555-123-4567"
  }
}
```

#### 3. Calendar Action
Opens a calendar booking system (like Calendly, Acuity, etc.)

```json
{
  "id": "schedule",
  "text": "Schedule Site Visit",  
  "type": "primary",
  "action": "calendar",
  "config": {
    "calendarUrl": "https://calendly.com/your-business/consultation",
    "newTab": true
  }
}
```

#### 4. Custom Action
Opens any custom URL for specialized workflows.

```json
{
  "id": "payment",
  "text": "Pay Deposit",
  "type": "primary", 
  "action": "custom",
  "config": {
    "customUrl": "https://your-payment-system.com/deposit",
    "newTab": false
  }
}
```

### Quote Step Features

#### Service Summary
Automatically displays:
- Selected services with labels
- Key measurements (linear feet, square feet, days, etc.)
- Additional options (gates, prep work, waste type, etc.)

#### Pricing Display  
Shows pricing based on your pricingCalculator configuration:
- **Fixed**: Exact calculated price
- **Range**: Price range with multiplier
- **Minimum**: "Starting at" format
- **Custom**: For services without pricing calculator

#### Detailed Breakdown
When `showDetailedBreakdown: true`:
- Base price calculation
- Applied modifiers with descriptions
- Minimum charge notation (if applied)
- Total with clear formatting

### Business Flow Examples

#### Bin Rental Service
```json
{
  "quoteStep": {
    "title": "Your Bin Rental Quote",
    "subtitle": "Ready to deliver to your location",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "schedule_delivery",
        "text": "Schedule Delivery",
        "type": "primary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://calendly.com/bin-rentals/delivery",
          "newTab": true
        }
      },
      {
        "id": "call_questions",
        "text": "Have Questions? Call Us",
        "type": "secondary",
        "action": "phone",
        "config": {
          "phoneNumber": "+1-555-BIN-RENT"
        }
      }
    ]
  }
}
```

#### Landscaping Service
```json
{
  "quoteStep": {
    "title": "Your Landscaping Estimate",
    "subtitle": "Professional design and installation services",
    "showDetailedBreakdown": false,
    "ctaButtons": [
      {
        "id": "book_consultation",
        "text": "Book Free Consultation",
        "type": "primary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://acuityscheduling.com/landscaping/consultation",
          "newTab": true
        }
      },
      {
        "id": "submit_quote",
        "text": "Request Detailed Quote",
        "type": "secondary",
        "action": "submit"
      }
    ]
  }
}
```

#### Fencing Service  
```json
{
  "quoteStep": {
    "title": "Your Fencing Quote",
    "subtitle": "Professional installation with warranty",
    "showDetailedBreakdown": true,
    "ctaButtons": [
      {
        "id": "get_quote",
        "text": "Get This Quote",
        "type": "primary", 
        "action": "submit"
      },
      {
        "id": "schedule_measurement",
        "text": "Schedule Free Measurement",
        "type": "secondary",
        "action": "calendar",
        "config": {
          "calendarUrl": "https://calendly.com/fence-company/measurement",
          "newTab": true
        }
      },
      {
        "id": "call_now",
        "text": "Call for Questions",
        "type": "secondary",
        "action": "phone", 
        "config": {
          "phoneNumber": "+1-555-FENCING"
        }
      }
    ]
  }
}
```

### Quote Step Best Practices

1. **Clear Messaging**: Use titles and subtitles that match your business tone
2. **Action Hierarchy**: Put the most important action first with `"primary"` type
3. **Multiple Options**: Offer 2-3 different ways for customers to proceed
4. **Contact Methods**: Always provide a way to ask questions (phone/email)
5. **Booking Integration**: Use calendar links for services requiring appointments
6. **Payment Flows**: Link to payment systems for services requiring deposits

### Integration Notes

- Quote step appears automatically after the last configured form step
- Works with or without pricing calculator
- Service summary adapts to single or multi-service forms
- All customer data is preserved through the quote step
- CTA actions can trigger form submission with full pricing data

## Advanced Quote Step Configuration (QuoteStepDisplay)

The `QuoteStepDisplay` component provides a premium, highly customizable quote page with a professional 3-column layout, timeline display, and extensive styling options. This is perfect for high-value services that need a more sophisticated presentation.

### Basic Structure

```json
{
  "steps": [...], // Your existing form steps
  
  "quoteStep": {
    "enabled": true,
    "component": "QuoteStepDisplay",
    "config": {
      "header": {
        "title": "Your Quote is Ready!",
        "subtitle": "Here's your personalized estimate",
        "showQuoteNumber": true,
        "showSuccessIcon": true
      },
      "breakdown": {
        "showServiceBreakdown": true,
        "showOptionsBreakdown": true,
        "showBaseCalculation": true
      },
      "timeline": {
        "showTimeline": true,
        "steps": [
          {
            "title": "Site Visit",
            "description": "On-site consultation and measurements",
            "duration": "3-5 days"
          },
          {
            "title": "Final Quote",
            "description": "Detailed proposal with accurate pricing",
            "duration": "1-2 days"
          }
        ]
      },
      "contact": {
        "showContactInfo": true,
        "showNextSteps": true,
        "nextSteps": [
          {
            "title": "Quote Submitted",
            "description": "We've received your quote request",
            "status": "completed"
          },
          {
            "title": "We'll Call You",
            "description": "Within 24 hours to schedule consultation",
            "status": "active"
          },
          {
            "title": "Site Assessment",
            "description": "Professional measurement and consultation",
            "status": "pending"
          }
        ]
      },
      "cta": {
        "showCta": true,
        "title": "Ready to Get Started?",
        "subtitle": "Call us now to expedite your project",
        "buttonText": "Call Now",
        "phoneNumber": "(555) 123-4567"
      },
      "actions": {
        "showBackButton": true,
        "showShareButton": true,
        "showDownloadButton": true
      },
      "styling": {
        "headerBgColor": "bg-green-50",
        "primaryColor": "text-green-600",
        "cardShadow": "soft",
        "layout": "sidebar"
      }
    }
  }
}
```

### QuoteStepDisplay Configuration Options

#### Header Configuration
Controls the top success section of the quote page.

```json
"header": {
  "title": "Your Quote is Ready!",           // Main heading
  "subtitle": "Here's your personalized estimate", // Subheading
  "showQuoteNumber": true,                  // Display auto-generated quote number
  "showSuccessIcon": true                   // Show checkmark icon
}
```

#### Breakdown Configuration  
Controls how pricing information is displayed.

```json
"breakdown": {
  "showServiceBreakdown": true,    // Show itemized service list
  "showOptionsBreakdown": true,    // Show add-on options for each service
  "showBaseCalculation": true      // Show base price calculation details
}
```

#### Timeline Configuration
Displays project timeline with customizable steps.

```json
"timeline": {
  "showTimeline": true,
  "steps": [
    {
      "title": "Site Visit",              // Step name
      "description": "On-site consultation", // Step description
      "duration": "3-5 days"              // Time estimate
    }
  ]
}
```

#### Contact & Next Steps Configuration
Shows customer information and process workflow.

```json
"contact": {
  "showContactInfo": true,    // Display customer contact details
  "showNextSteps": true,      // Show workflow steps
  "nextSteps": [
    {
      "title": "Quote Submitted",
      "description": "We've received your request",
      "status": "completed"     // "completed", "active", or "pending"
    }
  ]
}
```

#### Call-to-Action Configuration
Prominent CTA section in the sidebar.

```json
"cta": {
  "showCta": true,
  "title": "Ready to Get Started?",
  "subtitle": "Call us now to expedite",
  "buttonText": "Call Now",
  "phoneNumber": "(555) 123-4567"
}
```

#### Actions Configuration
Header action buttons for additional functionality.

```json
"actions": {
  "showBackButton": true,     // "Back to Form" button
  "showShareButton": true,    // Share quote button
  "showDownloadButton": true  // Download PDF button
}
```

#### Styling Configuration
Visual customization options.

```json
"styling": {
  "headerBgColor": "bg-green-50",    // Header background (Tailwind class)
  "primaryColor": "text-green-600",   // Primary text color (Tailwind class)
  "cardShadow": "soft",               // "none", "soft", or "large"
  "layout": "sidebar"                 // "single" or "sidebar" (3-column)
}
```

### Styling Options

#### Header Background Colors
```json
"headerBgColor": "bg-blue-50"    // Blue theme
"headerBgColor": "bg-green-50"   // Green theme  
"headerBgColor": "bg-purple-50"  // Purple theme
"headerBgColor": "bg-gray-50"    // Neutral theme
```

#### Primary Colors
```json
"primaryColor": "text-blue-600"    // Blue accent
"primaryColor": "text-green-600"   // Green accent
"primaryColor": "text-purple-600"  // Purple accent
"primaryColor": "text-gray-800"    // Dark neutral
```

#### Card Shadows
```json
"cardShadow": "none"   // No shadow
"cardShadow": "soft"   // Subtle shadow
"cardShadow": "large"  // Prominent shadow
```

#### Layout Options
```json
"layout": "single"   // Single column layout
"layout": "sidebar"  // 3-column layout with sidebar (recommended)
```

### Complete Example: Hardscape Service

```json
{
  "quoteStep": {
    "enabled": true,
    "component": "QuoteStepDisplay",
    "config": {
      "header": {
        "title": "Your Hardscape Quote is Ready!",
        "subtitle": "Here is your personalized hardscaping estimate",
        "showQuoteNumber": true,
        "showSuccessIcon": true
      },
      "breakdown": {
        "showServiceBreakdown": true,
        "showOptionsBreakdown": true,
        "showBaseCalculation": true
      },
      "timeline": {
        "showTimeline": true,
        "steps": [
          {
            "title": "Site Visit",
            "description": "On-site consultation and measurements",
            "duration": "3-5 days"
          },
          {
            "title": "Design & Quote", 
            "description": "Detailed design with final pricing",
            "duration": "5-7 days"
          },
          {
            "title": "Project Start",
            "description": "Construction begins",
            "duration": "2-4 weeks"
          }
        ]
      },
      "contact": {
        "showContactInfo": true,
        "showNextSteps": true,
        "nextSteps": [
          {
            "title": "Quote Submitted",
            "description": "We have received your quote request",
            "status": "completed"
          },
          {
            "title": "Design Consultation",
            "description": "We will call within 24 hours to schedule",
            "status": "active"
          },
          {
            "title": "Site Assessment", 
            "description": "Professional on-site measurement and consultation",
            "status": "pending"
          },
          {
            "title": "Final Design",
            "description": "Complete design package with accurate pricing",
            "status": "pending"
          }
        ]
      },
      "cta": {
        "showCta": true,
        "title": "Ready to Transform Your Space?",
        "subtitle": "Call us now to get started on your hardscape project",
        "buttonText": "Call Now",
        "phoneNumber": "(555) 123-HARD"
      },
      "actions": {
        "showBackButton": true,
        "showShareButton": true,
        "showDownloadButton": true
      },
      "styling": {
        "headerBgColor": "bg-green-50",
        "primaryColor": "text-green-600", 
        "cardShadow": "soft",
        "layout": "sidebar"
      }
    }
  }
}
```

### QuoteStepDisplay vs Standard Quote Step

**Use QuoteStepDisplay when:**
- High-value services ($2,000+)
- Complex multi-service offerings
- Need professional presentation
- Want to showcase company process/timeline
- Require detailed service breakdowns

**Use Standard Quote Step when:**
- Simple single-service widgets
- Lower-value services
- Want faster, simpler quotes
- Limited customization needs

### Best Practices for QuoteStepDisplay

1. **Timeline Accuracy**: Use realistic timeframes in your timeline steps
2. **Next Steps Clarity**: Make the process transparent with clear next steps
3. **Contact Information**: Always include easy ways to reach you
4. **Visual Consistency**: Match colors to your brand
5. **Mobile Responsive**: The component automatically adapts to mobile screens
6. **Service Descriptions**: Use clear, benefit-focused service descriptions

## Pricing Calculator Configuration

The pricing calculator allows you to display real-time pricing estimates as users fill out your widget. It's completely configurable through JSON and supports complex pricing logic.

### Basic Structure

```json
{
  "steps": [...], // Your existing form steps
  
  "pricingCalculator": {
    "basePricing": {
      "service_field": "field_name",  // Which form field determines the service
      "prices": {
        "service_option_1": {
          "amount": 45,
          "unit": "linear_foot",
          "minCharge": 500
        },
        "service_option_2": {
          "amount": 25,
          "unit": "sqft",
          "minCharge": 300
        }
      }
    },
    
    "modifiers": [
      // Optional: Price adjustments based on form data
    ],
    
    "driveTime": {
      // Optional: Add drive time/distance-based pricing
      // See Drive Time Pricing section below
    },
    
    "display": {
      "showCalculation": true,     // Show detailed breakdown
      "format": "range",           // "fixed", "range", or "minimum"
      "rangeMultiplier": 1.2       // For range: show price to price×1.2
    }
  }
}
```

### Base Pricing Configuration

The `basePricing` section defines your core service pricing:

- **service_field**: The form field that determines which service was selected
- **prices**: Object mapping service values to pricing config
- **amount**: Price per unit
- **unit**: What unit the pricing is based on (see supported units below)
- **minCharge**: Optional minimum charge (overrides calculated price if lower)

#### Supported Units

- `linear_foot` / `linear_feet` - Maps to form fields: linearFeet, linear_feet, feet
- `sqft` / `square_feet` - Maps to form fields: sqft, square_feet, area
- `cubic_yard` - Maps to form fields: cubic_yards, yards
- `days` - Maps to form fields: days, rentalDays, duration
- `hours` - Maps to form fields: hours, duration
- `units` - Maps to form fields: quantity, count, units

### Modifiers

Modifiers allow you to adjust pricing based on additional form data. There are three types:

#### 1. Per Unit Modifiers

Multiplies a form field value by a price amount:

```json
{
  "id": "gates",
  "type": "perUnit",
  "field": "gateCount",
  "calculation": {
    "operation": "add",
    "amount": 200,
    "perUnit": true          // $200 × gateCount
  }
}
```

#### 2. Conditional Modifiers

Applies when a condition is met:

```json
{
  "id": "difficult_access",
  "type": "conditional",
  "field": "hasdifficultAccess",
  "condition": "equals",
  "value": true,
  "calculation": {
    "operation": "multiply",
    "amount": 1.25           // 25% increase
  }
}
```

#### 3. Threshold Modifiers

Applies when a field value crosses a threshold:

```json
{
  "id": "large_project_discount",
  "type": "threshold",
  "field": "linearFeet",
  "condition": "greaterThan",
  "value": 500,
  "calculation": {
    "operation": "multiply",
    "amount": 0.9            // 10% discount for projects > 500ft
  }
}
```

### Calculation Operations

- **add**: Adds the amount to current price
- **multiply**: Multiplies current price by amount (use for percentages)
- **subtract**: Subtracts the amount from current price

### Display Options

#### Format Types

- **fixed**: Shows exact calculated price
- **range**: Shows price range (configured with rangeMultiplier or rangeConfig)
- **minimum**: Shows "Starting at $X" format

#### Range Pricing Configuration

Range pricing allows businesses to show price ranges instead of exact prices, helping qualify leads while keeping actual pricing private.

**Method 1: Simple Range Multiplier (Legacy)**
```json
{
  "display": {
    "format": "range",
    "rangeMultiplier": 1.2  // Shows $1000 - $1200 for $1000 base price
  }
}
```

**Method 2: Percentage-Based Range (Recommended)**
```json
{
  "display": {
    "format": "range",
    "rangeConfig": {
      "type": "percentage",
      "lowerBound": 85,   // 85% of actual price
      "upperBound": 115   // 115% of actual price
    }
  }
}
```

**Method 3: Multiplier-Based Range**
```json
{
  "display": {
    "format": "range", 
    "rangeConfig": {
      "type": "multiplier",
      "lowerBound": 0.85,   // 85% of actual price
      "upperBound": 1.15    // 115% of actual price
    }
  }
}
```

**Range Examples:**
- Base price: $1000, Range config: 85%-115% → Shows: "$850 - $1,150"
- Base price: $2500, Range config: 90%-120% → Shows: "$2,250 - $3,000"  
- Base price: $500, Range config: 80%-110% → Shows: "$400 - $550"

**Benefits of Range Pricing:**
- Protects exact pricing from competitors
- Still provides value indication for lead qualification
- Allows for site-specific adjustments
- Creates room for negotiations
- Reduces price shopping between providers

#### Show Calculation

When `showCalculation: true`, displays:
- Base price calculation
- Each applied modifier
- Minimum charge (if applied)
- Final total

### Complete Examples

#### Fencing Estimator with Range Pricing

```json
{
  "steps": [
    {
      "id": "fence-type", 
      "title": "Fence Type",
      "components": [
        {
          "type": "radio_group",
          "props": {
            "name": "fenceType",
            "label": "What type of fence do you need?",
            "options": [
              {
                "value": "wood_privacy",
                "label": "Wood Privacy",
                "description": "6ft cedar privacy fence"
              },
              {
                "value": "chain_link",
                "label": "Chain Link", 
                "description": "Galvanized chain link"
              }
            ],
            "required": true
          }
        }
      ]
    },
    {
      "id": "measurements",
      "title": "Measurements",
      "components": [
        {
          "type": "linear_feet_input",
          "props": {
            "name": "linearFeet",
            "label": "Total Linear Feet",
            "min": 10,
            "max": 1000,
            "required": true
          }
        },
        {
          "type": "number_input", 
          "props": {
            "name": "gateCount",
            "label": "Number of Gates",
            "min": 0,
            "max": 10,
            "step": 1
          }
        }
      ]
    }
  ],
  
  "showInstantQuote": true,
  
  "pricingCalculator": {
    "basePricing": {
      "service_field": "fenceType",
      "prices": {
        "wood_privacy": {
          "amount": 45,
          "unit": "linear_foot",
          "minCharge": 500
        },
        "chain_link": {
          "amount": 25,
          "unit": "linear_foot",
          "minCharge": 300
        }
      }
    },
    
    "modifiers": [
      {
        "id": "gates",
        "type": "perUnit",
        "field": "gateCount",
        "calculation": {
          "operation": "add",
          "amount": 200,
          "perUnit": true
        }
      },
      {
        "id": "large_project_discount",
        "type": "threshold",
        "field": "linearFeet", 
        "condition": "greaterThan",
        "value": 500,
        "calculation": {
          "operation": "multiply",
          "amount": 0.9
        }
      }
    ],
    
    "display": {
      "showCalculation": true,
      "format": "range",
      "rangeConfig": {
        "type": "percentage",
        "lowerBound": 85,
        "upperBound": 115
      }
    }
  }
}
```

#### Bin Rental with Time-Based Pricing

```json
{
  "pricingCalculator": {
    "basePricing": {
      "service_field": "binSize",
      "prices": {
        "10_yard": { "amount": 300, "unit": "days", "minCharge": 300 },
        "20_yard": { "amount": 400, "unit": "days", "minCharge": 400 },
        "30_yard": { "amount": 500, "unit": "days", "minCharge": 500 }
      }
    },
    "modifiers": [
      {
        "id": "extra_days",
        "type": "threshold",
        "field": "rentalDays",
        "condition": "greaterThan",
        "value": 7,
        "calculation": {
          "operation": "add",
          "amount": 25,
          "perUnit": true
        }
      },
      {
        "id": "concrete_surcharge",
        "type": "conditional",
        "field": "wasteType",
        "condition": "equals",
        "value": "concrete",
        "calculation": {
          "operation": "add",
          "amount": 150
        }
      }
    ],
    "display": {
      "showCalculation": true,
      "format": "fixed"
    }
  }
}
```

#### Landscaping with Area-Based Pricing

```json
{
  "pricingCalculator": {
    "basePricing": {
      "service_field": "serviceType",
      "prices": {
        "lawn_install": { "amount": 2.50, "unit": "sqft" },
        "mulch_delivery": { "amount": 45, "unit": "cubic_yard" }
      }
    },
    "modifiers": [
      {
        "id": "prep_work",
        "type": "conditional",
        "field": "needsPrepWork",
        "condition": "equals", 
        "value": true,
        "calculation": {
          "operation": "add",
          "amount": 0.75,
          "perUnit": true
        }
      }
    ],
    "display": {
      "showCalculation": false,
      "format": "minimum"
    }
  }
}
```

### Testing Your Pricing

1. Set up your widget with pricing configuration
2. Fill out the form to see real-time price updates
3. Check the final estimate includes pricing breakdown
4. Verify pricing data is stored in the estimates table

## Drive Time Pricing

Add automatic distance-based pricing to account for travel costs from your yard/office to the job site. The system calculates driving distance using Google Maps and applies your configured pricing rules.

### Basic Drive Time Configuration

```json
{
  "pricingCalculator": {
    "basePricing": {...},
    "modifiers": [...],
    
    "driveTime": {
      "enabled": true,
      "yardAddress": "123 Main St, Your City, State 12345",
      "addressField": "address",
      "pricing": {
        "type": "perMile",
        "rate": 2.50,
        "freeRadius": 15,
        "maxDistance": 50
      }
    }
  }
}
```

### Drive Time Properties

#### Core Settings

- **enabled**: Whether drive time pricing is active
- **yardAddress**: Your business address (yard, warehouse, office)
- **addressField**: Form field containing customer address (usually "address")
- **pricing**: Pricing configuration object

### Drive Time Pricing Types

#### 1. Per Mile Pricing

Charges a fixed rate per mile of driving distance.

```json
{
  "type": "perMile",
  "rate": 2.50,           // $2.50 per mile
  "freeRadius": 15,       // First 15 miles free
  "maxDistance": 50       // Service limit: 50 miles max
}
```

#### 2. Per Minute Pricing

Charges based on estimated driving time.

```json
{
  "type": "perMinute", 
  "rate": 1.00,          // $1.00 per minute
  "freeRadius": 10,      // ~10 miles free (varies by traffic)
  "maxDistance": 60      // Service limit: 60 miles max
}
```

#### 3. Tiered Distance Pricing

Different flat rates for distance zones.

```json
{
  "type": "tiered",
  "tiers": [
    {
      "minDistance": 0,
      "maxDistance": 15,
      "rate": 0           // Free within 15 miles
    },
    {
      "minDistance": 15,
      "maxDistance": 30,
      "rate": 50          // $50 flat rate for 15-30 miles
    },
    {
      "minDistance": 30,
      "maxDistance": 50,
      "rate": 100         // $100 flat rate for 30-50 miles
    }
  ],
  "maxDistance": 50
}
```

### Drive Time Configuration Options

#### Free Radius

Set a distance within which you don't charge for travel:

```json
{
  "type": "perMile",
  "rate": 3.00,
  "freeRadius": 20      // No charge within 20 miles
}
```

#### Maximum Distance

Limit service area to prevent unrealistic jobs:

```json
{
  "type": "perMile", 
  "rate": 2.00,
  "maxDistance": 75     // No service beyond 75 miles
}
```

#### Billable Distance Calculation

- **With Free Radius**: Only distance beyond free radius is charged
- **Without Free Radius**: Full distance from yard to job site is charged

### Business Examples

#### Local Fencing Company

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "456 Industrial Dr, Springfield, IL 62701",
    "addressField": "address",
    "pricing": {
      "type": "perMile",
      "rate": 3.00,
      "freeRadius": 20,
      "maxDistance": 60
    }
  }
}
```

**Result**: Free within 20 miles, then $3/mile for 21-60 miles. No service beyond 60 miles.

#### Regional Bin Rental Service

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "789 Depot Rd, Central City, TX 75001", 
    "addressField": "address",
    "pricing": {
      "type": "tiered",
      "tiers": [
        {"minDistance": 0, "maxDistance": 25, "rate": 0},
        {"minDistance": 25, "maxDistance": 50, "rate": 75},
        {"minDistance": 50, "maxDistance": 100, "rate": 150}
      ],
      "maxDistance": 100
    }
  }
}
```

**Result**: Free within 25 miles, $75 delivery fee for 25-50 miles, $150 for 50-100 miles.

#### Metro Landscaping Service

```json
{
  "driveTime": {
    "enabled": true,
    "yardAddress": "321 Garden Ave, Metro City, CA 90210",
    "addressField": "address", 
    "pricing": {
      "type": "perMinute",
      "rate": 1.25,
      "freeRadius": 12,
      "maxDistance": 40
    }
  }
}
```

**Result**: Free within ~12 miles, then $1.25/minute drive time for longer distances.

### Technical Implementation

#### Distance Calculation

- Uses Google Maps Distance Matrix API for accurate driving distances
- Accounts for actual roads, traffic patterns, and route optimization
- Returns both distance (miles) and duration (minutes)

#### Fallback Behavior

- Development mode uses mock distance calculations
- If Google Maps API fails, drive time cost is skipped (no error to user)
- Distance calculation happens when customer address is entered

#### Performance

- Distance calculated asynchronously on quote step
- Real-time pricing shows estimated cost without drive time
- Final quote includes accurate drive time calculation

### Drive Time Display

Drive time costs appear in pricing breakdowns as:

- **Free Delivery**: "Free delivery within 15 miles"
- **Per Mile**: "Drive time: 12.5 billable miles × $3.00/mile"
- **Per Minute**: "Drive time: 25 minutes × $1.25/minute"  
- **Tiered**: "Drive time: 25-50 mile zone - $75"
- **Out of Range**: "Service not available beyond 50 miles"

### Setup Requirements

#### Google Maps API Key

1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Enable Distance Matrix API
3. Add to environment: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key`

#### Address Field Configuration

Ensure your widget has an address input field:

```json
{
  "type": "address_autocomplete",
  "props": {
    "name": "address",
    "label": "Service Address",
    "required": true
  }
}
```

### Best Practices

1. **Realistic Rates**: Research actual vehicle costs (IRS rate is ~65¢/mile)
2. **Free Radius**: Set based on your typical service area
3. **Maximum Distance**: Prevent quotes for unrealistic distances
4. **Clear Communication**: Use descriptive labels in pricing breakdown
5. **Test Addresses**: Verify calculations with known distances
6. **Backup Plans**: Always handle API failures gracefully

### Pricing Best Practices

1. **Start Simple**: Begin with base pricing only, add modifiers as needed
2. **Test Thoroughly**: Try edge cases and different form combinations
3. **Clear Units**: Make sure your form fields match the pricing units
4. **Reasonable Minimums**: Set minimum charges to avoid unrealistic low prices
5. **User Experience**: Consider whether to show detailed breakdowns or simple totals
6. **A/B Testing**: The JSON configuration makes it easy to test different pricing approaches

## Email Notifications

Configure automatic email notifications when leads are submitted through your widgets. The system supports both business notifications and customer confirmations.

### Configuration Structure

```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "business_emails": ["owner@company.com", "sales@company.com"],
      "send_customer_confirmation": true,
      "send_business_alert": true
    }
  }
}
```

### Configuration Options

#### `enabled` (boolean)
- Controls whether email notifications are active
- Set to `false` to disable all email notifications for this widget

#### `business_emails` (array of strings)
- List of email addresses to receive new lead alerts
- Can include multiple recipients (owner, sales team, etc.)
- Each email gets the same notification content

#### `send_customer_confirmation` (boolean)
- When `true`, sends a confirmation email to the customer
- Uses the customer's email address from the form
- Professional thank you message with quote summary

#### `send_business_alert` (boolean)
- When `true`, sends new lead notifications to business emails
- Includes all form data, pricing, and customer contact info
- Formatted for quick review and follow-up

### Email Templates
 
The system includes two professional email templates:

#### New Lead Alert (Business Notification)
- **Recipients**: Business email addresses
- **Subject**: "New Lead from {{service}} Widget - {{name}}"
- **Content**: Complete lead information including contact details, service selection, pricing, and measurements
- **Purpose**: Immediate notification to start follow-up process

#### Customer Confirmation
- **Recipients**: Customer email address from form
- **Subject**: "Thank you for your {{service}} quote request"
- **Content**: Professional confirmation with quote summary and next steps
- **Purpose**: Build trust and set expectations

### Template Variables

Both templates support dynamic variables from the form data:

- `{{name}}` - Customer's full name
- `{{email}}` - Customer's email address
- `{{phone}}` - Customer's phone number
- `{{address}}` - Property/service address
- `{{service}}` - Selected service(s)
- `{{price}}` - Calculated estimate (if pricing enabled)
- `{{measurements}}` - Any measurements (linear feet, square feet, etc.)
- `{{additionalInfo}}` - Additional options selected
- `{{timestamp}}` - When the quote was requested
- `{{widgetName}}` - Name of the widget used
- `{{businessName}}` - Your business name
- `{{businessEmail}}` - Your business email
- `{{businessPhone}}` - Your business phone

### Setup Requirements

#### 1. Resend API Key
Set up your Resend account and add the API key to your Supabase Edge Functions environment:
```bash
RESEND_API_KEY=your_resend_api_key_here
```

#### 2. Email Templates
Default templates are automatically created for each business. You can customize them in the `email_templates` table:

```sql
-- View current templates
SELECT * FROM email_templates WHERE business_id = 'your-business-id';

-- Update template content
UPDATE email_templates 
SET html_body = 'your custom HTML template'
WHERE business_id = 'your-business-id' AND template_key = 'new_lead_alert';
```

### Email Processing

Emails are processed automatically:
1. When a lead is submitted, emails are queued in the `email_queue` table
2. The system automatically triggers email processing
3. Failed emails are retried with exponential backoff (1min, 5min, 30min)
4. All email activity is logged in the `email_log` table

### Monitoring and Analytics

Track email performance through the database tables:

```sql
-- Check email queue status
SELECT status, COUNT(*) FROM email_queue GROUP BY status;

-- View recent email activity
SELECT * FROM email_log ORDER BY created_at DESC LIMIT 10;

-- Business email statistics
SELECT 
  b.name as business_name,
  COUNT(el.*) as emails_sent,
  COUNT(CASE WHEN el.status = 'sent' THEN 1 END) as successful_sends
FROM businesses b
LEFT JOIN email_log el ON b.id = el.business_id
WHERE el.created_at > NOW() - INTERVAL '30 days'
GROUP BY b.id, b.name;
```

### Example Configuration

Here's a complete widget configuration with email notifications:

```json
{
  "steps": [
    {
      "id": "service-selection",
      "title": "Select Your Service",
      "components": [
        {
          "type": "service_selection",
          "props": {
            "name": "service",
            "label": "What service do you need?",
            "options": ["fencing", "concrete", "landscaping"],
            "required": true
          }
        }
      ]
    }
  ],
  "showInstantQuote": true,
  "pricingCalculator": {
    "basePricing": {
      "service_field": "service",
      "pricing_type": "per_unit",
      "unit_field": "linearFeet",
      "unit_label": "linear foot",
      "base_prices": [
        {"service": "fencing", "price": 25.00}
      ]
    },
    "display": {
      "format": "fixed",
      "showCalculation": true
    }
  },
  "notifications": {
    "email": {
      "enabled": true,
      "business_emails": ["owner@example.com", "sales@example.com"],
      "send_customer_confirmation": true,
      "send_business_alert": true
    }
  }
}
```

### Best Practices

1. **Professional Email Addresses**: Use branded email addresses (not Gmail/Yahoo)
2. **Multiple Recipients**: Include key team members in business_emails array
3. **Timely Follow-up**: Monitor the email_queue table for any processing issues
4. **Custom Templates**: Personalize email templates to match your brand voice
5. **Testing**: Test with real email addresses before going live
6. **Monitoring**: Regularly check email logs for delivery issues