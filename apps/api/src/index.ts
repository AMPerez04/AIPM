import express from 'express';
import cors from 'cors';
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
  TenantSchema,
  CreateTenantSchema,
  PropertySchema,
  CreatePropertySchema,
  LandlordSchema,
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

// Configure CORS - allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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

// Helper function to process event queue
async function processEventQueue() {
  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (!event) continue;
    
    try {
      console.log(`🔄 Processing event: ${event.type}`);
      
      switch (event.type) {
        case 'intake.completed':
          console.log('🔄 Processing intake.completed event');
          // Get ticketId from the first ticket created by this tenant/property combo
          const ticket = await prisma.ticket.findFirst({
            where: {
              tenantId: event.payload.tenantId,
              propertyId: event.payload.propertyId,
            },
            orderBy: { createdAt: 'desc' },
          });
          
          if (!ticket) {
            console.error('❌ No ticket found for intake.completed event');
            break;
          }
          
          console.log(`🔍 Found ticket ${ticket.id} for vendor selection`);
          await processVendorSelection(ticket.id);
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
    } catch (error) {
      console.error('❌ Error processing event:', error);
    }
  }
}

// Helper function to emit events
function emitEvent(event: Event) {
  eventQueue.push(event);
  console.log(`📡 Event emitted: ${event.type}`, event.payload);
  
  // Process event immediately
  processEventQueue();
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

// Helper function to find or create tenant by name and phone
async function findOrCreateTenant(name: string, phone: string, propertyId: string) {
  try {
    // Try to find existing tenant by phone
    let tenant = await prisma.tenant.findFirst({
      where: { phone },
    });

    if (!tenant) {
      // Create new tenant
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      tenant = await prisma.tenant.create({
        data: {
          firstName,
          lastName,
          phone,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          propertyId,
        },
      });
      console.log('✅ Created new tenant:', tenant.id);
    } else {
      console.log('✅ Found existing tenant:', tenant.id);
    }

    return tenant;
  } catch (error) {
    console.error('Error finding/creating tenant:', error);
    throw error;
  }
}

// Helper function to find or create landlord by email
async function findOrCreateLandlord(email: string, name?: string, phone?: string) {
  try {
    // Try to find existing landlord by email
    let landlord = await prisma.landlord.findFirst({
      where: { email },
    });

    if (!landlord) {
      // Create new landlord
      landlord = await prisma.landlord.create({
        data: {
          name: name || 'John Smith',
          email,
          phone: phone || '+1234567890',
        },
      });
      console.log('✅ Created new landlord:', landlord.id);
    } else {
      console.log('✅ Found existing landlord:', landlord.id);
    }

    return landlord;
  } catch (error) {
    console.error('Error finding/creating landlord:', error);
    throw error;
  }
}

// Helper function to find or create property by address
async function findOrCreateProperty(address: string, unit?: string, landlordEmail?: string) {
  try {
    // Try to find existing property by address
    let property = await prisma.property.findFirst({
      where: {
        address,
        unit: unit || null,
      },
    });

    if (!property) {
      // Get landlord - use provided email or default
      const landlord = await findOrCreateLandlord(
        landlordEmail || 'john.smith@example.com',
        'John Smith',
        '+1234567890'
      );

      // Create new property
      property = await prisma.property.create({
        data: {
          address,
          unit: unit || null,
          landlordId: landlord.id,
        },
      });
      console.log('✅ Created new property:', property.id);
    } else {
      console.log('✅ Found existing property:', property.id);
    }

    return property;
  } catch (error) {
    console.error('Error finding/creating property:', error);
    throw error;
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

    // Notify landlord (commented out - SMS not allowed from Twilio)
    // if (ticket.property.landlord) {
    //   const landlordMessage = `🚨 URGENT: Maintenance ticket #${ticket.id} for ${ticket.property.address} has been escalated. Issue: ${ticket.description}. Please contact tenant ${ticket.tenant.firstName} ${ticket.tenant.lastName} at ${ticket.tenant.phone}.`;
    //   
    //   // Would need to use outbound call or alternative notification method
    //   console.log(`Landlord notification suppressed: ${ticket.property.landlord.phone}`);
    // }

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
        try {
          // Build URL with ticket info as query params
          const url = new URL(`${process.env.BASE_URL}/webhooks/vendor-call`);
          url.searchParams.set('ticketId', ticket.id);
          url.searchParams.set('category', ticket.category);
          url.searchParams.set('description', ticket.description);
          url.searchParams.set('address', ticket.property.address);
          url.searchParams.set('unit', ticket.property.unit || '');
          url.searchParams.set('window', 'EMERGENCY - Available now?');
          
          const call = await twilioClient.calls.create({
            to: vendorPhones[0],
            from: process.env.TWILIO_PHONE_NUMBER!,
            url: url.toString(),
            method: 'POST',
            statusCallback: `${process.env.BASE_URL}/webhooks/call-status`,
            statusCallbackMethod: 'POST',
          });
          
          await logAudit(ticket.id, 'emergency_vendor_contacted', {
            vendorId: vendor.id,
            vendorName: vendor.name,
            method: 'call',
            callSid: call.sid,
          });
          
          console.log(`✅ Emergency call initiated to ${vendor.name}: ${call.sid}`);
        } catch (callError) {
          console.error(`Failed to contact emergency vendor ${vendor.name}:`, callError);
        }
      }
    }
  } catch (error) {
    console.error('Error contacting emergency vendors:', error);
  }
}

