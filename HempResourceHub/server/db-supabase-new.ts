import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { supabase } from './supabase-connection';

// Try to connect to the Supabase database using the DATABASE_URL
console.log('Connecting to Supabase PostgreSQL database');

// Create a connection pool using DATABASE_URL for direct DB access
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test the direct database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Direct database connection error:', err.message);
    console.log('Will use Supabase client for data access instead.');
  } else {
    console.log(`Successfully connected to database directly! Server time: ${res.rows[0].now}`);
  }
});

// Export the drizzle instance with the configured pool and schema
export const db = drizzle(pool, { schema });
export { supabase };