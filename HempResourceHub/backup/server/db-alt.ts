import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

console.log('Attempting alternative connection to Supabase PostgreSQL...');

// Build connection string
const dbPassword = process.env.DB_PASSWORD || '#4HQZgasswo';
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.lnclfnomfnoaqpatmqhj.supabase.co:5432/postgres`;

// Connection pool using connection string
const poolAlt = new Pool({
  connectionString,
  ssl: {
    // Only this setting is needed to handle self-signed certificate in chain
    rejectUnauthorized: false
  }
});

// Test the connection
poolAlt.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Alternative database connection error:', err);
  } else {
    console.log('Alternative connection successful! Server time:', res.rows[0].now);
  }
});

export const dbAlt = drizzle(poolAlt, { schema });