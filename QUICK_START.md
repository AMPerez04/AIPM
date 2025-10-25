# Quick Start Guide 

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Set Up Environment
```bash
# Copy template
cp env.template .env

# Edit .env with your credentials:
# - Twilio Account SID & Auth Token
# - OpenAI API Key
# - Other secrets
```

### Step 3: Database Setup
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm seed
```

### Step 4: Start Development
```bash
pnpm dev
```

This starts both:
- **API**: http://localhost:3001
- **Web**: http://localhost:3000

### Step 5: Pick Your Role & Build!

## Role Assignments

| Role | Person | Focus Area | TODO File |
|------|--------|-----------|-----------|
| A | [Name] | Voice/Agent | `TODO-ROLE-A.md` |
| B | [Name] | Telephony | `TODO-ROLE-B.md` |
| C | [Name] | Backend | `TODO-ROLE-C.md` |
| D | [Name] | Frontend | `TODO-ROLE-D.md` |

## First Task Per Role

### Role A (Voice/Agent)
```bash
git checkout -b role-a-voice-agent
# Create apps/api/src/services/agent.ts
# Set up OpenAI integration
```

### Role B (Telephony)
```bash
git checkout -b role-b-telephony
# Create apps/api/src/services/twilio.ts
# Set up webhook handlers
```

### Role C (Backend)
```bash
git checkout -b role-c-backend
# Create apps/api/src/routes/tickets.ts
# Implement POST /tickets endpoint
```

### Role D (Frontend)
```bash
git checkout -b role-d-frontend
# Create apps/web/src/components/TicketList.tsx
# Build tickets list view
```

## Common Commands

```bash
# Development
pnpm dev              # Start both API & web
pnpm --filter api dev # Start API only
pnpm --filter web dev # Start web only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio GUI
pnpm seed             # Seed database

# Building
pnpm build            # Build all packages
pnpm typecheck        # Type check all
pnpm lint             # Lint all
```

## File Structure Overview

```
📁 apps/
  📁 api/          # Backend (Express + TypeScript)
    📁 prisma/         # Database schema & migrations
  📁 web/          # Frontend (React + next)

📁 packages/
  📁 shared/       # Shared types & schemas



📄 README.md       # Main documentation
📄 SETUP.md        # Detailed setup
📄 QUICK_START.md  # This file!
```

## Key Files to Know

- `README.md` - Project overview
- `SETUP.md` - Detailed setup instructions
- `ARCHITECTURE.md` - System design
- `TODO-ROLE-[A-D].md` - Task lists per role
- `env.template` - Environment variables