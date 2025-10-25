# Role B: Telephony & Integrations

**Owner**: Team Member B  
**Backup**: Team Member A

## Mission
Phones ring in/out reliably; SMS works; webhooks are solid.

## Core Responsibilities

### 1. Twilio Setup ✅ INITIAL SETUP NEEDED

- [ ] Purchase Twilio phone number
- [ ] Configure webhook URLs (ngrok for dev)
- [ ] Set up Auth Token in `.env`
- [ ] Test inbound call webhook
- [ ] Test outbound call functionality
- [ ] Enable call recording
- [ ] Configure transcription settings

### 2. Inbound Voice Webhooks ✅ INITIAL SETUP NEEDED

- [ ] Create `/webhooks/call` endpoint
- [ ] Handle Twilio webhook signature validation
- [ ] Implement idempotency for duplicate webhooks
- [ ] Store call SID and metadata
- [ ] Start recording on call start
- [ ] Handle call status callbacks (completed, no-answer, busy)
- [ ] Store recordings securely

### 3. SMS Integration ✅ INITIAL SETUP NEEDED

- [ ] Create `/webhooks/sms` endpoint
- [ ] Handle incoming SMS webhooks
- [ ] Parse SMS replies (vendor confirmations)
- [ ] Send SMS via Twilio API
- [ ] Create SMS templates:
  - Vendor ping: "Job for {Property} at {Address}: {Category} issue. Available {Window}? Reply 'YES 3pm' to book."
  - Tenant confirm: "Confirmed: {Vendor} at {Time}. Reply YES to confirm or call to reschedule."
  - OTP for tenant link: "Your maintenance link: {url}"
- [ ] Add retry logic for failed SMS

### 4. Outbound Calling ✅ INITIAL SETUP NEEDED

- [ ] Create outbound call service
- [ ] Implement vendor dialing
- [ ] Handle call outcomes (answered, voicemail, busy)
- [ ] Use TwiML for automated vendor prompts
- [ ] Parse voice responses
- [ ] Trigger next vendor if no answer

### 5. Security & Reliability ✅ INITIAL SETUP NEEDED

- [ ] Validate webhook signatures
- [ ] Add retry logic with exponential backoff
- [ ] Implement webhook deduplication
- [ ] Rate limiting on webhook endpoints
- [ ] Log all webhook events
- [ ] Set up monitoring for failed calls/SMS

### 6. POST /notify Endpoint ✅ INITIAL SETUP NEEDED

- [ ] Accept recipient type (tenant/landlord/vendor)
- [ ] Accept method (SMS/call)
- [ ] Format message by type
- [ ] Send via Twilio
- [ ] Return delivery status
- [ ] Handle errors gracefully

## Deliverables

- [ ] Purchased Twilio number configured
- [ ] Stable webhooks (ngrok tunnel working)
- [ ] Call recordings stored and accessible
- [ ] SMS receipts sent to tenant after intake
- [ ] Vendor reply webhook parsed correctly
- [ ] OTP links sent to tenants

## Files to Create

```
apps/api/src/
├── services/
│   ├── twilio.ts         # Twilio client wrapper
│   ├── sms.ts            # SMS sending logic
│   └── calls.ts          # Call handling logic
├── routes/
│   └── webhooks.ts       # Webhook handlers
└── lib/
    └── validator.ts      # Webhook signature validation
```

## Testing Checklist

- [ ] Test inbound call webhook
- [ ] Test outbound call to vendor
- [ ] Test SMS send to tenant
- [ ] Test SMS receive from vendor
- [ ] Test call recording retrieval
- [ ] Test webhook retry on failure
- [ ] Test signature validation
- [ ] Test ngrok tunnel stability

## APIs to Implement

### POST /webhooks/call
- Receives Twilio call webhook
- Validates signature
- Stores call metadata
- Triggers voice flow

### POST /webhooks/sms
- Receives Twilio SMS webhook
- Validates signature
- Parses vendor replies ("YES 3pm")
- Triggers vendor.confirmed event

### POST /notify
- `{recipientId, type, method, message}`
- Sends SMS or initiates call
- Returns delivery status

## Success Criteria

✅ Inbound calls record & transcribe  
✅ SMS receipts delivered to tenant  
✅ Vendor reply webhook parsed  
✅ Webhook reliability ≥99%  
✅ Security validation working

