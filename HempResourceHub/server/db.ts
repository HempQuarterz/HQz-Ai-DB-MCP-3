import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Log that we're connecting to the database
console.log('Connecting to PostgreSQL database...');

import path from 'path';

// Ensure dotenv is loaded first
const dotenv = await import('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

console.log('Using database URL:', process.env.DATABASE_URL);

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: process.env.SSL_CERT
  }
};

// Create the connection pool with the Supabase configuration
const pool = new Pool(connectionConfig);

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Error details:', err.message);
    throw new Error('Failed to connect to database');
  }
  console.log(`Successfully connected to database! Server time: ${res.rows[0].now}`);
});

// Export the drizzle instance with the configured pool and schema
export const db = drizzle(pool, { schema });