// Helper function to initiate outbound call to vendor
async function initiateVendorCall(ticketId: string) {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        tenant: true,
        property: true,
      },
    });

    if (!ticket) {
      console.error(`Ticket ${ticketId} not found`);
      return;
    }

    // Find vendors that handle this category, ordered by priority
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

    // Get the best priority vendor (first in list)
    const bestVendor = vendors[0];
    const vendorPhones = JSON.parse(bestVendor.phones);
    
    if (vendorPhones.length === 0) {
      console.error(`Vendor ${bestVendor.name} has no phone numbers`);
      return;
    }

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'vendor_contacting' },
    });

    // Make outbound call to vendor
    console.log(`📞 Initiating call to vendor ${bestVendor.name} at ${vendorPhones[0]} for ticket ${ticketId}`);
    
    // Build URL with ticket info as query params
    const url = new URL(`${process.env.BASE_URL}/webhooks/vendor-call`);
    url.searchParams.set('ticketId', ticketId);
    url.searchParams.set('category', ticket.category);
    url.searchParams.set('description', ticket.description);
    url.searchParams.set('address', ticket.property.address);
    url.searchParams.set('unit', ticket.property.unit || '');
    url.searchParams.set('window', ticket.window);
    
    const call = await twilioClient.calls.create({
      to: vendorPhones[0],
      from: process.env.TWILIO_PHONE_NUMBER!,
      url: url.toString(),
      method: 'POST',
      statusCallback: `${process.env.BASE_URL}/webhooks/call-status`,
      statusCallbackMethod: 'POST',
    });

    // Log audit
    await logAudit(ticketId, 'vendor_call_initiated', {
      vendorId: bestVendor.id,
      vendorName: bestVendor.name,
      callSid: call.sid,
      vendorPhone: vendorPhones[0],
    });

    console.log(`✅ Call initiated to vendor: ${call.sid}`);
  } catch (error) {
    console.error('Error initiating vendor call:', error);
  }
}

