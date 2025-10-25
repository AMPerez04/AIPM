# Setup Guide

## Initial Setup (T0-T2h)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Twilio (get from Twilio Console)
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+15551234567"
TWILIO_WEBHOOK_URL="https://your-ngrok-url.ngrok.io"

# OpenAI (for agent)
OPENAI_API_KEY="your_openai_key"

# Server
PORT=3001
NODE_ENV=development

# Frontend
NEXT_API_URL=http://localhost:3001

# Security
WEBHOOK_SECRET="random_secret_string"
JWT_SECRET="random_jwt_secret"

# Demo Mode
DEMO_MODE=false
SIMULATE_VENDOR_REPLY=false
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm seed
```

### 4. Start Development Servers

```bash
# Start both API and web
pnpm dev

# Or start individually:
pnpm --filter api dev
pnpm --filter web dev
```

### 5. Verify Setup

- Visit http://localhost:3000 (web)
- Visit http://localhost:3001/health (api)

## Twilio Setup (Role B)

1. Create Twilio account
2. Purchase phone number
3. Configure webhook URL (use ngrok for local dev)
4. Update `.env` with credentials

## ngrok Setup (for Local Webhooks)

```bash
# Install ngrok
# Download from https://ngrok.com/download

# Start ngrok tunnel
ngrok http 3001

# Copy forwarding URL (e.g., https://abc123.ngrok.io)
# Update TWILIO_WEBHOOK_URL in .env
```

## Development Workflow

### Branch Strategy

```bash
# Create branch per role
git checkout -b role-a-voice-agent
git checkout -b role-b-telephony
git checkout -b role-c-backend
git checkout -b role-d-frontend

# After completing tasks:
git add .
git commit -m "feat: [Role X] implement feature Y"
git push origin role-x-feature
# Create PR to main
```

### Testing

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Build
pnpm build
```

## Database Commands

```bash
# Database operations
# Note: Database tasks will be configured based on your chosen setup
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001
# Kill process
taskkill /PID <PID> /F
```

### Database Issues
```bash
# Reset database
# Configure based on your database setup
```

### Module Resolution Errors
```bash
# Clean install
rm -rf node_modules
pnpm install
```

## Project Structure

```
.
├── apps/
│   ├── api/              # Backend API
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── services/ # Business logic
│   │   │   └── lib/      # Utilities
│   │   └── prisma/       # Seed script
│   └── web/              # Frontend dashboard
│       └── src/
│           ├── components/
│           ├── pages/
│           └── hooks/
├── packages/
│   └── shared/           # Shared types & schemas
│       └── src/
│           ├── types.ts
│           └── schemas.ts
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
└── README.md
```

## Next Steps

1. Review your role's TODO file (TODO-ROLE-[A-D].md)
2. Pick your first task
3. Create a feature branch
4. Start coding!

Good luck! 🚀

