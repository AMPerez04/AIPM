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

// Tenant schemas
export const TenantSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  propertyId: z.string(),
  createdAt: z.string(),
});

export const CreateTenantSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email().optional(),
  propertyId: z.string().min(1, 'Property ID is required'),
});

// Property schemas
export const PropertySchema = z.object({
  id: z.string(),
  address: z.string(),
  unit: z.string().optional(),
  landlordId: z.string(),
  createdAt: z.string(),
});

export const CreatePropertySchema = z.object({
  address: z.string().min(1, 'Address is required'),
  unit: z.string().optional(),
  landlordId: z.string().min(1, 'Landlord ID is required'),
});

// Landlord schemas
export const LandlordSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  createdAt: z.string(),
});

export const EventSchema = z.discriminatedUnion('type', [
  IntakeCompletedEventSchema,
  VendorConfirmedEventSchema,
  AppointmentConfirmedEventSchema,
]);
