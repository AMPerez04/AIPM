import { writeFileSync, existsSync } from 'fs';
import { readFileSync } from 'fs';
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const dbPath = join(rootDir, 'dev.db');
const schemaPath = join(rootDir, 'prisma', 'migrations', '20250101000000_init', 'migration.sql');

console.log('📦 Initializing SQLite database...\n');

try {
  // Read the migration SQL
  const migrationSQL = readFileSync(schemaPath, 'utf-8');
  
  // Remove old database if exists
  if (existsSync(dbPath)) {
    console.log('  Found existing database, removing...');
    writeFileSync(dbPath, '');
  }
  
  // Create database and run migration
  console.log('  Creating database...');
  const db = new Database(dbPath);
  
  console.log('  Running migration...');
  db.exec(migrationSQL);
  
  db.close();
  
  console.log('✅ Database initialized successfully!');
  console.log(`📍 Database location: ${dbPath}\n`);
  
  console.log('🎉 Next steps:');
  console.log('  1. Run: pnpm db:seed (to populate with sample data)');
  console.log('  2. Run: pnpm dev (to start the application)');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

