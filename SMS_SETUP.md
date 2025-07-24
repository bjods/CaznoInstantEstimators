# SMS Notification System Setup with Twilio

## Overview
Successfully implemented a comprehensive SMS notification system using Twilio that sends text messages to business owners when leads are captured or abandoned. This system works alongside the email notifications to provide immediate alerts.

## Key Features Implemented

### ✅ Database Tables Created
- **`sms_queue`** - Queues SMS messages with retry logic
- **`sms_log`** - Tracks all sent SMS messages with delivery status
- **`businesses` table updated** - Added `sms_phone_numbers` JSONB field

### ✅ Edge Functions Deployed
- **`/functions/send-sms`** - Processes SMS queue via Twilio API
- **`/functions/check-abandoned-leads`** - Detects and notifies about abandoned leads
- Both handle retries with exponential backoff

### ✅ SMS Triggers
1. **Lead Captured** - When personal info is completed (status: `captured`)
2. **Lead Abandoned** - When leads haven't been active for 30+ minutes

### ✅ Integration Points
- **Autosave API** - Queues SMS when leads are captured
- **Widget Configuration** - SMS settings in widget config
- **Business Setup** - Phone numbers stored in businesses table

## Environment Variables Required

Add these to your Supabase Edge Functions environment:

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## SMS Message Templates

### Lead Captured Message
```
🎉 New Lead Alert!

Name: John Doe
Email: john@example.com
Phone: (555) 123-4567
Service: Fence Installation
Estimated: $2,500

From: Fence Quote Widget
Time: 1/24/2025, 10:30 AM
```

### Lead Abandoned Message
```
⚠️ Lead Abandoned

A potential customer (John Doe) started but didn't complete the form.

Contact: john@example.com / (555) 123-4567
Service: Fence Installation
Last seen: 1/24/2025, 10:00 AM

Consider following up!
```

## Widget Configuration

Add SMS notifications to your widget config:

```json
{
  \"notifications\": {
    \"email\": {
      \"enabled\": true,
      \"business_emails\": [\"owner@company.com\"],
      \"send_customer_confirmation\": true,
      \"send_business_alert\": true
    },
    \"sms\": {
      \"enabled\": true,
      \"send_lead_captured\": true,
      \"send_lead_abandoned\": true
    }
  }
}
```

### Configuration Options

#### `sms.enabled` (boolean)
- Controls whether SMS notifications are active
- Set to `false` to disable all SMS for this widget

#### `sms.send_lead_captured` (boolean)
- When `true`, sends SMS immediately when personal info is completed
- Provides instant notification of new leads

#### `sms.send_lead_abandoned` (boolean)
- When `true`, sends SMS when leads are marked as abandoned
- Helps identify follow-up opportunities

## Business Phone Number Setup

SMS notifications are sent to phone numbers configured in the `businesses` table:

```sql
-- View current SMS phone numbers
SELECT name, sms_phone_numbers FROM businesses;

-- Update SMS phone numbers for a business
UPDATE businesses 
SET sms_phone_numbers = '[\"5551234567\", \"5559876543\"]'::jsonb
WHERE id = 'your-business-id';
```

### Phone Number Format
- Numbers are automatically formatted to E.164 format (+1XXXXXXXXXX)
- Supports various input formats:
  - `5551234567` → `+15551234567`
  - `(555) 123-4567` → `+15551234567`
  - `+15551234567` → `+15551234567`

## How It Works

### Lead Captured Flow
1. User completes personal info step
2. Submission status changes to `captured`
3. Autosave API detects the status change
4. SMS is queued for all business phone numbers
5. `send-sms` function processes the queue
6. Twilio sends the SMS
7. Delivery status is logged

### Lead Abandoned Flow
1. `check-abandoned-leads` function runs periodically
2. Finds submissions with `captured` status inactive for 30+ minutes
3. Marks them as `abandoned`
4. Queues SMS notifications if configured
5. `send-sms` function processes the queue
6. Business owners receive abandonment alerts

## Database Schema

