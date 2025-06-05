import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

console.log('Attempting direct connection to Supabase with SSL disabled...');

// Try connecting with a direct connection string with SSL disabled
// This is sometimes necessary to bypass self-signed certificate errors
const directConnectionString = `postgresql://postgres:${encodeURIComponent(process.env.DB_PASSWORD || '#4HQZgasswo')}@db.lnclfnomfnoaqpatmqhj.supabase.co:5432/postgres?sslmode=disable`;

// Create a direct pool without SSL
const directPool = new Pool({
  connectionString: directConnectionString,
});

// Test the direct connection
directPool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Direct connection error:', err);
    console.error('Error message:', err.message);
    
    // Try a different approach if the first fails
    const secondaryPool = new Pool({
      host: 'db.lnclfnomfnoaqpatmqhj.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: process.env.DB_PASSWORD || '#4HQZgasswo',
      // No SSL option at all
    });
    
    secondaryPool.query('SELECT NOW()', (err2, res2) => {
      if (err2) {
        console.error('Secondary connection also failed:', err2.message);
      } else {
        console.log('Secondary connection successful!', res2.rows[0].now);
      }
    });
    
  } else {
    console.log('Direct connection successful! Server time:', res.rows[0].now);
  }
});

export const directDb = drizzle(directPool, { schema });