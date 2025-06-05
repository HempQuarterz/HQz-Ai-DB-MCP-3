import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Connect to Replit-hosted PostgreSQL database
console.log('Connecting to Replit PostgreSQL database...');

// Create a connection pool to the PostgreSQL database using Replit's DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
    console.error('Make sure the DATABASE_URL environment variable is properly set.');
  } else {
    console.log(`Successfully connected to Replit database! Server time: ${res.rows[0].now}`);
  }
});

// Export the drizzle instance with the configured pool and schema
export const db = drizzle(pool, { schema });