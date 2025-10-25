# Project Structure

```
maintenance-agent/
├── apps/
│   ├── api/                          # Backend API
│   │   ├── src/
│   │   │   ├── index.ts             # Entry point (skeleton)
│   │   │   ├── routes/              # TODO: API endpoints
│   │   │   ├── services/            # TODO: Business logic
│   │   │   └── lib/                 # TODO: Utilities
│   │   ├── prisma/
|   |   │   ├── schema.prisma                 # Database schema
|   |   │   └── seed.ts                       # Seed data
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .eslintrc.json
│   │
│   └── web/                          # Frontend Dashboard
│       ├── src/
│       │   ├── main.tsx              # Entry point
│       │   ├── App.tsx               # Router (skeleton)
│       │   ├── components/          # TODO: React components
│       │   ├── pages/                # TODO: Page components
│       │   ├── hooks/                # TODO: Custom hooks
│       │   └── services/            # TODO: API client
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── next.config.ts
│       └── .eslintrc.json
│
├── packages/
│   └── shared/                       # Shared Code
│       ├── src/
│       │   ├── index.ts              # Re-exports
│       │   ├── types.ts              # TypeScript types
│       │   └── schemas.ts            # Zod schemas
│       ├── package.json
│       └── tsconfig.json
│
│
├── Root Configuration
│   ├── package.json                  # Workspace config
│   ├── pnpm-workspace.yaml           # Workspace definition
│   ├── tsconfig.base.json            # Base TS config
│   ├── .gitignore
│   └── env.template                  # Environment template
│
└── Documentation
    ├── README.md                     # Main readme
    ├── SETUP.md                      # Setup guide
    ├── ARCHITECTURE.md               # System architecture
    ├── CONTRIBUTING.md               # Contribution guide
    ├── PROJECT_STRUCTURE.md          # This file
    ├── TODO-ROLE-A.md                # Voice/Agent tasks
    ├── TODO-ROLE-B.md                # Telephony tasks
    ├── TODO-ROLE-C.md                # Backend tasks
    └── TODO-ROLE-D.md                # Frontend tasks
```

## Next Steps by Role

### Role A (Voice/Agent)
Create in `apps/api/src/`:
- `services/agent.ts` - OpenAI integration
- `services/extraction.ts` - Entity extraction
- `routes/voice.ts` - Voice webhook handler
- `prompts/intake.ts` - Conversation script

### Role B (Telephony)
Create in `apps/api/src/`:
- `services/twilio.ts` - Twilio client
- `services/sms.ts` - SMS handling
- `services/calls.ts` - Call handling
- `routes/webhooks.ts` - Webhook handlers

### Role C (Backend)
Create in `apps/api/src/`:
- `routes/tickets.ts` - Ticket endpoints
- `routes/appointments.ts` - Appointment endpoints
- `routes/vendors.ts` - Vendor endpoints
- `services/booking.ts` - Booking logic
- `services/vendor-selection.ts` - Round-robin
- `lib/event-bus.ts` - Event system

### Role D (Frontend)
Create in `apps/web/src/`:
- `components/TicketList.tsx`
- `components/TicketDetail.tsx`
- `components/Timeline.tsx`
- `components/VendorList.tsx`
- `components/MetricsPanel.tsx`
- `pages/Dashboard.tsx`
- `hooks/useTickets.ts`
- `services/api.ts`

## File Naming Conventions

- Components: PascalCase (`TicketCard.tsx`)
- Services: camelCase (`agent.ts`)
- Routes: kebab-case (`tickets.ts`)
- Types: PascalCase (`Ticket`, `Vendor`)
- Events: dot notation (`intake.completed`)

## Import Paths

### From shared package
```typescript
import { Ticket, TicketSchema } from '@shared/types';
```

### Within same app
```typescript
import { bookingService } from '../services/booking';
```

### Cross-app (avoid when possible)
```typescript
// Don't do this - use shared package instead
import { Ticket } from '@maintenance-agent/api/dist/types';
```

