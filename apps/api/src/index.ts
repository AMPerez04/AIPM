import express from 'express';
import dotenv from 'dotenv';
import { db } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Database health check
app.get('/health/db', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

// TODO: Add routes
// - POST /tickets
// - GET /tickets/:id
// - POST /webhooks/call
// - POST /webhooks/sms
// - POST /vendors/:id/ping
// - POST /appointments
// - POST /notify

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});

