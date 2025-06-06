import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Disable SSL verification (only for testing)
  ssl: {
    rejectUnauthorized: false
  }
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
