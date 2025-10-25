#!/usr/bin/env node

/**
 * API Testing Script
 * 
 * This script tests all the backend API endpoints to ensure they're working correctly.
 * Run this after starting the API server to verify functionality.
 * 
 * Usage:
 *   node api-tester.js
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

// Helper function to make API requests
async function apiRequest(endpoint: string, options: any = {}): Promise<any> {
  const url = `${API_BASE}${endpoint}`;
  console.log(`📡 ${options.method || 'GET'} ${endpoint}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      console.error(data);
      return null;
    }
    
    console.log(`✅ Success:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Request failed:`, error.message);
    return null;
  }
}

// Test functions
async function testHealthChecks() {
  console.log('\n🏥 Testing Health Checks');
  console.log('========================');
  
  await apiRequest('/health');
  await apiRequest('/health/db');
}

async function testVendors() {
  console.log('\n🔧 Testing Vendor Endpoints');
  console.log('===========================');
  
  // Get all vendors
  const vendors = await apiRequest('/vendors') as any[];
  
  if (vendors && vendors.length > 0) {
    console.log(`Found ${vendors.length} vendors`);
    
    // Test creating a new vendor
    const newVendor = await apiRequest('/vendors', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Vendor',
        phones: ['+1234567899'],
        specialties: ['plumbing'],
        hours: '9AM-5PM',
        priority: 5,
        notes: 'Test vendor for API testing',
      }),
    });
    
    if (newVendor) {
      console.log('✅ Created test vendor:', newVendor.id);
    }
  }
}

async function testTickets() {
  console.log('\n🎫 Testing Ticket Endpoints');
  console.log('===========================');
  
  // Get all tickets
  const tickets = await apiRequest('/tickets');
  
  if (tickets && tickets.length > 0) {
    console.log(`Found ${tickets.length} tickets`);
    
    // Test getting a specific ticket
    const firstTicket = tickets[0];
    await apiRequest(`/tickets/${firstTicket.id}`);
    
    // Test creating a new ticket
    const newTicket = await apiRequest('/tickets', {
      method: 'POST',
      body: JSON.stringify({
        tenantId: firstTicket.tenantId,
        propertyId: firstTicket.propertyId,
        category: 'hvac',
        severity: 'routine',
        description: 'Air conditioning not working properly',
        window: 'tomorrow 2PM-4PM',
        notes: 'Created via API test',
      }),
    });
    
    if (newTicket) {
      console.log('✅ Created test ticket:', newTicket.id);
      
      // Test getting the new ticket
      await apiRequest(`/tickets/${newTicket.id}`);
    }
  }
}

async function testAppointments() {
  console.log('\n📅 Testing Appointment Endpoints');
  console.log('===============================');
  
  // Get tickets to create an appointment
  const tickets = await apiRequest('/tickets');
  const vendors = await apiRequest('/vendors');
  
  if (tickets && tickets.length > 0 && vendors && vendors.length > 0) {
    const ticket = tickets[0];
    const vendor = vendors[0];
    
    // Create an appointment
    const appointment = await apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        ticketId: ticket.id,
        vendorId: vendor.id,
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'tentative',
        confirmationMethod: 'sms',
      }),
    });
    
    if (appointment) {
      console.log('✅ Created test appointment:', appointment.id);
    }
  }
}

async function testNotifications() {
  console.log('\n📱 Testing Notification Endpoints');
  console.log('=================================');
  
  // Test sending a notification (this will fail if Twilio isn't configured)
  const notification = await apiRequest('/notify', {
    method: 'POST',
    body: JSON.stringify({
      to: '+1234567890',
      message: 'Test notification from API tester',
      type: 'tenant',
    }),
  });
  
  if (notification) {
    console.log('✅ Sent test notification');
  } else {
    console.log('⚠️  Notification test failed (likely due to Twilio configuration)');
  }
}

async function testVendorPing() {
  console.log('\n📞 Testing Vendor Ping Endpoints');
  console.log('================================');
  
  const tickets = await apiRequest('/tickets');
  const vendors = await apiRequest('/vendors');
  
  if (tickets && tickets.length > 0 && vendors && vendors.length > 0) {
    const ticket = tickets[0];
    const vendor = vendors[0];
    
    // Test pinging a vendor
    const pingResult = await apiRequest(`/vendors/${vendor.id}/ping`, {
      method: 'POST',
      body: JSON.stringify({
        ticketId: ticket.id,
        method: 'sms',
      }),
    });
    
    if (pingResult) {
      console.log('✅ Pinged vendor successfully');
    } else {
      console.log('⚠️  Vendor ping failed (likely due to Twilio configuration)');
    }
  }
}

async function testEvents() {
  console.log('\n📡 Testing Event Queue');
  console.log('=====================');
  
  // Get pending events
  const events = await apiRequest('/events');
  
  if (events) {
    console.log(`Found ${events.count} pending events`);
    
    // Process an event if available
    if (events.count > 0) {
      await apiRequest('/events/process', {
        method: 'POST',
      });
    }
  }
}

async function testMetrics() {
  console.log('\n📊 Testing Metrics');
  console.log('=================');
  
  const metrics = await apiRequest('/metrics');
  
  if (metrics) {
    console.log('System Metrics:');
    console.log(`- Total Tickets: ${metrics.tickets.total}`);
    console.log(`- Open Tickets: ${metrics.tickets.open}`);
    console.log(`- Scheduled Tickets: ${metrics.tickets.scheduled}`);
    console.log(`- Closed Tickets: ${metrics.tickets.closed}`);
    console.log(`- Total Appointments: ${metrics.appointments.total}`);
    console.log(`- Confirmed Appointments: ${metrics.appointments.confirmed}`);
    console.log(`- Pending Events: ${metrics.events.pending}`);
  }
}

async function testWebhooks() {
  console.log('\n🔗 Testing Webhook Endpoints');
  console.log('============================');
  
  // Test SMS webhook (simulate incoming SMS)
  const webhookResult = await apiRequest('/webhooks/sms', {
    method: 'POST',
    body: JSON.stringify({
      From: '+1234567890',
      Body: 'YES 3pm',
      MessageSid: 'test_message_sid',
    }),
  });
  
  if (webhookResult) {
    console.log('✅ SMS webhook processed');
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 API Testing Suite');
  console.log('===================');
  console.log(`Testing API at: ${API_BASE}`);
  console.log('');
  
  try {
    await testHealthChecks();
    await testVendors();
    await testTickets();
    await testAppointments();
    await testNotifications();
    await testVendorPing();
    await testEvents();
    await testMetrics();
    await testWebhooks();
    
    console.log('\n🎉 All tests completed!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check the API server logs for any errors');
    console.log('2. Verify Twilio configuration if SMS tests failed');
    console.log('3. Test the frontend dashboard to see the data');
    console.log('4. Run the Twilio tester script to send real SMS messages');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exit(1);
  }
}

// Check if API server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    // Server not running
  }
  return false;
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error('❌ API server is not running!');
    console.error('Please start the API server first:');
    console.error('  cd apps/api');
    console.error('  pnpm dev');
    process.exit(1);
  }
  
  await runTests();
}

main().catch(console.error);
