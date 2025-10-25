#!/usr/bin/env node

/**
 * Twilio SMS Tester Script
 * 
 * This script sends a test SMS message to a given phone number using Twilio.
 * Make sure to set up your .env file with the required Twilio credentials.
 * 
 * Usage:
 *   node twilio-tester.js <phone_number> [message]
 * 
 * Example:
 *   node twilio-tester.js +1234567890 "Hello from AIPM!"
 */

import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\nPlease check your .env file and ensure all Twilio credentials are set.');
  console.error('You can copy env.template to .env and fill in your Twilio values.');
  process.exit(1);
}

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Usage: node twilio-tester.js <phone_number> [message]');
  console.error('   Example: node twilio-tester.js +1234567890 "Hello from AIPM!"');
  process.exit(1);
}

const phoneNumber = args[0];
const customMessage = args[1];

// Default message if none provided
const defaultMessage = `🚀 Test SMS from AIPM!
This is a test message sent at ${new Date().toLocaleString()}.
If you received this, Twilio SMS integration is working correctly!`;

const message = customMessage || defaultMessage;

// Validate phone number format (basic validation)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
  console.error('❌ Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
  process.exit(1);
}

console.log('📱 Twilio SMS Tester');
console.log('==================');
console.log(`📞 To: ${phoneNumber}`);
console.log(`📤 From: ${process.env.TWILIO_PHONE_NUMBER}`);
console.log(`💬 Message: ${message}`);
console.log('');

// Send the SMS
try {
  console.log('⏳ Sending SMS...');
  
  const messageResponse = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });

  console.log('✅ SMS sent successfully!');
  console.log(`📋 Message SID: ${messageResponse.sid}`);
  console.log(`📊 Status: ${messageResponse.status}`);
  console.log(`💰 Price: ${messageResponse.price || 'N/A'}`);
  console.log(`🌍 Price Unit: ${messageResponse.priceUnit || 'N/A'}`);
  
} catch (error) {
  console.error('❌ Failed to send SMS:');
  console.error(`   Error: ${error.message}`);
  
  if (error.code) {
    console.error(`   Code: ${error.code}`);
  }
  
  if (error.moreInfo) {
    console.error(`   More Info: ${error.moreInfo}`);
  }
  
  console.error('\nCommon issues:');
  console.error('   - Check your Twilio credentials in .env');
  console.error('   - Verify the phone number format');
  console.error('   - Ensure your Twilio account has sufficient balance');
  console.error('   - Check if the destination number is verified (for trial accounts)');
  
  process.exit(1);
}
