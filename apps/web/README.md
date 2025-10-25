# Web Dashboard

Next.js-based web application for the AI-powered project.

## Overview

This is a Next.js application with a basic structure ready for implementing full dashboard functionality.

## What's Included

### ✅ Completed Setup
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- Basic component structure
- Layout and navigation components
- API client hooks and services
- App router with pages

### 📝 Component Structure

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard page
│   └── vendors/
│       └── page.tsx        # Vendors page
├── components/
│   ├── Header.tsx          # Header with navigation
│   ├── MetricsPanel.tsx    # Metrics display
│   ├── TicketList.tsx      # Tickets list view
│   ├── TicketCard.tsx      # Individual ticket card
│   ├── TicketDetail.tsx    # Ticket detail modal
│   ├── Timeline.tsx         # Timeline component
│   ├── VendorList.tsx      # Vendors list
│   └── VendorForm.tsx       # Vendor form (add/edit)
├── hooks/
│   ├── useTickets.ts       # Ticket data hooks
│   └── useVendors.ts       # Vendor data hooks
└── lib/
    └── api.ts              # API client
```

## What Needs to Be Done

### 1. Dashboard Layout ✅ INITIAL SETUP NEEDED
- [ ] Create sidebar navigation component
- [ ] Implement responsive grid layout
- [ ] Add loading states throughout
- [ ] Add error handling UI

### 2. Tickets List View ✅ INITIAL SETUP NEEDED
- [ ] Connect to API: `GET /tickets?recent=true`
- [ ] Add filtering by status
- [ ] Add sorting options
- [ ] Implement pagination
- [ ] Add search functionality
- [ ] Show emergency tickets highlighted

### 3. Ticket Detail View ✅ INITIAL SETUP NEEDED
- [ ] Connect to API: `GET /tickets/:id`
- [ ] Connect to API: `GET /tickets/:id/timeline`
- [ ] Display full ticket information
- [ ] Show appointment details if scheduled
- [ ] Add "Play Recording" button
- [ ] Show transcript if available

### 4. Vendor Management CRUD ✅ INITIAL SETUP NEEDED
- [ ] Connect to API: `GET /vendors`
- [ ] Connect to API: `POST /vendors`
- [ ] Connect to API: `PUT /vendors/:id`
- [ ] Connect to API: `DELETE /vendors/:id`
- [ ] Validate phone numbers
- [ ] Add success/error notifications

### 5. Metrics Panel ✅ INITIAL SETUP NEEDED
- [ ] Fetch real metrics from API
- [ ] Auto-refresh every 30s
- [ ] Add "Simulate Vendor YES" toggle
- [ ] Create charts/graphs (optional)

### 6. Demo Flow & Script ✅ INITIAL SETUP NEEDED
- [ ] Create 2-minute demo flow
- [ ] Prepare demo ticket data
- [ ] Write demo script
- [ ] Create slide deck outline
- [ ] Prepare backup video
- [ ] Add QR code for survey/pilot signups

### 7. UI Polish ✅ INITIAL SETUP NEEDED
- [ ] Add toast notifications
- [ ] Add hover states
- [ ] Mobile responsive design
- [ ] Add animations/transitions
- [ ] Improve color scheme

## Getting Started

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production
```bash
pnpm build
pnpm start
```

## API Endpoints

The web app expects the following API endpoints:

### Tickets
- `GET /tickets?recent=true` - Get recent tickets
- `GET /tickets/:id` - Get ticket details
- `GET /tickets/:id/timeline` - Get ticket timeline
- `POST /tickets` - Create ticket

### Vendors
- `GET /vendors` - List vendors
- `POST /vendors` - Create vendor
- `PUT /vendors/:id` - Update vendor
- `DELETE /vendors/:id` - Delete vendor

### Notifications
- `POST /notify` - Send notification

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Shared Types**: Workspace package (`@shared/types`)

## Demo Flow

The dashboard can be customized for your project's demo needs.

## Next Steps

1. Implement API integrations in hooks
2. Add error handling and loading states
3. Polish UI with Tailwind components
4. Test full demo flow
5. Prepare backup video
6. Create slide deck

See `TODO-ROLE-D.md` in the project root for complete details.
