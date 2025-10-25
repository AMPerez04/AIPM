import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import twilio from 'twilio';
import {
  TicketSchema,
  VendorSchema,
  AppointmentSchema,
  TicketCategorySchema,
  TicketSeveritySchema,
  TicketStatusSchema,
  AppointmentStatusSchema,
  ConfirmationMethodSchema,
  IntakeCompletedEventSchema,
  VendorConfirmedEventSchema,
  AppointmentConfirmedEventSchema,
} from './schemas.js';
import {
  type Ticket, type Vendor, type Appointment, type Event,
  type IntakeCompletedEvent, type VendorConfirmedEvent, type AppointmentConfirmedEvent,
  type TicketCategory, type TicketSeverity
} from './types.js';

import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import crypto from 'crypto';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Event queue for ticket lifecycle events
const eventQueue: Event[] = [];

// SLA Configuration
const SLA_CONFIG = {
  emergency: {
    responseTime: 15 * 60 * 1000, // 15 minutes
    escalationTime: 30 * 60 * 1000, // 30 minutes
  },
  routine: {
    responseTime: 2 * 60 * 60 * 1000, // 2 hours
    escalationTime: 4 * 60 * 60 * 1000, // 4 hours
  },
};

// Helper function to emit events
function emitEvent(event: Event) {
  eventQueue.push(event);
  console.log(`📡 Event emitted: ${event.type}`, event.payload);
}

