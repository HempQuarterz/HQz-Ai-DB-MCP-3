import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { supabase } from './supabase-client';

console.log('Configuring database connection...');

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log(`Successfully connected to database! Server time: ${res.rows[0].now}`);
  }
});

// Export the Drizzle instance
export const db = drizzle(pool, { schema });
export { pool, supabase };