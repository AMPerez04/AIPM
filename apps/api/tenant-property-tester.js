#!/usr/bin/env node

/**
 * Test script for tenant and property management endpoints
 * This script demonstrates how to add new tenants and their addresses
 * All tenants will be associated with landlord john.smith@example.com
 */

const API_BASE = 'http://localhost:3001';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
}

async function testCreateSingleTenantWithProperty() {
  console.log('\n🏠 Testing: Create single tenant with property');
  
  try {
    const result = await apiRequest('/tenants-with-property', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'Sarah',
        lastName: 'Johnson',
        phone: '+1234567898',
        email: 'sarah.johnson@example.com',
        propertyAddress: '789 Pine Street',
        propertyUnit: 'Apt 3C',
        landlordEmail: 'john.smith@example.com'
      }),
    });

    console.log('✅ Success:', result.message);
    console.log('   Tenant ID:', result.tenant.id);
    console.log('   Property ID:', result.property.id);
    console.log('   Address:', result.property.address);
    console.log('   Landlord:', result.property.landlord.name);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testBulkCreateTenants() {
  console.log('\n🏘️ Testing: Bulk create multiple tenants');
  
  try {
    const result = await apiRequest('/tenants/bulk', {
      method: 'POST',
      body: JSON.stringify({
        landlordEmail: 'john.smith@example.com',
        tenants: [
          {
            firstName: 'Mike',
            lastName: 'Davis',
            phone: '+1234567899',
            email: 'mike.davis@example.com',
            propertyAddress: '321 Elm Avenue',
            propertyUnit: 'Unit 2A'
          },
          {
            firstName: 'Lisa',
            lastName: 'Wilson',
            phone: '+1234567800',
            email: 'lisa.wilson@example.com',
            propertyAddress: '654 Maple Drive',
            propertyUnit: 'Apt 1B'
          },
          {
            firstName: 'David',
            lastName: 'Brown',
            phone: '+1234567801',
            email: 'david.brown@example.com',
            propertyAddress: '987 Cedar Lane',
            propertyUnit: 'Unit 3D'
          }
        ]
      }),
    });

    console.log('✅ Success:', result.message);
    console.log('   Summary:', result.summary);
    
    result.results.forEach((item, index) => {
      if (item.success) {
        console.log(`   ✅ Tenant ${index + 1}: ${item.tenant.firstName} ${item.tenant.lastName} at ${item.property.address}`);
      } else {
        console.log(`   ❌ Tenant ${index + 1}: Failed - ${item.error}`);
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testListTenants() {
  console.log('\n📋 Testing: List all tenants');
  
  try {
    const tenants = await apiRequest('/tenants');
    console.log(`✅ Found ${tenants.length} tenants:`);
    
    tenants.forEach((tenant, index) => {
      console.log(`   ${index + 1}. ${tenant.firstName} ${tenant.lastName}`);
      console.log(`      Phone: ${tenant.phone}`);
      console.log(`      Property: ${tenant.property.address} ${tenant.property.unit || ''}`);
      console.log(`      Landlord: ${tenant.property.landlord.name}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testListProperties() {
  console.log('\n🏢 Testing: List all properties');
  
  try {
    const properties = await apiRequest('/properties');
    console.log(`✅ Found ${properties.length} properties:`);
    
    properties.forEach((property, index) => {
      console.log(`   ${index + 1}. ${property.address} ${property.unit || ''}`);
      console.log(`      Landlord: ${property.landlord.name} (${property.landlord.email})`);
      console.log(`      Tenants: ${property.tenants.length}`);
      console.log(`      Tickets: ${property.tickets.length}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testListLandlords() {
  console.log('\n👤 Testing: List all landlords');
  
  try {
    const landlords = await apiRequest('/landlords');
    console.log(`✅ Found ${landlords.length} landlords:`);
    
    landlords.forEach((landlord, index) => {
      console.log(`   ${index + 1}. ${landlord.name}`);
      console.log(`      Email: ${landlord.email}`);
      console.log(`      Phone: ${landlord.phone}`);
      console.log(`      Properties: ${landlord.properties.length}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Tenant & Property Management API Tests');
  console.log('=' .repeat(60));
  
  try {
    // Test health check first
    const health = await apiRequest('/health');
    console.log('✅ API Health Check:', health.status);
    
    // Run tests
    await testCreateSingleTenantWithProperty();
    await testBulkCreateTenants();
    await testListTenants();
    await testListProperties();
    await testListLandlords();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📝 Usage Examples:');
    console.log('');
    console.log('1. Create a single tenant with property:');
    console.log('   POST /tenants-with-property');
    console.log('   {');
    console.log('     "firstName": "John",');
    console.log('     "lastName": "Doe",');
    console.log('     "phone": "+1234567890",');
    console.log('     "email": "john.doe@example.com",');
    console.log('     "propertyAddress": "123 Main St",');
    console.log('     "propertyUnit": "Apt 1A",');
    console.log('     "landlordEmail": "john.smith@example.com"');
    console.log('   }');
    console.log('');
    console.log('2. Bulk create multiple tenants:');
    console.log('   POST /tenants/bulk');
    console.log('   {');
    console.log('     "landlordEmail": "john.smith@example.com",');
    console.log('     "tenants": [');
    console.log('       { "firstName": "Jane", "lastName": "Smith", ... }');
    console.log('     ]');
    console.log('   }');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
main().catch(console.error);