// Helper function to process vendor selection and pinging
async function processVendorSelection(ticketId: string) {
  try {
    console.log(`🔍 [VENDOR SELECTION] Starting vendor selection for ticket ${ticketId}`);
    
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        tenant: true,
        property: true,
      },
    });

    if (!ticket) {
      console.error(`❌ [VENDOR SELECTION] Ticket ${ticketId} not found for vendor selection`);
      return;
    }

    console.log(`✅ [VENDOR SELECTION] Found ticket: ${ticketId}, category: ${ticket.category}, severity: ${ticket.severity}`);
    
    // Check if vendor calls have already been initiated by looking for 'vendor_contacted' audit logs
    const existingVendorCalls = await prisma.auditLog.findMany({
      where: {
        ticketId: ticketId,
        action: 'vendor_contacted',
      },
    });
    
    if (existingVendorCalls.length > 0) {
      console.log(`⏭️ [VENDOR SELECTION] Skipping - vendor calls already initiated for ticket ${ticketId} (${existingVendorCalls.length} call(s) already made)`);
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

    console.log(`🔍 [VENDOR SELECTION] Found ${vendors.length} vendors for category: ${ticket.category}`);

    if (vendors.length === 0) {
      console.error(`❌ [VENDOR SELECTION] No vendors found for category: ${ticket.category}`);
      await logAudit(ticketId, 'no_vendors_found', { category: ticket.category });
      return;
    }

    // Update ticket status
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'vendor_contacting' },
    });
    
    console.log(`📞 [VENDOR SELECTION] Updating ticket status to vendor_contacting`);

    // Contact vendors in priority order
    for (const vendor of vendors.slice(0, 3)) { // Contact top 3 vendors
      const vendorPhones = JSON.parse(vendor.phones);
      console.log(`📞 [VENDOR SELECTION] Attempting to call vendor ${vendor.name} (ID: ${vendor.id})`);
      console.log(`📞 [VENDOR SELECTION] Vendor phone numbers: ${vendorPhones}`);
      
      if (vendorPhones.length > 0) {
        try {
          console.log(`📞 [VENDOR SELECTION] Building vendor call URL for ticket ${ticket.id}`);
          
          // Build URL with ticket info as query params
          const url = new URL(`${process.env.BASE_URL}/webhooks/vendor-call`);
          url.searchParams.set('ticketId', ticket.id);
          url.searchParams.set('category', ticket.category);
          url.searchParams.set('description', ticket.description);
          url.searchParams.set('address', ticket.property.address);
          url.searchParams.set('unit', ticket.property.unit || '');
          url.searchParams.set('window', ticket.window);
          
          console.log(`📞 [VENDOR SELECTION] Initiating Twilio call to ${vendorPhones[0]} via URL: ${url.toString()}`);
          
          const call = await twilioClient.calls.create({
            to: vendorPhones[0],
            from: process.env.TWILIO_PHONE_NUMBER!,
            url: url.toString(),
            method: 'POST',
            statusCallback: `${process.env.BASE_URL}/webhooks/call-status`,
            statusCallbackMethod: 'POST',
          });
          
          await logAudit(ticketId, 'vendor_contacted', {
            vendorId: vendor.id,
            vendorName: vendor.name,
            method: 'call',
            callSid: call.sid,
          });
          
          console.log(`✅ [VENDOR SELECTION] Successfully initiated call to ${vendor.name} - Call SID: ${call.sid}`);
        } catch (callError) {
          console.error(`❌ [VENDOR SELECTION] Failed to contact vendor ${vendor.name}:`, callError);
        }
      } else {
        console.log(`❌ [VENDOR SELECTION] No phone numbers available for vendor ${vendor.name}`);
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

  // Create upstream WS to OpenAI Realtime (GA interface - no beta header)
  const oaWs = new WebSocket(OPENAI_REALTIME_URL, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  // When OpenAI is ready, send session config + your instructions
  let oaWsReady = false;
  let sessionConfigured = false;
  let requestCount = 0;
  let lastRequestTime = 0;
  let streamSid: string | null = null;
  const MAX_REQUESTS_PER_SECOND = 50; // Rate limiting
  
  oaWs.on('open', () => {
    console.log('OpenAI Realtime API connected');
    
    // 1) Set session properties (GA format with session.type)
    oaWs.send(JSON.stringify({
      type: 'session.update',
      session: {
        type: 'realtime', // Required in GA interface
        model: 'gpt-realtime',
        output_modalities: ['audio'],
        audio: {
          input: {
            format: {
              type: 'audio/pcmu'
            },
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 200,
              create_response: true
            }
          },
          output: {
            format: {
              type: 'audio/pcmu'
            },
            voice: 'marin'
          }
        },
        tools: [{
          type: 'function',
          name: 'create_ticket',
          description: 'Create a maintenance ticket from a tenant call.',
          parameters: {
            type: 'object',
            properties: {
              tenantName: { 
                type: 'string', 
                description: 'Tenant full name (e.g., "John Smith")' 
              },
              tenantPhone: { 
                type: 'string', 
                description: 'Tenant phone number (e.g., "+1234567890")' 
              },
              propertyAddress: { 
                type: 'string', 
                description: 'Property address (e.g., "123 Main St")' 
              },
              propertyUnit: { 
                type: 'string', 
                description: 'Unit number if applicable (e.g., "Apt 2B", "Unit 101")' 
              },
              category: { 
                type: 'string', 
                enum: ['plumbing', 'electrical', 'hvac', 'appliance', 'lock', 'other'],
                description: 'Type of maintenance issue'
              },
              severity: { 
                type: 'string', 
                enum: ['emergency', 'routine'],
                description: 'Urgency level of the issue'
              },
              description: { 
                type: 'string',
                description: 'Detailed description of the maintenance issue'
              },
              window: { 
                type: 'string', 
                description: 'Preferred time window for repair (e.g., "today 1-5pm", "tomorrow morning")' 
              },
              notes: { 
                type: 'string',
                description: 'Additional notes or context'
              }
            },
            required: ['tenantName', 'tenantPhone', 'propertyAddress', 'category', 'severity', 'description', 'window']
          }
        }]
      },
    }));
  });

  // Handle all OpenAI messages in one handler
  oaWs.on('message', async (data) => {
    try {
      const evt = JSON.parse(data.toString());
      console.log('📩 OpenAI event:', evt.type);
      
      // Handle error events
      if (evt.type === 'error') {
        console.error('❌ OpenAI Realtime API Error:', evt.error);
        console.error('❌ Error details:', JSON.stringify(evt, null, 2));
        // Optionally handle the error (reconnect, notify user, etc.)
        return;
      }

      // Handle function calls from the model
      if (evt.type === 'response.output_item.done' && evt.item?.type === 'function_call') {
        const call = evt.item;
        console.log('🔧 Function call received:', call.name, call.arguments);
        
        try {
          const args = JSON.parse(call.arguments || '{}');
          
          if (call.name === 'create_ticket') {
            // Validate required fields
            const requiredFields = ['tenantName', 'tenantPhone', 'propertyAddress', 'category', 'severity', 'description', 'window'];
            const missingFields = requiredFields.filter(field => !args[field]);
            
            if (missingFields.length > 0) {
              throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }
            
            // Find or create property first
            const property = await findOrCreateProperty(args.propertyAddress, args.propertyUnit);
            
            // Find or create tenant
            const tenant = await findOrCreateTenant(args.tenantName, args.tenantPhone, property.id);
            
            // Create ticket via Prisma
            const ticket = await prisma.ticket.create({
              data: {
                tenantId: tenant.id,
                propertyId: property.id,
                category: args.category,
                severity: args.severity,
                description: args.description,
                window: args.window,
                notes: args.notes ?? null,
                status: 'new'
              },
              include: {
                tenant: true,
                property: true,
              },
            });
            
            // Log audit
            await logAudit(ticket.id, 'ticket_created_via_tool', args);
            
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
            
            console.log('✅ Ticket created via tool:', ticket.id);
            
            // Return tool result to the model
            oaWs.send(JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'function_call_output',
                call_id: call.call_id,
                output: JSON.stringify({
                  success: true,
                  ticketId: ticket.id,
                  status: ticket.status,
                  category: ticket.category,
                  severity: ticket.severity,
                  message: `Ticket #${ticket.id} created successfully. ${ticket.severity === 'emergency' ? 'Emergency' : 'Routine'} ${ticket.category} issue scheduled for ${ticket.window}.`
                })
              }
            }));
            
            // Prompt the model to continue and speak the confirmation
            oaWs.send(JSON.stringify({ type: 'response.create' }));
          } else {
            throw new Error(`Unknown function: ${call.name}`);
          }
        } catch (err) {
          console.error('❌ Function call failed:', err);
          
          // Return error to the model
          oaWs.send(JSON.stringify({
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call.call_id,
              output: JSON.stringify({ 
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error occurred'
              })
            }
          }));
          
          oaWs.send(JSON.stringify({ type: 'response.create' }));
        }
        return;
      }

      // Log session events
      if (evt.type === 'session.updated' || evt.type === 'session.created') {
        console.log('✅ Session configured:', evt.session);
        sessionConfigured = true;
        
        if (!oaWsReady) {
          oaWsReady = true;
          
          // Provide system instructions (your prompt)
          oaWs.send(JSON.stringify({
            type: 'session.update',
            session: {
              type: 'realtime',
              instructions: `You are RelayPM, a 24/7 voice property maintenance agent for landlords.

Your job is to:
1. Answer tenant calls for maintenance requests
2. Collect the following information from the tenant:
   - Their full name
   - Their phone number
   - Property address
   - Unit number (if applicable)
   - Description of the issue
   - Preferred time window for repair
3. Decide severity (emergency vs routine) based on:
   - Emergency: Floods, fires, gas leaks, no heat in freezing weather, broken locks, etc.
   - Routine: Plumbing clogs, broken appliances, HVAC issues (non-emergency), etc.
4. Create a ticket using the create_ticket tool when you have all required information
5. Book an approved vendor for the requested time window
6. Confirm appointment details with the tenant
7. Notify the landlord via SMS
8. Hang up after the caller confirms the important details are correct

Be professional, empathetic, and efficient. Confirm all details clearly before ending the call.

For emergency issues, emphasize the urgency and dispatch vendors immediately.

IMPORTANT: 
- Start the conversation immediately with a greeting. Say hello and introduce yourself as RelayPM.
- Ask for the tenant's name, phone number, property address, and unit number first.
- Then ask about the issue, determine severity, and get their preferred time window.
- When you have all required information (tenantName, tenantPhone, propertyAddress, category, severity, description, window), call the create_ticket tool.
- After creating a ticket, verbally confirm the ticket number and next steps to the tenant.
- Do not repeat anything except the most important information, but only once. `,
            },
          }));
        }
      }

      // OpenAI audio arrives in chunks
      if (evt.type === 'response.output_audio.delta' && evt.delta && streamSid) {
        // evt.delta is base64 in the output audio format we requested (audio/pcmu)
        const frame = {
          event: 'media',
          streamSid: streamSid,
          media: {
            payload: evt.delta // base64 audio/pcmu — no re-encode needed
          }
        };
        twilioWs.send(JSON.stringify(frame));
      }

      if (evt.type === 'response.output_audio_transcript.delta') {
        console.log('🗣️ Agent speaking:', evt.delta);
      }
    } catch (e) {
      console.error('OpenAI WS parse error', e);
    }
  });

  // Pipe Twilio -> OpenAI (caller audio)
  twilioWs.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.event === 'start') {
        streamSid = msg.streamSid;
        console.log('Twilio stream started', streamSid);
      }
      if (msg.event === 'media' && msg.media?.payload && oaWsReady && sessionConfigured && oaWs.readyState === WebSocket.OPEN) {
        // Debug log first audio chunk
        if (requestCount === 0) {
          console.log('🎤 First audio chunk received, session configured:', sessionConfigured);
        }
        
        // Rate limiting to prevent excessive requests
        const now = Date.now();
        if (now - lastRequestTime >= 1000) { // Reset counter every second
          requestCount = 0;
          lastRequestTime = now;
        }
        
        if (requestCount >= MAX_REQUESTS_PER_SECOND) {
          console.warn(`⚠️ Rate limit exceeded: ${requestCount} requests in last second. Dropping audio chunk.`);
          return;
        }
        
        requestCount++;
        
        // Debug logging for request tracking
        if (requestCount % 10 === 0) {
          console.log(`📊 Audio requests sent: ${requestCount} (session: ${sessionId})`);
        }
        
        // msg.media.payload = base64 μ-law 8k
        // Send to OpenAI as an audio append
        try {
          oaWs.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: msg.media.payload,           // base64 μ-law (matches session input_audio_format)
          }));
        } catch (sendError) {
          console.error('❌ Error sending audio chunk:', sendError);
        }
      }
      if (msg.event === 'stop' && oaWsReady && oaWs.readyState === WebSocket.OPEN) {
        // Only commit if we have audio data (at least 100ms)
        if (requestCount > 0) {
          console.log(`📤 Committing audio buffer with ${requestCount} chunks`);
          oaWs.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
        } else {
          console.warn('⚠️ No audio data to commit, skipping');
        }
      }
    } catch (e) {
      console.error('Twilio WS parse error', e);
    }
  });

  // Clean up
  const shutdown = () => {
    console.log(`📊 Final request count for session ${sessionId}: ${requestCount} requests`);
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

app.delete('/vendors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vendor.delete({ where: { id } });
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
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

    // Make outbound call to vendor
    if (vendorPhones.length > 0) {
      try {
        // Build URL with ticket info as query params
        const url = new URL(`${process.env.BASE_URL}/webhooks/vendor-call`);
        url.searchParams.set('ticketId', ticket.id);
        url.searchParams.set('category', ticket.category);
        url.searchParams.set('description', ticket.description);
        url.searchParams.set('address', ticket.property.address);
        url.searchParams.set('unit', ticket.property.unit || '');
        url.searchParams.set('window', ticket.window);
        
        const call = await twilioClient.calls.create({
          to: vendorPhones[0],
          from: process.env.TWILIO_PHONE_NUMBER!,
          url: url.toString(),
          method: 'POST',
          statusCallback: `${process.env.BASE_URL}/webhooks/call-status`,
          statusCallbackMethod: 'POST',
        });

        // Log audit
        await logAudit(ticketId, 'vendor_pinged', {
          vendorId,
          method: 'call',
          callSid: call.sid,
        });

        res.json({
          success: true,
          message: 'Vendor called successfully',
          callSid: call.sid,
        });
      } catch (callError) {
        console.error('Call failed:', callError);
        res.status(500).json({ error: 'Failed to call vendor' });
      }
    } else {
      res.status(400).json({ error: 'No phone numbers available for vendor' });
    }
  } catch (error) {
    console.error('Error pinging vendor:', error);
    res.status(500).json({ error: 'Failed to ping vendor' });
  }
});