// Helper function to log audit trail
async function logAudit(ticketId: string, action: string, details?: any) {
  try {
    await prisma.auditLog.create({
      data: {
        ticketId,
        action,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
}

// Helper function to check SLA violations
async function checkSLAViolations() {
  try {
    const now = new Date();
    
    // Check for tickets that need escalation
    const ticketsNeedingEscalation = await prisma.ticket.findMany({
      where: {
        status: { in: ['new', 'vendor_contacting'] },
        createdAt: {
          lte: new Date(now.getTime() - SLA_CONFIG.routine.escalationTime),
        },
      },
      include: {
        tenant: true,
        property: {
          include: {
            landlord: true,
          },
        },
      },
    });

    for (const ticket of ticketsNeedingEscalation) {
      const timeSinceCreation = now.getTime() - ticket.createdAt.getTime();
      const escalationThreshold = ticket.severity === 'emergency' 
        ? SLA_CONFIG.emergency.escalationTime 
        : SLA_CONFIG.routine.escalationTime;

      if (timeSinceCreation >= escalationThreshold) {
        await escalateTicket(ticket);
      }
    }
  } catch (error) {
    console.error('Error checking SLA violations:', error);
  }
}

// Helper function to escalate ticket
async function escalateTicket(ticket: any) {
  try {
    console.log(`🚨 Escalating ticket ${ticket.id} (${ticket.severity})`);
    
    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { 
        status: 'vendor_contacting',
        notes: (ticket.notes || '') + `\n[ESCALATED] Ticket escalated due to SLA violation at ${new Date().toISOString()}`,
      },
    });

    // Log escalation
    await logAudit(ticket.id, 'ticket_escalated', {
      reason: 'SLA violation',
      severity: ticket.severity,
      escalatedAt: new Date().toISOString(),
    });

    // Notify landlord
    if (ticket.property.landlord) {
      const landlordMessage = `🚨 URGENT: Maintenance ticket #${ticket.id} for ${ticket.property.address} has been escalated. Issue: ${ticket.description}. Please contact tenant ${ticket.tenant.firstName} ${ticket.tenant.lastName} at ${ticket.tenant.phone}.`;
      
      try {
        await twilioClient.messages.create({
          body: landlordMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: ticket.property.landlord.phone,
        });
        
        await logAudit(ticket.id, 'landlord_notified', {
          landlordId: ticket.property.landlord.id,
          method: 'sms',
        });
      } catch (smsError) {
        console.error('Failed to notify landlord:', smsError);
      }
    }

    // Try to contact emergency vendors if it's an emergency
    if (ticket.severity === 'emergency') {
      await contactEmergencyVendors(ticket);
    }
  } catch (error) {
    console.error('Error escalating ticket:', error);
  }
}

// Helper function to contact emergency vendors
async function contactEmergencyVendors(ticket: any) {
  try {
    const emergencyVendors = await prisma.vendor.findMany({
      where: {
        specialties: {
          contains: ticket.category,
        },
        priority: { lte: 2 }, // High priority vendors
      },
      orderBy: { priority: 'asc' },
    });

    for (const vendor of emergencyVendors.slice(0, 3)) { // Contact top 3 emergency vendors
      const vendorPhones = JSON.parse(vendor.phones);
      if (vendorPhones.length > 0) {
        const emergencyMessage = `🚨 EMERGENCY JOB: ${ticket.category} issue at ${ticket.property.address}. Tenant: ${ticket.tenant.firstName} ${ticket.tenant.lastName} (${ticket.tenant.phone}). Available now? Reply 'YES EMERGENCY' to accept.`;
        
        try {
          await twilioClient.messages.create({
            body: emergencyMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: vendorPhones[0],
          });
          
          await logAudit(ticket.id, 'emergency_vendor_contacted', {
            vendorId: vendor.id,
            vendorName: vendor.name,
            method: 'sms',
          });
        } catch (smsError) {
          console.error(`Failed to contact emergency vendor ${vendor.name}:`, smsError);
        }
      }
    }
  } catch (error) {
    console.error('Error contacting emergency vendors:', error);
  }
}

// Helper function to process vendor selection and pinging
async function processVendorSelection(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        tenant: true,
        property: true,
      },
    });

    if (!ticket) {
      console.error(`Ticket ${ticketId} not found for vendor selection`);
      return;
    }

    // Find vendors that handle this category
    const vendors = await prisma.vendor.findMany({
      where: {
        specialties: {
          contains: ticket.category,
        },
      },
      orderBy: { priority: 'asc' },
    });

    if (vendors.length === 0) {
      console.error(`No vendors found for category: ${ticket.category}`);
      await logAudit(ticketId, 'no_vendors_found', { category: ticket.category });
      return;
    }

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'vendor_contacting' },
    });

    // Contact vendors in priority order
    for (const vendor of vendors.slice(0, 3)) { // Contact top 3 vendors
      const vendorPhones = JSON.parse(vendor.phones);
      if (vendorPhones.length > 0) {
        const message = `Job for ${ticket.property.address} (Unit ${ticket.property.unit || 'N/A'}): ${ticket.category} issue - ${ticket.description}. Available ${ticket.window}? Reply 'YES 3pm' to book.`;
        
        try {
          await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: vendorPhones[0],
          });
          
          await logAudit(ticketId, 'vendor_contacted', {
            vendorId: vendor.id,
            vendorName: vendor.name,
            method: 'sms',
          });
        } catch (smsError) {
          console.error(`Failed to contact vendor ${vendor.name}:`, smsError);
        }
      }
    }
  } catch (error) {
    console.error('Error processing vendor selection:', error);
  }
}

// Run SLA checks every 5 minutes
setInterval(checkSLAViolations, 5 * 60 * 1000);

