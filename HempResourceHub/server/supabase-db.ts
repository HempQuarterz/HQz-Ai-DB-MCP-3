import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

console.log('Connecting to Supabase PostgreSQL database...');

// Create a connection pool to Supabase PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to Supabase database:', err.message);
  } else {
    console.log(`Successfully connected to Supabase database! Server time: ${res.rows[0].now}`);
    
    // Check if tables exist
    pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `, (tableErr, tableRes) => {
      if (tableErr) {
        console.error('Error checking tables:', tableErr.message);
      } else {
        console.log('Tables in Supabase database:');
        tableRes.rows.forEach((row, i) => console.log(`${i+1}. ${row.table_name}`));
      }
    });
  }
});

// Drizzle ORM instance connected to Supabase
export const db = drizzle(pool, { schema });