// ============================================================================
// TENANT ENDPOINTS
// ============================================================================

// GET /tenants - List all tenants
app.get('/tenants', async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// POST /tenants - Create a new tenant
app.post('/tenants', async (req, res) => {
  try {
    const data = CreateTenantSchema.parse(req.body);

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Create the tenant
    const tenant = await prisma.tenant.create({
      data,
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
      },
    });

    res.status(201).json({
      id: tenant.id,
      message: 'Tenant created successfully',
      tenant,
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create tenant' });
    }
  }
});

// GET /tenants/:id - Get tenant details
app.get('/tenants/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
});

// POST /tenants-with-property - Create tenant and property together
app.post('/tenants-with-property', async (req, res) => {
  try {
    const createTenantWithPropertySchema = z.object({
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      phone: z.string().min(1, 'Phone number is required'),
      email: z.string().email().optional(),
      propertyAddress: z.string().min(1, 'Property address is required'),
      propertyUnit: z.string().optional(),
      landlordEmail: z.string().email().default('john.smith@example.com'),
    });

    const data = createTenantWithPropertySchema.parse(req.body);

    // Find or create property
    const property = await findOrCreateProperty(
      data.propertyAddress,
      data.propertyUnit,
      data.landlordEmail
    );

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        propertyId: property.id,
      },
      include: {
        property: {
          include: {
            landlord: true,
          },
        },
      },
    });

    res.status(201).json({
      id: tenant.id,
      message: 'Tenant and property created successfully',
      tenant,
      property,
    });
  } catch (error) {
    console.error('Error creating tenant with property:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create tenant with property' });
    }
  }
});

