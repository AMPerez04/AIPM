# AIPM Backend API

This is the backend API for the AI Property Management system, handling tickets, vendors, appointments, and notifications.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd apps/api
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp ../../env.template .env
   # Edit .env with your Twilio credentials
   ```

3. **Set up database:**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Start the server:**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3001`

## 📋 API Endpoints

### Health Checks
- `GET /health` - Basic health check
- `GET /health/db` - Database connectivity check

### Tickets
- `POST /tickets` - Create a new ticket
- `GET /tickets` - List all tickets (with optional filtering)
- `GET /tickets/:id` - Get ticket details with full timeline

### Vendors
- `GET /vendors` - List all vendors
- `POST /vendors` - Create a new vendor
- `POST /vendors/:id/ping` - Contact vendor for a ticket

### Tenants
- `GET /tenants` - List all tenants
- `POST /tenants` - Create a new tenant
- `GET /tenants/:id` - Get tenant details
- `POST /tenants-with-property` - Create tenant and property together
- `POST /tenants/bulk` - Create multiple tenants

### Properties
- `GET /properties` - List all properties
- `POST /properties` - Create a new property
- `GET /properties/:id` - Get property details

### Landlords
- `GET /landlords` - List all landlords
- `GET /landlords/:id` - Get landlord details

### Appointments
- `POST /appointments` - Create or update appointment

### Notifications
- `POST /notify` - Send SMS notification

### Webhooks
- `POST /webhooks/sms` - Handle incoming SMS messages

### Events & Metrics
- `GET /events` - View pending events
- `POST /events/process` - Process next event
- `GET /metrics` - System metrics and statistics

## 🧪 Testing

### Test the API
```bash
node api-tester.js
```

### Test Twilio SMS
```bash
node twilio-tester.js +1234567890 "Test message"
```

## 📊 Key Features

### Ticket Lifecycle Management
- **Create tickets** with category, severity, and time window
- **Automatic vendor selection** based on specialties and priority
- **SLA monitoring** with escalation for overdue tickets
- **Audit logging** for complete ticket history

### Vendor Management
- **Round-robin vendor selection** by priority
- **SMS notifications** to vendors with job details
- **Specialty matching** (plumbing, electrical, HVAC, locks)
- **Emergency vendor escalation** for urgent issues

### Appointment Scheduling
- **Tentative appointments** when vendors confirm
- **Automatic status updates** when appointments are confirmed
- **Confirmation tracking** via SMS or voice

### SLA & Escalation
- **Emergency tickets**: 15min response, 30min escalation
- **Routine tickets**: 2hr response, 4hr escalation
- **Automatic landlord notification** on escalation
- **Emergency vendor contact** for urgent issues

### Event-Driven Architecture
- **Event queue** for ticket lifecycle management
- **Asynchronous processing** of vendor confirmations
- **Real-time status updates** across the system

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL="file:./dev.db"

# Twilio (Required for SMS)
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_PHONE_NUMBER=""

# Server
PORT=3001
NODE_ENV=development
```

### Database Schema
- **Tickets**: Core maintenance requests
- **Vendors**: Service providers with specialties
- **Appointments**: Scheduled service visits
- **AuditLogs**: Complete action history
- **Properties & Tenants**: Property management data

## 📱 SMS Integration

### Vendor Messages
```
Job for 123 Main St (Unit 1A): plumbing issue - Kitchen sink dripping. 
Available tomorrow 9AM-12PM? Reply 'YES 3pm' to book.
```

### Emergency Messages
```
🚨 EMERGENCY JOB: electrical issue at 456 Oak Ave. 
Tenant: Bob Williams (+1234567892). Available now? 
Reply 'YES EMERGENCY' to accept.
```

### Tenant Confirmations
```
Confirmed: Acme Plumbing at 3:00 PM tomorrow. 
Reply YES to confirm or call to reschedule.
```

## 🚨 SLA Configuration

| Severity | Response Time | Escalation Time |
|----------|---------------|-----------------|
| Emergency | 15 minutes | 30 minutes |
| Routine | 2 hours | 4 hours |

## 📈 Metrics Available

- Total tickets by status
- Appointment confirmation rates
- Pending events count
- SLA compliance tracking

## 🔄 Event Types

1. **intake.completed** → Triggers vendor selection
2. **vendor.confirmed** → Creates appointment
3. **appointment.confirmed** → Notifies tenant & landlord

## 🛠️ Development

### Database Commands
```bash
pnpm db:generate    # Generate Prisma client
pnpm db:migrate      # Run database migrations
pnpm db:seed         # Seed with sample data
```

### Scripts
- `api-tester.js` - Comprehensive API testing
- `twilio-tester.js` - SMS testing utility
- `seed.ts` - Database seeding with sample data

## 🔍 Monitoring

The API includes comprehensive logging and monitoring:
- **Audit trails** for all ticket actions
- **SLA violation detection** with automatic escalation
- **Event queue monitoring** for system health
- **Metrics endpoints** for dashboard integration

## 🚀 Production Considerations

- Set up proper Twilio webhook URLs
- Configure database connection pooling
- Implement rate limiting for SMS endpoints
- Add authentication/authorization
- Set up monitoring and alerting
- Configure backup and disaster recovery
