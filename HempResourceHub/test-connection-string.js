import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a local .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Using the connection string format from Supabase with sslmode=no-verify
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL in environment variables');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  // Disable SSL verification (only for testing)
  ssl:
    process.env.PGSSLMODE === 'disable'
      ? false
      : { rejectUnauthorized: false },
});

console.log('Testing database connection with connection string...');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Success! Database time:', res.rows[0].now);
  }
  pool.end();
});
