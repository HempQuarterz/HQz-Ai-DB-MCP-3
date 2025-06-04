import { Pool } from 'pg';

// Using the connection string format from Supabase with sslmode=no-verify
const connectionString = `postgresql://postgres:${encodeURIComponent(process.env.DB_PASSWORD || '')}@db.lnclfnomfnoaqpatmqhj.supabase.co:5432/postgres?sslmode=no-verify`;

const pool = new Pool({
  connectionString,
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
