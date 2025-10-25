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
  spendingLimit?: number; // Monthly spending limit
  totalSpent?: number; // Total amount spent with this vendor
  jobHistory?: JobHistory[];
  rating?: number; // 1-5 star rating
  lastUsed?: string; // Last job date
}

export interface JobHistory {
  id: string;
  vendorId: string;
  ticketId: string;
  propertyId: string;
  jobType: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled';
  completedAt?: string;
  notes?: string;
}

// Property types
export interface Property {
  id: string;
  address: string;
  unit?: string;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse';
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  rent?: number;
  status: 'active' | 'inactive' | 'maintenance';
  notes?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  rules?: PropertyRule[];
  tenants?: Tenant[];
  maintenanceHistory?: MaintenanceRecord[];
}

export interface PropertyRule {
  id: string;
  propertyId: string;
  ruleType: 'spending_limit' | 'approval_required' | 'vendor_restriction' | 'time_restriction';
  description: string;
  value?: number; // For spending limits
  isActive: boolean;
  createdAt: string;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  propertyId: string;
  leaseStart?: string;
  leaseEnd?: string;
  rent?: number;
  status: 'active' | 'inactive' | 'moved_out';
}

export interface MaintenanceRecord {
  id: string;
  propertyId: string;
  vendorId?: string;
  ticketId?: string;
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  notes?: string;
}

// Call Log types
export interface CallLog {
  id: string;
  callSid: string;
  propertyId: string;
  vendorId?: string;
  tenantId?: string;
  callType: 'inbound' | 'outbound';
  callStatus: 'completed' | 'missed' | 'voicemail' | 'busy' | 'failed';
  duration: number; // in seconds
  recordingUrl?: string;
  transcription?: string;
  summary?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Related entities
  property?: Property;
  vendor?: Vendor;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
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