// POST /tenants/bulk - Create multiple tenants
app.post('/tenants/bulk', async (req, res) => {
  try {
    const bulkCreateSchema = z.object({
      tenants: z.array(z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        phone: z.string().min(1, 'Phone number is required'),
        email: z.string().email().optional(),
        propertyAddress: z.string().min(1, 'Property address is required'),
        propertyUnit: z.string().optional(),
      })),
      landlordEmail: z.string().email().default('john.smith@example.com'),
    });

    const { tenants, landlordEmail } = bulkCreateSchema.parse(req.body);

    const results = [];

    for (const tenantData of tenants) {
      try {
        // Find or create property
        const property = await findOrCreateProperty(
          tenantData.propertyAddress,
          tenantData.propertyUnit,
          landlordEmail
        );

        // Create tenant
        const tenant = await prisma.tenant.create({
          data: {
            firstName: tenantData.firstName,
            lastName: tenantData.lastName,
            phone: tenantData.phone,
            email: tenantData.email,
            propertyId: property.id,
          },
          include: {
            property: {
              include: {
                landlord: true,
              },
            },
          },
        });

        results.push({
          success: true,
          tenant,
          property,
        });
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          tenantData,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    res.status(201).json({
      message: `Bulk creation completed: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: {
        total: tenants.length,
        successful: successCount,
        failed: failureCount,
      },
    });
  } catch (error) {
    console.error('Error bulk creating tenants:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to bulk create tenants' });
    }
  }
});

// ============================================================================
// PROPERTY ENDPOINTS
// ============================================================================

// GET /properties - List all properties
app.get('/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        landlord: true,
        tenants: true,
        tickets: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// POST /properties - Create a new property
app.post('/properties', async (req, res) => {
  try {
    const data = CreatePropertySchema.parse(req.body);

    // Check if landlord exists
    const landlord = await prisma.landlord.findUnique({
      where: { id: data.landlordId },
    });

    if (!landlord) {
      return res.status(404).json({ error: 'Landlord not found' });
    }

    // Create the property
    const property = await prisma.property.create({
      data,
      include: {
        landlord: true,
        tenants: true,
      },
    });

    res.status(201).json({
      id: property.id,
      message: 'Property created successfully',
      property,
    });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property' });
    }
  }
});

// GET /properties/:id - Get property details
app.get('/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        landlord: true,
        tenants: {
          include: {
            tickets: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        tickets: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// ============================================================================
// LANDLORD ENDPOINTS
// ============================================================================

// GET /landlords - List all landlords
app.get('/landlords', async (req, res) => {
  try {
    const landlords = await prisma.landlord.findMany({
      include: {
        properties: {
          include: {
            tenants: true,
            tickets: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(landlords);
  } catch (error) {
    console.error('Error fetching landlords:', error);
    res.status(500).json({ error: 'Failed to fetch landlords' });
  }
});

// GET /landlords/:id - Get landlord details
app.get('/landlords/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const landlord = await prisma.landlord.findUnique({
      where: { id },
      include: {
        properties: {
          include: {
            tenants: true,
            tickets: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!landlord) {
      return res.status(404).json({ error: 'Landlord not found' });
    }

    res.json(landlord);
  } catch (error) {
    console.error('Error fetching landlord:', error);
    res.status(500).json({ error: 'Failed to fetch landlord' });
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

// POST /notify - Send notification via phone call (SMS disabled)
app.post('/notify', async (req, res) => {
  try {
    const notifySchema = z.object({
      to: z.string(),
      message: z.string(),
      type: z.enum(['tenant', 'landlord', 'vendor']).optional(),
    });

    const { to, message, type } = notifySchema.parse(req.body);

    // SMS disabled - return error
    res.status(400).json({ 
      error: 'SMS notifications not supported. Use outbound calls instead.',
      suggestion: 'Use initiateVendorCall function for vendor notifications'
    });
  } catch (error) {
    console.error('Error with notification request:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to process notification request' });
    }
  }
});

// ============================================================================
// WEBHOOK ENDPOINTS
// ============================================================================

// POST /webhooks/sms - Handle incoming SMS (disabled - SMS not allowed from Twilio)
// This endpoint is kept for compatibility but SMS is disabled
app.post('/webhooks/sms', async (req, res) => {
  try {
    const { From, Body, MessageSid } = req.body;

    console.log(`📱 SMS received from ${From} (SMS disabled, webhook kept for compatibility): ${Body}`);
    
    // Return 200 to acknowledge receipt but do not process
    res.json({ 
      message: 'SMS webhook received but SMS processing is disabled',
      note: 'All notifications now use outbound calls'
    });
  } catch (error) {
    console.error('Error processing SMS webhook:', error);
    res.status(500).json({ error: 'Failed to process SMS webhook' });
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
    track: 'inbound_track' // default audio track
  });
  
  res.type('text/xml').send(vr.toString());
});


// POST /webhooks/vendor-call - Handles Twilio callback when vendor answers
app.post('/webhooks/vendor-call', (req, res) => {
  // Get ticket info from request params (passed when creating the call)
  const { ticketId, category, description, address, unit, window } = req.query;
  
  const vr = new twilio.twiml.VoiceResponse();
  
  // Speak to vendor about the job
  const greeting = `Hello, this is Relay PM. We have a ${category} job for ${address}`;
  if (unit) {
    vr.say(greeting + `, unit ${unit}.`);
  } else {
    vr.say(greeting + '.');
  }
  
  vr.say(`The issue is: ${description}. The tenant requested ${window}. Can you confirm availability?`);
  vr.pause({ length: 5 });
  vr.say('Thank you. Press 1 to accept this appointment. Press 2 to decline.');
  
  // Use <Gather> to capture vendor's response
  const gather = vr.gather({
    numDigits: 1,
    action: `${process.env.BASE_URL}/webhooks/vendor-response?ticketId=${ticketId}`,
    method: 'POST',
  });
  
  gather.say('Please press 1 to accept or 2 to decline.');
  
  // If no response, say goodbye
  vr.say('Thank you for your response. Goodbye.');
  vr.hangup();
  
  res.type('text/xml').send(vr.toString());
});

// POST /webhooks/vendor-response - Handles vendor's keypress response
app.post('/webhooks/vendor-response', async (req, res) => {
  const { ticketId } = req.query;
  const { Digits } = req.body;
  
  const vr = new twilio.twiml.VoiceResponse();
  
  if (!ticketId) {
    vr.say('Error: no ticket ID provided. Goodbye.');
    res.type('text/xml').send(vr.toString());
    return;
  }
  
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId as string },
      include: {
        tenant: true,
        property: true,
      },
    });
    
    if (!ticket) {
      vr.say('Ticket not found. Goodbye.');
      res.type('text/xml').send(vr.toString());
      return;
    }
    
    if (Digits === '1') {
      // Vendor accepted
      vr.say('Thank you for accepting. You should receive an SMS with the appointment details shortly.');
      
      // Update ticket status
      await prisma.ticket.update({
        where: { id: ticketId as string },
        data: { status: 'scheduled' },
      });
      
      // Log acceptance
      await logAudit(ticketId as string, 'vendor_accepted_via_call', {
        digits: Digits,
      });
      
      console.log(`✅ Vendor accepted appointment for ticket ${ticketId}`);
    } else if (Digits === '2') {
      // Vendor declined
      vr.say('Thank you for letting us know. We will contact another vendor. Goodbye.');
      
      // Log decline
      await logAudit(ticketId as string, 'vendor_declined_via_call', {
        digits: Digits,
      });
      
      // TODO: Try next vendor in priority order
      console.log(`❌ Vendor declined for ticket ${ticketId}`);
    } else {
      vr.say('Invalid response. Goodbye.');
    }
  } catch (error) {
    console.error('Error handling vendor response:', error);
    vr.say('An error occurred. Goodbye.');
  }
  
  res.type('text/xml').send(vr.toString());
});

// --- Voice: status callback to track call lifecycle ---
app.post('/webhooks/call-status', async (req, res) => {
  // Twilio sends events like queued, ringing, in-progress, completed
  const { CallSid, CallStatus, From, To, Timestamp, Direction } = req.body;
  
  console.log('📞 Call status update:', {
    CallSid,
    CallStatus,
    From,
    To,
    Timestamp,
    Direction
  });

  // When inbound call completes, find the most recent ticket for this caller and trigger vendor selection
  // Only process inbound calls (Direction === 'inbound') to avoid processing vendor outbound calls
  if (CallStatus === 'completed' && From && Direction === 'inbound') {
    console.log('📥 Processing inbound call completion - tenant call ended');
    try {
      // Find the most recent ticket created for this phone number
      console.log('From', From);  
      const tenant = await prisma.tenant.findFirst({
        where: { phone: From },
        include: {
          tickets: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
      console.log('tenant', tenant);

      if (tenant && tenant.tickets.length > 0) {
        const mostRecentTicket = tenant.tickets[0];
        console.log(`📋 Found most recent ticket: ${mostRecentTicket.id}, status: ${mostRecentTicket.status}`);
        
        // Trigger vendor call if in 'new' or 'vendor_contacting' status
        // 'vendor_contacting' might be set but vendor calls might not have been made yet
        if (mostRecentTicket.status === 'new' || mostRecentTicket.status === 'vendor_contacting') {
          console.log(`🎯 Triggering vendor selection for ticket ${mostRecentTicket.id}`);
          
          // Use processVendorSelection which handles the status and vendor calls properly
          await processVendorSelection(mostRecentTicket.id);
        } else {
          console.log(`⏭️ Skipping vendor call - ticket ${mostRecentTicket.id} already in status: ${mostRecentTicket.status}`);
        }
      } else {
        console.log(`⚠️ No tickets found for tenant calling from ${From}`);
      }
    } catch (error) {
      console.error('❌ Error processing call completion:', error);
    }
  }
  
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