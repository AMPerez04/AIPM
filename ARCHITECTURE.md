# Architecture Overview

## System Flow

```
┌─────────────┐     Call In      ┌──────────────┐
│   Tenant    │ ────────────────> │   Twilio     │
└─────────────┘                    └──────────────┘
                                           │
                                           │ Webhook
                                           ▼
                                    ┌──────────────┐
                                    │   Voice      │
                                    │   Agent      │
                                    │  (Role A)    │
                                    └──────────────┘
                                           │
                                           │ Extract
                                           ▼
                                    ┌──────────────┐
                                    │   POST       │
                                    │  /tickets    │
                                    └──────────────┘
                                           │
                                           │ Event
                                           ▼
                                    ┌──────────────┐
                                    │  Scheduling  │
                                    │   Engine     │
                                    │  (Role C)    │
                                    └──────────────┘
                                           │
                                           │ Ping
                                           ▼
                                    ┌──────────────┐     SMS/Call     ┌─────────────┐
                                    │  Telephony   │ ───────────────> │   Vendor    │
                                    │   (Role B)   │                  └─────────────┘
                                    └──────────────┘
                                           ▲
                                           │ "YES"
                                           │
                                    ┌──────────────┐
                                    │   Dashboard  │
                                    │   (Role D)   │
                                    └──────────────┘
```

## Core Components

### 1. Voice Agent (Role A)
- Handles inbound calls
- Uses OpenAI for conversation
- Extracts entities (category, severity, window)
- Detects emergency keywords
- Emits `intake.completed` event

### 2. Telephony (Role B)
- Manages Twilio integration
- Handles webhooks (inbound/outbound)
- Sends SMS to vendors/tenants
- Stores recordings
- Secures webhook endpoints

### 3. Scheduling Engine (Role C)
- REST API endpoints
- Round-robin vendor selection
- Booking loop logic
- Event bus for async actions
- Audit logging
- Escalation to landlord

### 4. Dashboard (Role D)
- React frontend
- Real-time ticket views
- Timeline visualization
- Vendor CRUD
- Metrics display
- Demo preparation

## Data Models

### Ticket Lifecycle

```
new → vendor_contacting → scheduled → closed
  │                           │
  └──> (escalate) ────────────┘
```

### Booking Flow

1. Ticket created (`new`)
2. Vendor selected (round-robin)
3. Vendor pinged via SMS/call
4. Wait for "YES" response (30s timeout)
5. Create tentative appointment
6. Confirm with tenant
7. Move to `scheduled`
8. Notify landlord

## Event System

### Events Emitted

```typescript
intake.completed → triggers vendor ping
vendor.confirmed → creates appointment
appointment.confirmed → notifies tenant/landlord
```

### Event Bus

- In-memory for MVP
- Persisted to audit log
- Can replay events
- Eventually replace with Redis/RabbitMQ

## Key Decisions

### Database: SQLite
- Fast setup
- No external dependencies
- Easy to seed
- Can migrate to PostgreSQL later

### Monorepo: pnpm
- Fast installs
- Better workspace support
- Shared types package
- Single lockfile

### API: Express + TypeScript
- Mature ecosystem
- Easy Twilio integration
- Zod for validation
- Prisma for ORM

### Frontend: React + Next
- Fast development
- Modern tooling
- TypeScript support
- Easy deployment

## Security Considerations

### Webhook Security
- Validate Twilio signatures
- Rate limiting
- Idempotency keys
- Audit logs

### Data Protection
- Never log sensitive data
- Secure API keys
- Validate all inputs
- Sanitize outputs

## Scalability Path

### MVP (Current)
- SQLite
- In-memory events
- Single server
- Basic webhooks

### Phase 2
- PostgreSQL
- Redis for events
- Multiple workers
- Webhook for scalability

### Phase 3
- Separate API workers
- Queue system (Bull/BullMQ)
- Database replication
- Load balancer

## Testing Strategy

### Unit Tests
- Service functions
- Validation logic
- Event handlers

### Integration Tests
- API endpoints
- Database operations
- Webhook handling

### E2E Tests
- Full call flow
- Booking loop
- Dashboard interactions

## Monitoring

### Metrics to Track
- Time-to-first-response
- Time-to-book
- Vendor response rate
- Emergency escalation time
- API response times

### Logging
- Request logs
- Error logs
- Event logs
- Audit logs

## Deployment

### Development
- Local with ngrok
- SQLite database
- npm scripts

### Production
- Railway/Render/Heroku
- PostgreSQL
- Environment variables
- CI/CD pipeline

