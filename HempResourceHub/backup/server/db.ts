import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import { supabase } from './supabase';

// First try to connect to Supabase using the database connection string
console.log('Connecting to Supabase PostgreSQL database');

const supabaseDirectUrl = process.env.DIRECT_SUPABASE_HOST;

// Create a pool using the connection string format
// Format: postgres://{user}:{password}@{host}:{port}/{database}
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    console.error('Error details:', err.message);
    console.error('Attempting alternative connection to Supabase PostgreSQL...');
    
    // Try an alternative approach if the first one fails
    try {
      const poolAlt = new Pool({
        host: supabaseDirectUrl,
        port: 5432,
        database: 'postgres',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
      poolAlt.query('SELECT NOW()', (altErr, altRes) => {
        if (altErr) {
          console.error('Alternative database connection error:', altErr);
          console.error('Error message:', altErr.message);
          console.log('Secondary connection also failed:', altErr.message);
        } else {
          console.log('Successfully connected to Supabase database through alternative method!');
          console.log('Server time:', altRes.rows[0].now);
        }
      });
    } catch (directErr) {
      console.error('Direct connection error:', directErr);
    }
    
    // Also try using the Supabase client directly
    console.log('Attempting to connect using the Supabase client directly...');
    supabase.from('plant_types').select('*').limit(1)
      .then((response: any) => {
        console.log('Supabase client connection successful:', response);
      })
      .catch((err: { message: string }) => {
        console.error('Supabase client connection error:', { message: err.message || String(err) });
      });
  } else {
    console.log(`Successfully connected to database! Server time: ${res.rows[0].now}`);
  }
});

// Export the drizzle instance with the configured pool and schema
export const db = drizzle(pool, { schema });