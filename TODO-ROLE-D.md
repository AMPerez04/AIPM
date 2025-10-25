# Role D: Frontend & Demo Captain

**Owner**: Team Member D  
**Backup**: Team Member C

## Mission
Make it visible, credible, and pitch-ready.

## Core Responsibilities

### 1. Dashboard Layout ✅ INITIAL SETUP NEEDED

- [ ] Create main layout component
- [ ] Add navigation/routing
- [ ] Build header with branding
- [ ] Design responsive grid layout
- [ ] Add color scheme and typography
- [ ] Create sidebar navigation
- [ ] Add loading states

### 2. Tickets List View ✅ INITIAL SETUP NEEDED

- [ ] Fetch tickets via GET /tickets?recent=true
- [ ] Display ticket cards/table with:
  - ID, category, severity badge
  - Status indicator
  - Created timestamp
  - Tenant name
- [ ] Add filtering by status
- [ ] Add sorting options
- [ ] Implement pagination
- [ ] Add search functionality
- [ ] Show emergency tickets highlighted

### 3. Ticket Detail View ✅ INITIAL SETUP NEEDED

- [ ] Create ticket detail page
- [ ] Display full ticket information
- [ ] Show appointment details if scheduled
- [ ] Add timeline view (GET /tickets/:id/timeline)
- [ ] Display audit log entries chronologically
- [ ] Show vendor ping attempts
- [ ] Add "Play Recording" button
- [ ] Show transcript if available
- [ ] Add status badges and icons

### 4. Vendor Management CRUD ✅ INITIAL SETUP NEEDED

- [ ] List vendors (GET /vendors)
- [ ] Add vendor form (POST /vendors)
- [ ] Edit vendor form (PUT /vendors/:id)
- [ ] Delete vendor (DELETE /vendors/:id)
- [ ] Display vendor specialties
- [ ] Show vendor priority
- [ ] Add notes field
- [ ] Validate phone numbers

### 5. Metrics Panel ✅ INITIAL SETUP NEEDED

- [ ] Display time-to-book metric
- [ ] Show calls handled today
- [ ] Display open tickets count
- [ ] Show scheduled appointments
- [ ] Add "Simulate Vendor YES" toggle
- [ ] Create charts/graphs (optional)
- [ ] Auto-refresh every 30s

### 6. Demo Flow & Script ✅ INITIAL SETUP NEEDED

- [ ] Create 2-minute demo flow
- [ ] Prepare demo ticket data
- [ ] Write demo script
- [ ] Create slide deck outline
- [ ] Prepare backup video
- [ ] Add QR code for survey/pilot signups
- [ ] Test full demo flow

### 7. UI Polish ✅ INITIAL SETUP NEEDED

- [ ] Add Tailwind CSS or similar
- [ ] Create consistent button styles
- [ ] Add loading spinners
- [ ] Create error message components
- [ ] Add success notifications
- [ ] Implement toast notifications
- [ ] Add hover states
- [ ] Mobile responsive design

## Deliverables

- [ ] Single-page dashboard functional
- [ ] Tickets list and detail views working
- [ ] Vendor CRUD operational
- [ ] 2-minute demo flow ready
- [ ] Fallback video recorded
- [ ] Slide deck prepared
- [ ] One-pager created
- [ ] QR code for signups

## Files to Create

```
apps/web/src/
├── components/
│   ├── Layout.tsx           # Main layout
│   ├── TicketList.tsx       # Tickets list
│   ├── TicketDetail.tsx     # Ticket detail
│   ├── TicketCard.tsx       # Ticket card component
│   ├── Timeline.tsx         # Timeline component
│   ├── VendorList.tsx       # Vendor list
│   ├── VendorForm.tsx       # Vendor form
│   ├── MetricsPanel.tsx     # Metrics display
│   └── Header.tsx           # Header component
├── pages/
│   ├── Dashboard.tsx        # Main dashboard
│   ├── Tickets.tsx          # Tickets page
│   └── Vendors.tsx          # Vendors page
├── hooks/
│   ├── useTickets.ts        # Ticket data hook
│   └── useVendors.ts        # Vendor data hook
├── services/
│   └── api.ts               # API client
└── App.tsx                  # Router setup
```

## Testing Checklist

- [ ] Dashboard loads tickets
- [ ] Click ticket opens detail view
- [ ] Timeline displays correctly
- [ ] Vendor CRUD works
- [ ] Metrics update in real-time
- [ ] Demo flow works end-to-end
- [ ] Mobile responsive
- [ ] Error handling works
- [ ] Recording playback works (if implemented)

## Demo Script (2 minutes)

1. **Opening (30s)**
   - "Meet Maintenance Agent - AI-powered after-hours maintenance"
   - "Tenants call, AI handles intake, books vendors automatically"

2. **Live Demo (60s)**
   - Show ticket in "new" status
   - Trigger vendor ping
   - Show "YES" response
   - Show appointment created
   - Show timeline with all events
   - Highlight time-to-book metric

3. **Close (30s)**
   - "Phones-first, actually books vendors"
   - "Priced for 1-50 doors"
   - Scan QR to sign up for pilot

## Slides Outline

1. Title slide
2. Problem statement
3. Solution overview
4. Demo screenshot/video
5. Tech stack
6. Go-to-market
7. Team intro
8. Q&A

## Success Criteria

✅ Tickets show real-time timeline  
✅ One-click access to recordings  
✅ Slide deck ready  
✅ 2-minute script polished  
✅ Backup video recorded  
✅ QR code working

