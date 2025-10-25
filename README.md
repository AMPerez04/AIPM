# AI Hackathon

AI-powered application for hackathon project.

## Architecture

This is a pnpm monorepo containing:

- **apps/api** - Express backend
- **apps/web** - React dashboard frontend
- **packages/shared** - Shared TypeScript types and Zod schemas
- **prisma** - Database schema (SQLite)

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp env.template .env
# Edit .env with your credentials (DATABASE_URL is already set)

# Initialize and seed the database
pnpm db:init
pnpm db:seed

# Start development servers
pnpm dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

## Team TODOs

See detailed task lists for each role:

- [Role A: Voice/Agent Orchestrator](./TODO-ROLE-A.md)
- [Role B: Telephony & Integrations](./TODO-ROLE-B.md)
- [Role C: Backend & Scheduling Engine](./TODO-ROLE-C.md)
- [Role D: Frontend & Demo Captain](./TODO-ROLE-D.md)

## 30-Hour Playbook

**T0–T2h**: Setup, contracts locked, sample data seeded  
**T2–T8h**: Core features - intake, webhooks, DB, dashboard skeleton  
**T8–T16h**: Severity rules, outbound calls, round-robin booking, UI polish  
**T16–T22h**: Full loop test, guardrails, demo prep  
**T22–T30h**: Rehearse, finalize, metrics panel

## Demo Metrics

- Time-to-book under 15s
- ≥90% entity extraction success
- Emergency escalation < 30s

## Shared Contracts

See `packages/shared/src/types.ts` for:
- Ticket, Vendor, Appointment models
- Event types (intake.completed, vendor.confirmed, appointment.confirmed)

## Scripts

- `pnpm dev` - Start both API and web in dev mode
- `pnpm build` - Build all packages
- `pnpm db:init` - Initialize SQLite database
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio (GUI)

## Tech Stack

- **Runtime**: Node.js + Express
- **Frontend**: React + Next
- **Database**: SQLite + Prisma
- **Type Safety**: TypeScript + Zod

