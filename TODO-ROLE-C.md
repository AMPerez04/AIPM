# Role C: Backend & Scheduling Engine

**Owner**: Team Member C  
**Backup**: Team Member B

## Mission
Tickets, vendor selection, booking loop, and state transitions.

## Core Responsibilities

### 1. Database & Setup ✅ SETUP COMPLETE

- [x] Prisma schema created
- [x] Seed script created
- [ ] Set up database connection
- [ ] Add indexes for performance

### 2. REST API Endpoints ✅ INITIAL SETUP NEEDED

- [ ] POST /tickets
  - Validate input with Zod schemas
  - Create ticket in DB
  - Set status to 'new'
  - Emit intake.completed event
  - Return ticket ID

- [ ] GET /tickets/:id
  - Fetch ticket with relations
  - Include tenant, property, appointments
  - Return full ticket payload

- [ ] GET /tickets?recent=true
  - Query recent tickets
  - Filter by status
  - Sort by createdAt DESC
  - Add pagination

- [ ] POST /appointments
  - Create appointment
  - Link to ticket and vendor
  - Set status to 'tentative'
  - Emit appointment.confirmed event
  - Update ticket status to 'scheduled'

- [ ] POST /vendors/:id/ping
  - Trigger vendor notification
  - Send SMS or call
  - Log ping attempt
  - Return ping status

- [ ] POST /notify
  - Generic notification endpoint
  - Support multiple channels
  - Log notification attempts

### 3. Event Bus ✅ INITIAL SETUP NEEDED

- [ ] Create event emitter service
- [ ] Handle events:
  - `intake.completed` → trigger vendor ping
  - `vendor.confirmed` → create appointment
  - `appointment.confirmed` → notify tenant & landlord
- [ ] Implement event persistence (audit log)
- [ ] Add event replay capability

### 4. Vendor Selection & Booking Loop ✅ INITIAL SETUP NEEDED

- [ ] Implement round-robin vendor selection
- [ ] Filter vendors by:
  - Category match
  - Availability window
  - Priority order
- [ ] Create booking worker:
  - Ping vendors in sequence
  - Wait for first "YES" response
  - Create tentative appointment
  - If all decline, escalate to landlord
- [ ] Add timeout handling (30s per vendor)
- [ ] Implement retry logic

### 5. SLA Timers & Escalation ✅ INITIAL SETUP NEEDED

- [ ] Track time-to-first-response
- [ ] Track time-to-book
- [ ] Escalate to landlord if:
  - No vendor available
  - All vendors decline
  - Emergency ticket idle > 5min
- [ ] Auto-escalate routine tickets after 2 hours
- [ ] Create escalation audit log entries

### 6. Audit Log ✅ INITIAL SETUP NEEDED

- [ ] Log all ticket state transitions
- [ ] Log vendor pings and responses
- [ ] Log appointment confirmations
- [ ] Log escalation events
- [ ] Create GET /tickets/:id/timeline endpoint
- [ ] Format timeline for UI display

### 7. Error Handling & Monitoring ✅ INITIAL SETUP NEEDED

- [ ] Global error handler middleware
- [ ] Request logging middleware
- [ ] Add health check metrics
- [ ] Track API response times
- [ ] Log slow queries
- [ ] Implement graceful shutdown

## Deliverables

- [ ] Ticket lifecycle working end-to-end
- [ ] Round-robin vendor selection functional
- [ ] First "YES" creates appointment
- [ ] Audit trail persisted
- [ ] Metrics tracked: TTFB, time-to-book
- [ ] Escalation to landlord working

## Files to Create

```
apps/api/src/
├── routes/
│   ├── tickets.ts        # Ticket CRUD endpoints
│   ├── appointments.ts   # Appointment endpoints
│   └── vendors.ts        # Vendor endpoints
├── services/
│   ├── booking.ts        # Booking worker logic
│   ├── vendor-selection.ts # Round-robin logic
│   └── escalation.ts     # Escalation rules
├── lib/
│   ├── event-bus.ts      # Event emitter
│   └── db.ts             # Database client
└── middleware/
    ├── error-handler.ts  # Error middleware
    └── logger.ts         # Request logging
```

## Testing Checklist

- [ ] Create ticket via POST /tickets
- [ ] Fetch ticket with GET /tickets/:id
- [ ] Verify intake.completed event emitted
- [ ] Test vendor round-robin selection
- [ ] Simulate vendor "YES" response
- [ ] Verify appointment created
- [ ] Test escalation to landlord
- [ ] Verify audit log entries
- [ ] Test error handling

## APIs to Implement

### POST /tickets
- Request: `{tenantId, propertyId, category, severity, window, notes}`
- Response: `{id}`

### GET /tickets/:id
- Response: Full ticket with relations

### GET /tickets/:id/timeline
- Response: Array of audit log entries

### POST /appointments
- Request: `{ticketId, vendorId, startsAt, confirmationMethod}`
- Response: `{id}`

### POST /vendors/:id/ping
- Response: `{status, sentAt}`

## Success Criteria

✅ First vendor to reply "YES" creates appointment  
✅ Notifications emitted correctly  
✅ Audit log persisted  
✅ Time-to-book < 15s in demo  
✅ Escalation working

