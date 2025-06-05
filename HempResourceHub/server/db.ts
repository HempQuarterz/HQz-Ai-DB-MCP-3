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
  console.warn('DATABASE_URL environment variable is not set. Skipping database connection.');
} else {
  console.log('Using database URL:', process.env.DATABASE_URL);
}

let db: any;

if (process.env.NODE_ENV !== 'test' && process.env.DATABASE_URL) {
  const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };

  const pool = new Pool(connectionConfig);

  // Test the connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err);
      console.error('Error details:', err.message);
      console.warn('WARNING: Server database connection failed. Running in client-only mode.');
      console.warn('The frontend will connect directly to Supabase.');
      // Don't throw error, just warn
    } else {
      console.log(`Successfully connected to database! Server time: ${res.rows[0].now}`);
    }
  });

  db = drizzle(pool, { schema });
} else {
  console.log('Test environment detected, skipping database connection.');
  db = {};
}

export { db };