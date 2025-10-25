import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const dbPath = join(rootDir, 'dev.db');

console.log('🌱 Seeding database...\n');

try {
  const db = new Database(dbPath);
  
  // Create landlord
  const landlordId = randomUUID();
  db.prepare('INSERT INTO Landlord (id, name, email, phone, createdAt) VALUES (?, ?, ?, ?, ?)')
    .run(landlordId, 'ABC Property Management', 'info@abcpm.com', '+15551234567', new Date().toISOString());
  console.log('✅ Created landlord');

  // Create property
  const propertyId = randomUUID();
  db.prepare('INSERT INTO Property (id, address, unit, landlordId, createdAt) VALUES (?, ?, ?, ?, ?)')
    .run(propertyId, '123 Main St', 'Apt 2B', landlordId, new Date().toISOString());
  console.log('✅ Created property');

  // Create tenant
  const tenantId = randomUUID();
  db.prepare('INSERT INTO Tenant (id, firstName, lastName, phone, email, propertyId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(tenantId, 'John', 'Doe', '+15559876543', 'john.doe@example.com', propertyId, new Date().toISOString());
  console.log('✅ Created tenant');

  // Create vendors
  const vendors = [
    {
      id: randomUUID(),
      name: 'Acme Plumbing',
      phones: JSON.stringify(['+15551110001']),
      specialties: JSON.stringify(['plumbing']),
      hours: '9-6',
      priority: 1,
      notes: 'prefers SMS',
    },
    {
      id: randomUUID(),
      name: 'QuickFix Electrical',
      phones: JSON.stringify(['+15551110002']),
      specialties: JSON.stringify(['electrical']),
      hours: '8-7',
      priority: 1,
      notes: 'available weekends',
    },
    {
      id: randomUUID(),
      name: 'Cool Air HVAC',
      phones: JSON.stringify(['+15551110003']),
      specialties: JSON.stringify(['hvac']),
      hours: '7-9',
      priority: 1,
      notes: '24/7 emergency service',
    },
  ];

  const insertVendor = db.prepare(
    'INSERT INTO Vendor (id, name, phones, specialties, hours, priority, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  
  vendors.forEach(vendor => {
    insertVendor.run(
      vendor.id,
      vendor.name,
      vendor.phones,
      vendor.specialties,
      vendor.hours,
      vendor.priority,
      vendor.notes,
      new Date().toISOString()
    );
  });
  console.log(`✅ Created ${vendors.length} vendors`);

  // Create demo ticket
  const ticketId = randomUUID();
  db.prepare(
    'INSERT INTO Ticket (id, tenantId, propertyId, category, severity, description, window, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    ticketId,
    tenantId,
    propertyId,
    'plumbing',
    'routine',
    'Leak under kitchen sink',
    'today 1-5pm',
    'new',
    new Date().toISOString(),
    new Date().toISOString()
  );
  console.log('✅ Created demo ticket');

  db.close();

  console.log('\n✅ Seeding complete!');
  console.log('Created:', {
    landlord: landlordId,
    property: propertyId,
    tenant: tenantId,
    vendors: vendors.length,
    ticket: ticketId,
  });
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}