server.on('upgrade', (req, socket, head) => {
  if (req.url?.startsWith('/ws/twilio-media')) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// Helper: quick base64 ↔ Buffer
const b64ToBuf = (b64: string) => Buffer.from(b64, 'base64');
const bufToB64 = (buf: Buffer) => buf.toString('base64');

// (Optional) Very basic mulaw↔pcm converters (good enough for demo).
// For better quality, use a lib like `mulaw` or `@discordjs/voice`.
function ulawToPcm16(mu: number) {
  // μ-law decode (8-bit -> 16-bit PCM) — compact impl for demo
  mu = ~mu & 0xff;
  let sign = mu & 0x80;
  let exponent = (mu & 0x70) >> 4;
  let mantissa = mu & 0x0f;
  let magnitude = ((mantissa << 4) + 8) << (exponent + 3);
  let sample = sign ? (132 - magnitude) : (magnitude - 132);
  return sample; // 16-bit signed int
}
function pcm16ToUlaw(sample: number) {
  // clip
  const BIAS = 0x84;
  const CLIP = 32635;
  sample = Math.max(-CLIP, Math.min(CLIP, sample));
  let sign = (sample < 0) ? 0x80 : 0x00;
  if (sample < 0) sample = -sample;
  sample += BIAS;
  let exponent = 7;
  for (let expMask = 0x4000; (sample & expMask) === 0 && exponent > 0; expMask >>= 1) exponent--;
  let mantissa = (sample >> (exponent + 3)) & 0x0f;
  let ulawByte = ~(sign | (exponent << 4) | mantissa) & 0xff;
  return ulawByte;
}
function decodeUlawChunk(b64: string): Int16Array {
  const bytes = b64ToBuf(b64);
  const out = new Int16Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = ulawToPcm16(bytes[i]);
  return out;
}
function encodeUlawChunk(pcm16: Int16Array): Buffer {
  const out = Buffer.alloc(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    out[i] = pcm16ToUlaw(pcm16[i]);
  }
  return out;
}

// OpenAI Realtime WS URL (server-to-server)
const OPENAI_REALTIME_URL = 'wss://api.openai.com/v1/realtime?model=gpt-realtime'; // or latest realtime model

wss.on('connection', async (twilioWs: WebSocket) => {
  const sessionId = crypto.randomUUID();
  console.log('📞 Twilio WS connected', sessionId);

  // Create upstream WS to OpenAI Realtime
  const oaWs = new WebSocket(OPENAI_REALTIME_URL, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'OpenAI-Beta': 'realtime=v1',
    },
  });

  // When OpenAI is ready, send session config + your instructions
  let oaWsReady = false;
  
  oaWs.on('open', () => {
    oaWsReady = true;
    console.log('OpenAI Realtime API connected');
    
    // 1) Set session properties (voice + input encoding)
    oaWs.send(JSON.stringify({
      type: 'session.update',
      session: {
        // Tell OpenAI what we're sending (Twilio default: 8kHz G.711 μ-law)
        input_audio_format: { type: 'g711_ulaw', sample_rate: 8000 },
        output_audio_format: { type: 'g711_ulaw', sample_rate: 8000 }, // so we can send back to Twilio with no resample
        voice: 'verse', // pick any supported voice
      },
    }));

    // 2) Provide your system instructions (your prompt)
    oaWs.send(JSON.stringify({
      type: 'response.create',
      response: {
        instructions: `You are RelayPM, a 24/7 voice property maintenance agent for landlords.

Your job is to:
1. Answer tenant calls for maintenance requests
2. Collect details about the maintenance issue
3. Decide severity (emergency vs routine) based on:
   - Emergency: Floods, fires, gas leaks, no heat in freezing weather, broken locks, etc.
   - Routine: Plumbing clogs, broken appliances, HVAC issues (non-emergency), etc.
4. Book an approved vendor for the requested time window
5. Confirm appointment details with the tenant
6. Notify the landlord via SMS

Be professional, empathetic, and efficient. Confirm all details clearly before ending the call.

For emergency issues, emphasize the urgency and dispatch vendors immediately.`,
        modalities: ['audio'],
        conversation: 'none' // start fresh
      },
    }));
  });

  // Pipe Twilio -> OpenAI (caller audio)
  twilioWs.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.event === 'start') {
        console.log('Twilio stream started', msg.streamSid);
      }
      if (msg.event === 'media' && msg.media?.payload) {
        // msg.media.payload = base64 μ-law 8k
        // Send to OpenAI as an audio append
        oaWs.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: msg.media.payload,           // base64 μ-law (matches session input_audio_format)
        }));
      }
      if (msg.event === 'stop') {
        // flush any remaining audio to OpenAI to prompt a response
        oaWs.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
        oaWs.send(JSON.stringify({
          type: 'response.create',
          response: { modalities: ['audio'] }
        }));
      }
    } catch (e) {
      console.error('Twilio WS parse error', e);
    }
  });

  // Pipe OpenAI -> Twilio (agent speech)
  oaWs.on('message', (data) => {
    try {
      const evt = JSON.parse(data.toString());

      // OpenAI audio arrives in chunks; the event key may be:
      // - response.output_audio.delta (streaming)
      // - response.completed (finished)
      if (evt.type === 'response.output_audio.delta' && evt.delta) {
        // evt.delta is base64 in the output audio format we requested (μ-law 8k)
        // Send to Twilio as an outbound media frame:
        const frame = {
          event: 'media',
          media: {
            payload: evt.delta // base64 μ-law 8k — no re-encode needed
          }
        };
        twilioWs.send(JSON.stringify(frame));
      }
    } catch (e) {
      console.error('OpenAI WS parse error', e);
    }
  });

  // Clean up
  const shutdown = () => {
    try { oaWs.close(); } catch {}
    try { twilioWs.close(); } catch {}
    console.log('🔌 WS closed', sessionId);
  };
  twilioWs.on('close', shutdown);
  oaWs.on('close', shutdown);
  oaWs.on('error', (e) => console.error('OpenAI WS error', e));
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

