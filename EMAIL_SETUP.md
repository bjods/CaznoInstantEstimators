# Email Notification System Setup

## Overview
I've successfully implemented a complete email notification system for your instant estimator platform using Resend. Here's what's been built:

## Database Tables Created

### 1. `email_queue`
- Queues all emails to be sent
- Supports retry logic with exponential backoff
- Tracks attempts and status

### 2. `email_templates` 
- Stores reusable email templates per business
- Supports variable substitution
- Two default templates created for all businesses:
  - `new_lead_alert` - Business notification when leads come in
  - `customer_confirmation` - Customer confirmation email

### 3. `email_log`
- Tracks all sent emails for analytics
- Stores Resend IDs for delivery tracking
- Records open/click events (when Resend webhooks are added)

## Edge Function Created

### `/functions/send-emails`
- Processes the email queue every time it's called
- Sends emails via Resend API
- Handles errors with exponential backoff (1min, 5min, 30min)
- Logs all activity
- Processes up to 10 emails per run

## Lead Processing Updated

### New API Endpoint: `/api/leads`
- Saves leads to database
- Checks widget configuration for email settings
- Queues appropriate emails based on configuration
- Automatically triggers email processing

### Widget Configuration Extended
Your widget configs now support email notifications:

```json
{
  "notifications": {
    "email": {
      "enabled": true,
      "business_emails": ["owner@company.com"],
      "send_customer_confirmation": true,
      "send_business_alert": true
    }
  }
}
```

## Environment Variables Required

Add these to your Supabase Edge Functions environment:

```bash
RESEND_API_KEY=your_resend_api_key_here
```

## Email Templates

### Business Alert Template
- **Subject**: "New Lead from {{service}} Widget - {{name}}"
- **Variables**: name, email, phone, address, service, price, measurements, additionalInfo, timestamp, widgetName
- **HTML & Text versions included**

### Customer Confirmation Template  
- **Subject**: "Thank you for your {{service}} quote request"
- **Variables**: name, service, price, address, measurements, businessPhone, businessEmail, timestamp
- **HTML & Text versions included**

## How It Works

1. **Lead Submission**: When a user submits a widget form, the lead is saved and emails are queued
2. **Email Queue**: Emails are added to the queue with all necessary data
3. **Processing**: The edge function processes pending emails and sends them via Resend
4. **Retry Logic**: Failed emails are retried with exponential backoff (max 3 attempts)
5. **Logging**: All email activity is logged for tracking and analytics

## Manual Processing

Since automatic cron jobs require additional setup, emails are currently triggered when leads are submitted. To process the queue manually, you can call:

```bash
curl -X POST https://your-project-ref.supabase.co/functions/v1/send-emails \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

## Testing

1. All existing widgets have been updated with default email configuration
2. Test by submitting a lead through any widget
3. Check the `email_queue` and `email_log` tables to verify processing

## Next Steps (Optional)

1. **Cron Job**: Set up a proper cron job to call `/functions/send-emails` every minute
2. **Webhooks**: Add Resend webhooks to track email opens/clicks
3. **Follow-up Sequences**: Add delayed emails for follow-up campaigns
4. **SMS Integration**: Extend the same pattern for SMS notifications
5. **Dashboard**: Build an email analytics dashboard

## Troubleshooting

- Check `email_queue` table for pending/failed emails
- Check `email_log` table for sent email history
- Edge function logs will show any processing errors
- Make sure RESEND_API_KEY is set in Supabase

The system is now ready to send emails when leads come in!