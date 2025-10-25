import Database from 'better-sqlite3';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Singleton pattern for Database
const globalForDb = globalThis as unknown as {
  db: Database.Database | undefined;
};

const dbPath = process.env.DATABASE_URL?.replace('file:', '') || join(process.cwd(), 'dev.db');

export const db =
  globalForDb.db ??
  new Database(dbPath, {
    verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

// Helper functions for common database operations
export const dbHelpers = {
  // Get all rows from a table
  getAll: (table: string) => {
    return db.prepare(`SELECT * FROM ${table}`).all();
  },

  // Get a single row by ID
  getById: (table: string, id: string) => {
    return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
  },

  // Insert a row
  insert: (table: string, data: Record<string, any>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    return db.prepare(sql).run(...values);
  },

  // Update a row
  update: (table: string, id: string, data: Record<string, any>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    return db.prepare(sql).run(...values, id);
  },

  // Delete a row
  delete: (table: string, id: string) => {
    return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  },
};

export default db;