// ============================================================================
// TICKET ENDPOINTS
// ============================================================================

// POST /tickets - Create a new ticket
app.post('/tickets', async (req, res) => {
  try {
    const createTicketSchema = z.object({
      tenantId: z.string(),
      propertyId: z.string(),
      category: TicketCategorySchema,
      severity: TicketSeveritySchema,
      description: z.string(),
      window: z.string(),
      notes: z.string().optional(),
    });

    const data = createTicketSchema.parse(req.body);

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        status: 'new',
      },
      include: {
        tenant: true,
        property: true,
      },
    });

    // Log audit
    await logAudit(ticket.id, 'ticket_created', { 
      category: ticket.category, 
      severity: ticket.severity 
    });

    // Emit intake completed event
    const intakeEvent: IntakeCompletedEvent = {
      type: 'intake.completed',
      payload: {
        tenantId: ticket.tenantId,
        propertyId: ticket.propertyId,
        category: ticket.category as TicketCategory,
        severity: ticket.severity as TicketSeverity,
        window: ticket.window,
        notes: ticket.notes ?? undefined,
      },
    };
    emitEvent(intakeEvent);

    res.status(201).json({
      id: ticket.id,
      message: 'Ticket created successfully',
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create ticket' });
    }
  }
});

// GET /tickets/:id - Get ticket details
app.get('/tickets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        tenant: true,
        property: {
          include: {
            landlord: true,
          },
        },
        appointments: {
          include: {
            vendor: true,
          },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// GET /tickets - List tickets (with optional filtering)
app.get('/tickets', async (req, res) => {
  try {
    const { recent, status, category } = req.query;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }

    if (recent === 'true') {
      // Get tickets from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      where.createdAt = { gte: yesterday };
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        tenant: true,
        property: true,
        appointments: {
          include: {
            vendor: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// ============================================================================
// VENDOR ENDPOINTS
// ============================================================================

// GET /vendors - List all vendors
app.get('/vendors', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { priority: 'asc' },
    });

    // Parse JSON fields
    const parsedVendors = vendors.map(vendor => ({
      ...vendor,
      phones: JSON.parse(vendor.phones),
      specialties: JSON.parse(vendor.specialties),
    }));

    res.json(parsedVendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// POST /vendors - Create a new vendor
app.post('/vendors', async (req, res) => {
  try {
    const createVendorSchema = z.object({
      name: z.string(),
      phones: z.array(z.string()),
      specialties: z.array(TicketCategorySchema),
      hours: z.string(),
      priority: z.number().default(0),
      notes: z.string().optional(),
    });

    const data = createVendorSchema.parse(req.body);

    const vendor = await prisma.vendor.create({
      data: {
        ...data,
        phones: JSON.stringify(data.phones),
        specialties: JSON.stringify(data.specialties),
      },
    });

    res.status(201).json({
      id: vendor.id,
      message: 'Vendor created successfully',
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create vendor' });
    }
  }
});

// POST /vendors/:id/ping - Contact vendor for a ticket
app.post('/vendors/:id/ping', async (req, res) => {
  try {
    const { id: vendorId } = req.params;
    const { ticketId, method = 'sms' } = req.body;

    // Get vendor and ticket details
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        tenant: true,
        property: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Parse vendor data
    const vendorPhones = JSON.parse(vendor.phones);
    const vendorSpecialties = JSON.parse(vendor.specialties);

    // Check if vendor handles this category
    if (!vendorSpecialties.includes(ticket.category)) {
      return res.status(400).json({ 
        error: 'Vendor does not handle this category',
        vendorSpecialties,
        ticketCategory: ticket.category,
      });
    }

    // Create message content
    const message = `Job for ${ticket.property.address} (Unit ${ticket.property.unit || 'N/A'}): ${ticket.category} issue - ${ticket.description}. Available ${ticket.window}? Reply 'YES 3pm' to book.`;

    // Send SMS to vendor
    if (method === 'sms' && vendorPhones.length > 0) {
      try {
        const smsResponse = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: vendorPhones[0], // Use first phone number
        });

        // Log audit
        await logAudit(ticketId, 'vendor_pinged', {
          vendorId,
          method: 'sms',
          messageSid: smsResponse.sid,
        });

        res.json({
          success: true,
          message: 'Vendor pinged successfully',
          smsSid: smsResponse.sid,
        });
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        res.status(500).json({ error: 'Failed to send SMS to vendor' });
      }
    } else {
      res.status(400).json({ error: 'Invalid method or no phone numbers available' });
    }
  } catch (error) {
    console.error('Error pinging vendor:', error);
    res.status(500).json({ error: 'Failed to ping vendor' });
  }
});

// ============================================================================
// APPOINTMENT ENDPOINTS
// ============================================================================

// POST /appointments - Create or update appointment
app.post('/appointments', async (req, res) => {
  try {
    const createAppointmentSchema = z.object({
      ticketId: z.string(),
      vendorId: z.string(),
      startsAt: z.string().transform(str => new Date(str)),
      status: AppointmentStatusSchema.default('tentative'),
      confirmationMethod: ConfirmationMethodSchema.default('sms'),
    });

    const data = createAppointmentSchema.parse(req.body);

    // Check if ticket exists and is in correct state
    const ticket = await prisma.ticket.findUnique({
      where: { id: data.ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status === 'closed') {
      return res.status(400).json({ error: 'Cannot create appointment for closed ticket' });
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data,
      include: {
        ticket: true,
        vendor: true,
      },
    });

    // Update ticket status
    await prisma.ticket.update({
      where: { id: data.ticketId },
      data: { status: 'scheduled' },
    });

    // Log audit
    await logAudit(data.ticketId, 'appointment_created', {
      appointmentId: appointment.id,
      vendorId: data.vendorId,
      startsAt: data.startsAt,
    });

    // Emit vendor confirmed event
    const vendorEvent: VendorConfirmedEvent = {
      type: 'vendor.confirmed',
      payload: {
        ticketId: data.ticketId,
        vendorId: data.vendorId,
        appointmentId: appointment.id,
      },
    };
    emitEvent(vendorEvent);

    res.status(201).json({
      id: appointment.id,
      message: 'Appointment created successfully',
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }
});

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

// POST /notify - Send notification (SMS)
app.post('/notify', async (req, res) => {
  try {
    const notifySchema = z.object({
      to: z.string(),
      message: z.string(),
      type: z.enum(['tenant', 'landlord', 'vendor']).optional(),
    });

    const { to, message, type } = notifySchema.parse(req.body);

    // Send SMS
    const smsResponse = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    res.json({
      success: true,
      message: 'Notification sent successfully',
      smsSid: smsResponse.sid,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// ============================================================================
// WEBHOOK ENDPOINTS
// ============================================================================

// POST /webhooks/sms - Handle incoming SMS
app.post('/webhooks/sms', async (req, res) => {
  try {
    const { From, Body, MessageSid } = req.body;

    console.log(`📱 SMS received from ${From}: ${Body}`);

    // Parse vendor confirmation (e.g., "YES 3pm")
    const yesMatch = Body.match(/YES\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
    
    if (yesMatch) {
      const timeStr = yesMatch[1];
      console.log(`✅ Vendor confirmed for time: ${timeStr}`);
      
      // TODO: Find pending ticket for this vendor and create appointment
      // This would require tracking which vendor was pinged for which ticket
      
      res.json({ message: 'Confirmation received' });
    } else {
      console.log('❓ Unknown SMS format');
      res.json({ message: 'SMS received but not recognized' });
    }
  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
});

// ============================================================================
// EVENT QUEUE ENDPOINTS
// ============================================================================

// GET /events - Get pending events (for debugging)
app.get('/events', (req, res) => {
  res.json({
    events: eventQueue,
    count: eventQueue.length,
  });
});

// POST /events/process - Process next event (for testing)
app.post('/events/process', async (req, res) => {
  if (eventQueue.length === 0) {
    return res.json({ message: 'No events to process' });
  }

  const event = eventQueue.shift()!;
  
  try {
    switch (event.type) {
      case 'intake.completed':
        console.log('🔄 Processing intake.completed event');
        await processVendorSelection(event.payload.tenantId); // Use tenantId to find ticket
        break;
        
      case 'vendor.confirmed':
        console.log('🔄 Processing vendor.confirmed event');
        // TODO: Implement tenant notification logic
        break;
        
      case 'appointment.confirmed':
        console.log('🔄 Processing appointment.confirmed event');
        // TODO: Implement final confirmation logic
        break;
    }
    
    res.json({ 
      message: 'Event processed successfully',
      processedEvent: event,
    });
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).json({ error: 'Failed to process event' });
  }
});

// ============================================================================
// METRICS ENDPOINTS
// ============================================================================

// GET /metrics - Get system metrics
app.get('/metrics', async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      scheduledTickets,
      closedTickets,
      totalAppointments,
      confirmedAppointments,
    ] = await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.count({ where: { status: { in: ['new', 'vendor_contacting'] } } }),
      prisma.ticket.count({ where: { status: 'scheduled' } }),
      prisma.ticket.count({ where: { status: 'closed' } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'confirmed' } }),
    ]);

    res.json({
      tickets: {
        total: totalTickets,
        open: openTickets,
        scheduled: scheduledTickets,
        closed: closedTickets,
      },
      appointments: {
        total: totalAppointments,
        confirmed: confirmedAppointments,
      },
      events: {
        pending: eventQueue.length,
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Inbound phone call → start bidirectional media stream to our WS endpoint
app.post('/webhooks/call', (req, res) => {
  const vr = new twilio.twiml.VoiceResponse();
  const connect = vr.connect();
  // IMPORTANT: use wss and your Render URL below
  connect.stream({
    url: 'wss://aipm-c713.onrender.com/ws/twilio-media',
    // Optional: pass metadata you want to see on connect
    track: 'inbound_track' // default audio track
  });
  res.type('text/xml').send(vr.toString());
});


// --- Voice: status callback to track call lifecycle ---
app.post('/webhooks/call-status', async (req, res) => {
  // Twilio sends events like queued, ringing, in-progress, completed
  const { CallSid, CallStatus, From, To, Timestamp } = req.body;
  res.sendStatus(204);
});


// Start server
server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
  console.log(`📡 Events available at http://localhost:${PORT}/events`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});