import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample landlord
  const landlord = await prisma.landlord.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1234567890',
    },
  });

  console.log('✅ Created landlord:', landlord.name);

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      address: '123 Main Street',
      unit: 'Apt 1A',
      landlordId: landlord.id,
    },
  });

  const property2 = await prisma.property.create({
    data: {
      address: '456 Oak Avenue',
      unit: 'Unit 2B',
      landlordId: landlord.id,
    },
  });

  const property3 = await prisma.property.create({
    data: {
      address: '7304 Lindell Blvd',
      unit: 'Unit 1B',
      landlordId: landlord.id,
    },
  });

  console.log('✅ Created properties:', property1.address, property2.address);

  // Create sample tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      firstName: 'Alice',
      lastName: 'Johnson',
      phone: '+1234567891',
      email: 'alice.johnson@example.com',
      propertyId: property1.id,
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      firstName: 'Bob',
      lastName: 'Williams',
      phone: '+1234567892',
      email: 'bob.williams@example.com',
      propertyId: property2.id,
    },
  });

  const tenant3 = await prisma.tenant.create({
    data: {
      firstName: 'Austin',
      lastName: 'Perez',
      phone: '+13145606377',
      email: 'austin.perez@example.com',
      propertyId: property3.id,
    },
  });

  console.log('✅ Created tenants:', tenant1.firstName, tenant2.firstName);

  // Create sample vendors
  const vendors = [
    {
      name: 'Acme Plumbing',
      phones: JSON.stringify(['+1234567893']),
      specialties: JSON.stringify(['plumbing']),
      hours: '9AM-6PM',
      priority: 1,
      notes: 'Emergency available 24/7',
    },
    {
      name: 'Quick Fix Electrical',
      phones: JSON.stringify(['+1234567894']),
      specialties: JSON.stringify(['electrical']),
      hours: '8AM-5PM',
      priority: 1,
      notes: 'Licensed electrician',
    },
    {
      name: 'HVAC Solutions',
      phones: JSON.stringify(['+1234567895']),
      specialties: JSON.stringify(['hvac']),
      hours: '7AM-7PM',
      priority: 2,
      notes: 'Heating and cooling specialist',
    },
    {
      name: 'Lock & Key Pro',
      phones: JSON.stringify(['+1234567896']),
      specialties: JSON.stringify(['lock']),
      hours: '9AM-5PM',
      priority: 3,
      notes: 'Locksmith services',
    },
    {
      name: 'Emergency Handyman',
      phones: JSON.stringify(['+1234567897']),
      specialties: JSON.stringify(['plumbing', 'electrical', 'hvac', 'lock']),
      hours: '24/7',
      priority: 1,
      notes: 'Emergency services only',
    },
  ];

  for (const vendorData of vendors) {
    const vendor = await prisma.vendor.create({
      data: vendorData,
    });
    console.log('✅ Created vendor:', vendor.name);
  }

  // Create sample tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      tenantId: tenant1.id,
      propertyId: property1.id,
      category: 'plumbing',
      severity: 'routine',
      description: 'Kitchen sink is dripping',
      window: 'tomorrow 9AM-12PM',
      status: 'new',
      notes: 'Tenant reported slow drip from faucet',
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      tenantId: tenant2.id,
      propertyId: property2.id,
      category: 'electrical',
      severity: 'emergency',
      description: 'Power outlet smoking',
      window: 'immediately',
      status: 'new',
      notes: 'URGENT: Electrical hazard detected',
    },
  });

  console.log('✅ Created sample tickets');

  // Create sample audit logs
  await prisma.auditLog.create({
    data: {
      ticketId: ticket1.id,
      action: 'ticket_created',
      details: JSON.stringify({ category: 'plumbing', severity: 'routine' }),
    },
  });

  await prisma.auditLog.create({
    data: {
      ticketId: ticket2.id,
      action: 'ticket_created',
      details: JSON.stringify({ category: 'electrical', severity: 'emergency' }),
    },
  });

  console.log('✅ Created sample audit logs');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Sample data created:');
  console.log(`- 1 Landlord: ${landlord.name}`);
  console.log(`- 2 Properties: ${property1.address}, ${property2.address}`);
  console.log(`- 2 Tenants: ${tenant1.firstName} ${tenant1.lastName}, ${tenant2.firstName} ${tenant2.lastName}`);
  console.log(`- 5 Vendors: Acme Plumbing, Quick Fix Electrical, HVAC Solutions, Lock & Key Pro, Emergency Handyman`);
  console.log(`- 2 Tickets: Plumbing (routine), Electrical (emergency)`);
  console.log('');
  console.log('You can now test the API endpoints with this sample data.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });