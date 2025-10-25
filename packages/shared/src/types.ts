// Ticket types
export type TicketCategory = 'plumbing' | 'electrical' | 'hvac' | 'lock';
export type TicketSeverity = 'emergency' | 'routine';
export type TicketStatus = 'new' | 'vendor_contacting' | 'scheduled' | 'closed';

export interface Ticket {
  id: string;
  tenantId: string;
  propertyId: string;
  category: TicketCategory;
  severity: TicketSeverity;
  description: string;
  window: string;
  status: TicketStatus;
  createdAt: string;
  notes?: string;
}

// Vendor types
export interface Vendor {
  id: string;
  name: string;
  phones: string[];
  specialties: TicketCategory[];
  hours: string;
  priority: number;
  notes?: string;
}

// Appointment types
export type AppointmentStatus = 'tentative' | 'confirmed' | 'done';
export type ConfirmationMethod = 'sms' | 'voice';

export interface Appointment {
  id: string;
  ticketId: string;
  vendorId: string;
  startsAt: string;
  status: AppointmentStatus;
  confirmationMethod: ConfirmationMethod;
}

// Event types
export interface IntakeCompletedEvent {
  type: 'intake.completed';
  payload: {
    tenantId: string;
    propertyId: string;
    category: TicketCategory;
    severity: TicketSeverity;
    window: string;
    notes?: string;
  };
}

export interface VendorConfirmedEvent {
  type: 'vendor.confirmed';
  payload: {
    ticketId: string;
    vendorId: string;
    appointmentId: string;
  };
}

export interface AppointmentConfirmedEvent {
  type: 'appointment.confirmed';
  payload: {
    appointmentId: string;
    ticketId: string;
  };
}

export type Event = IntakeCompletedEvent | VendorConfirmedEvent | AppointmentConfirmedEvent;

