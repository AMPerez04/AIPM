# Role A: Voice/Agent Orchestrator

**Owner**: Team Member A  
**Backup**: Team Member D

## Mission
Make the AI sound competent, route correctly, and collect the right fields.

## Core Responsibilities

### 1. AI Agent & Prompt Engineering ✅ INITIAL SETUP NEEDED

- [ ] Set up OpenAI integration in `apps/api/src/services/agent.ts`
- [ ] Create intake prompt system
- [ ] Design conversational flow for collecting:
  - Tenant verification (address + last name)
  - Category classification
  - Severity detection
  - Time window preference
- [ ] Add emergency keyword detection:
  - `gas leak`, `gas smell` → emergency
  - `flooding`, `water damage` → emergency
  - `electrical smoke`, `sparks` → emergency
  - `no heat`, `freezing` (<40°F) → emergency
- [ ] Implement fallback for unclear responses
- [ ] Add escalation prompt for emergencies ("I'll connect you to your landlord immediately")

### 2. Entity Extraction ✅ INITIAL SETUP NEEDED

- [ ] Create extraction service in `apps/api/src/services/extraction.ts`
- [ ] Extract fields:
  - `category`: plumbing | electrical | hvac | lock
  - `severity`: emergency | routine
  - `window`: preferred time window
  - `unit`: property unit if available
- [ ] Parse from transcript using structured output
- [ ] Return JSON payload for POST /tickets
- [ ] Handle edge cases (uncertain category, unclear window)

### 3. Voice Flow & Scripts ✅ INITIAL SETUP NEEDED

- [ ] Create call script with greetings
- [ ] Implement TwiML response generation
- [ ] Handle voice intakes with Twilio Speech Recognition
- [ ] Add recording announcement ("This call may be recorded")
- [ ] Create tenant verification flow
- [ ] Build escalation path to landlord
- [ ] Save transcripts to database

### 4. Event Emission ✅ INITIAL SETUP NEEDED

- [ ] Emit `intake.completed` event after successful extraction
- [ ] Include full payload: `{tenantId, propertyId, category, severity, window, notes}`
- [ ] Store transcript with ticket
- [ ] Log emergency escalations

## Deliverables

- [ ] Working inbound call that yields complete Ticket payload
- [ ] Fallback & escalation paths functional
- [ ] ≥90% success rate extracting required fields
- [ ] Emergency keywords escalate correctly
- [ ] Sample recordings for demo

## Files to Create

```
apps/api/src/
├── services/
│   ├── agent.ts          # OpenAI agent integration
│   └── extraction.ts     # Entity extraction logic
├── routes/
│   └── voice.ts          # Twilio voice webhook handler
└── prompts/
    ├── intake.ts         # Intake conversation script
    └── emergency.ts      # Emergency escalation script
```

## Testing Checklist

- [ ] Test with clear, straightforward requests
- [ ] Test with emergency keywords
- [ ] Test with unclear/mumbling speech
- [ ] Test fallback menu for category selection
- [ ] Test escalation to landlord
- [ ] Verify transcript accuracy
- [ ] Record sample calls for demo

## APIs to Implement

### POST /voice/inbound
- Receives Twilio webhook
- Triggers AI agent conversation
- Returns TwiML for voice interaction

### POST /voice/transcript
- Receives finished transcript
- Extracts entities
- Creates ticket
- Emits intake.completed event

## Success Criteria

✅ Extract {category, severity, window} with ≥90% accuracy  
✅ Emergency phrases escalate within 30s  
✅ Graceful fallback for unclear requests  
✅ Professional-sounding call experience

