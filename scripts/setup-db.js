// Setup script to initialize Prisma and database
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('📦 Setting up Prisma and SQLite database...\n');

try {
  // Step 1: Generate Prisma Client
  console.log('1️⃣ Generating Prisma Client...');
  execSync('npx prisma generate --schema=prisma/schema.prisma', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✅ Prisma Client generated\n');

  // Step 2: Create initial migration
  console.log('2️⃣ Creating initial migration...');
  execSync('npx prisma migrate dev --name init --schema=prisma/schema.prisma', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✅ Migration created\n');

  // Step 3: Seed database
  console.log('3️⃣ Seeding database...');
  execSync('npx tsx prisma/seed.ts', {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('✅ Database seeded\n');

  console.log('🎉 Database setup complete!');
  console.log('\nYou can now:');
  console.log('  - Run: pnpm dev');
  console.log('  - Open Prisma Studio: pnpm db:studio');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}

