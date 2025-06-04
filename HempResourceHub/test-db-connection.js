import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from a local .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Connection configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl:
    process.env.PGSSLMODE === 'disable'
      ? false
      : { rejectUnauthorized: false },
});

// Test the connection
console.log('Testing database connection...');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection error:', err);
  } else {
    console.log('Success! Database time:', res.rows[0].now);
  }
  pool.end();
});
