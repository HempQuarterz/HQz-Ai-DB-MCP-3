import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = createClient(
  supabaseUrl || '',
  supabaseKey || ''
);

// Create a PostgreSQL pool that connects to Supabase
// Using the connection string from the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
async function testConnection() {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Successfully connected to Supabase database!', rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Export the drizzle instance with the configured pool and schema
export const db = drizzle(pool, { schema });
export { supabase, testConnection };