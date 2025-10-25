import { z } from 'zod';

// Ticket schemas
export const TicketCategorySchema = z.enum(['plumbing', 'electrical', 'hvac', 'lock']);
export const TicketSeveritySchema = z.enum(['emergency', 'routine']);
export const TicketStatusSchema = z.enum(['new', 'vendor_contacting', 'scheduled', 'closed']);

export const TicketSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  propertyId: z.string(),
  category: TicketCategorySchema,
  severity: TicketSeveritySchema,
  description: z.string(),
  window: z.string(),
  status: TicketStatusSchema,
  createdAt: z.string(),
  notes: z.string().optional(),
});

// Vendor schemas
export const VendorSchema = z.object({
  id: z.string(),
  name: z.string(),
  phones: z.array(z.string()),
  specialties: z.array(TicketCategorySchema),
  hours: z.string(),
  priority: z.number(),
  notes: z.string().optional(),
});

// Appointment schemas
export const AppointmentStatusSchema = z.enum(['tentative', 'confirmed', 'done']);
export const ConfirmationMethodSchema = z.enum(['sms', 'voice']);

export const AppointmentSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  vendorId: z.string(),
  startsAt: z.string(),
  status: AppointmentStatusSchema,
  confirmationMethod: ConfirmationMethodSchema,
});

// Event schemas
export const IntakeCompletedEventSchema = z.object({
  type: z.literal('intake.completed'),
  payload: z.object({
    tenantId: z.string(),
    propertyId: z.string(),
    category: TicketCategorySchema,
    severity: TicketSeveritySchema,
    window: z.string(),
    notes: z.string().optional(),
  }),
});

export const VendorConfirmedEventSchema = z.object({
  type: z.literal('vendor.confirmed'),
  payload: z.object({
    ticketId: z.string(),
    vendorId: z.string(),
    appointmentId: z.string(),
  }),
});

export const AppointmentConfirmedEventSchema = z.object({
  type: z.literal('appointment.confirmed'),
  payload: z.object({
    appointmentId: z.string(),
    ticketId: z.string(),
  }),
});

export const EventSchema = z.discriminatedUnion('type', [
  IntakeCompletedEventSchema,
  VendorConfirmedEventSchema,
  AppointmentConfirmedEventSchema,
]);
