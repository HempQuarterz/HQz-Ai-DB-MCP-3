import { Pool } from 'pg';

// This script connects to your Supabase PostgreSQL database
// and lists all existing tables to help us map the correct schema

async function listSupabaseTables() {
  console.log('Checking tables in your Supabase database...');
  
  try {
    // Connect to the database using DATABASE_URL environment variable
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    // Query to list all tables in the public schema
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('Tables found in your Supabase database:');
    
    if (rows.length === 0) {
      console.log('No tables found. The database appears to be empty.');
    } else {
      rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name}`);
      });
    }
    
    // For each table, try to get column information
    console.log('\nFetching table schemas:');
    
    for (const row of rows) {
      const tableName = row.table_name;
      
      try {
        const { rows: columns } = await pool.query(`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);
        
        console.log(`\nTable: ${tableName}`);
        console.log('Columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? 'nullable' : 'not nullable'})`);
        });
      } catch (err) {
        console.error(`Error fetching columns for table ${tableName}:`, err);
      }
    }
    
    // Close the connection
    await pool.end();
    
  } catch (err) {
    console.error('Error connecting to Supabase database:', err);
  }
}

// Run the function
listSupabaseTables();