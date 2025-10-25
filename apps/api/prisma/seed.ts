import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create landlord
  const landlord = await prisma.landlord.create({
    data: {
      name: 'ABC Property Management',
      email: 'info@abcpm.com',
      phone: '+15551234567',
    },
  });

  // Create property
  const property = await prisma.property.create({
    data: {
      address: '123 Main St',
      unit: 'Apt 2B',
      landlordId: landlord.id,
    },
  });

  // Create tenant
  const tenant = await prisma.tenant.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      phone: '+15559876543',
      email: 'john.doe@example.com',
      propertyId: property.id,
    },
  });

  // Create vendors
  const vendors = await Promise.all([
    prisma.vendor.create({
      data: {
        name: 'Acme Plumbing',
        phones: JSON.stringify(['+15551110001']),
        specialties: JSON.stringify(['plumbing']),
        hours: '9-6',
        priority: 1,
        notes: 'prefers SMS',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'QuickFix Electrical',
        phones: JSON.stringify(['+15551110002']),
        specialties: JSON.stringify(['electrical']),
        hours: '8-7',
        priority: 1,
        notes: 'available weekends',
      },
    }),
    prisma.vendor.create({
      data: {
        name: 'Cool Air HVAC',
        phones: JSON.stringify(['+15551110003']),
        specialties: JSON.stringify(['hvac']),
        hours: '7-9',
        priority: 1,
        notes: '24/7 emergency service',
      },
    }),
  ]);

  // Create demo ticket
  const ticket = await prisma.ticket.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      category: 'plumbing',
      severity: 'routine',
      description: 'Leak under kitchen sink',
      window: 'today 1-5pm',
      status: 'new',
    },
  });

  console.log('✅ Seeding complete!');
  console.log('Created:', {
    landlord: landlord.id,
    property: property.id,
    tenant: tenant.id,
    vendors: vendors.length,
    ticket: ticket.id,
  });
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