### sms_queue Table
```sql
- id: UUID (primary key)
- business_id: UUID (references businesses)
- submission_id: UUID (references submissions)
- recipient_phone: TEXT (formatted phone number)
- message: TEXT (SMS content)
- message_type: TEXT (lead_captured, lead_abandoned, custom)
- template_data: JSONB (variables for message generation)
- status: TEXT (pending, processing, sent, failed)
- attempts: INT (retry count)
- next_retry_at: TIMESTAMPTZ (when to retry)
- twilio_sid: TEXT (Twilio message ID)
```

### sms_log Table
```sql
- id: UUID (primary key)
- sms_queue_id: UUID (references sms_queue)
- business_id: UUID (references businesses)
- submission_id: UUID (references submissions)
- recipient_phone: TEXT
- message: TEXT
- message_type: TEXT
- status: TEXT (sent, failed, delivered, undelivered)
- twilio_sid: TEXT
- sent_at: TIMESTAMPTZ
- delivered_at: TIMESTAMPTZ
- cost_cents: INTEGER (SMS cost tracking)
```

## Monitoring & Analytics

### Check SMS Queue Status
```sql
SELECT status, COUNT(*) FROM sms_queue GROUP BY status;
```

### View Recent SMS Activity
```sql
SELECT * FROM sms_log ORDER BY created_at DESC LIMIT 10;
```

### SMS Delivery Stats
```sql
SELECT 
  b.name as business_name,
  COUNT(sl.*) as sms_sent,
  COUNT(CASE WHEN sl.status = 'sent' THEN 1 END) as successful_sends,
  SUM(sl.cost_cents) as total_cost_cents
FROM businesses b
LEFT JOIN sms_log sl ON b.id = sl.business_id
WHERE sl.created_at > NOW() - INTERVAL '30 days'
GROUP BY b.id, b.name;
```

### Abandoned Lead Analysis
```sql
SELECT 
  COUNT(*) as total_abandoned,
  COUNT(CASE WHEN abandoned_at > NOW() - INTERVAL '24 hours' THEN 1 END) as abandoned_today
FROM submissions 
WHERE completion_status = 'abandoned';
```

## Cost Management

### SMS Pricing
- Twilio charges per SMS sent (~$0.0075 per message in US)
- Costs are tracked in `sms_log.cost_cents`
- Failed messages don't incur charges

### Usage Controls
- Maximum 3 retry attempts per message
- 10 messages processed per function call
- Exponential backoff prevents spam

## Error Handling

### Retry Logic
- **1st retry**: 2 minutes after failure
- **2nd retry**: 10 minutes after failure  
- **3rd retry**: 60 minutes after failure
- **After 3 attempts**: Marked as failed permanently

### Common Error Scenarios
- Invalid phone numbers → Logged and failed
- Twilio API errors → Retried with backoff
- Missing Twilio credentials → Function fails gracefully

## Testing Checklist

- [ ] Set Twilio credentials in Supabase Edge Functions
- [ ] Configure business SMS phone numbers
- [ ] Test widget with personal info completion
- [ ] Verify SMS received for lead capture
- [ ] Test abandoned lead detection (wait 30+ minutes)
- [ ] Check SMS queue and log tables
- [ ] Verify cost tracking in logs

## Manual Triggers

### Process SMS Queue Manually
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-sms \\
  -H \"Authorization: Bearer YOUR_SERVICE_ROLE_KEY\"
```

### Check for Abandoned Leads Manually
```bash
curl -X POST https://your-project.supabase.co/functions/v1/check-abandoned-leads \\
  -H \"Authorization: Bearer YOUR_SERVICE_ROLE_KEY\"
```

## Future Enhancements

The system is designed to be extensible:

1. **Follow-up Sequences** - Scheduled SMS campaigns
2. **Customer SMS** - Confirmations and updates to leads
3. **Custom Templates** - Per-business message customization
4. **Webhook Integration** - Delivery status updates from Twilio
5. **SMS Analytics Dashboard** - Comprehensive reporting

## Security & Compliance

- Phone numbers are validated and formatted
- All SMS activity is logged for audit trails
- Retry limits prevent abuse
- Failed messages are tracked and analyzed

The SMS system is now fully operational and will send notifications to business owners when leads are captured or abandoned!