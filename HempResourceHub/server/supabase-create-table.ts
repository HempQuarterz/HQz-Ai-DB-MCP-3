import { createClient } from '@supabase/supabase-js';

// Create Supabase client with the provided credentials
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Attempting to connect to Supabase...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by creating a simple table
async function testCreateTable() {
  try {
    // Test with a very simple query first
    const { data: versionData, error: versionError } = await supabase
      .rpc('version');
    
    if (versionError) {
      console.error('Error checking Supabase version:', versionError.message);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Server version:', versionData);
    
    // Check if we have the right permissions
    console.log('Checking if we can create tables...');
    const { error } = await supabase
      .from('test_connection')
      .insert({ name: 'test' });
      
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist, which is expected
        console.log('Table test_connection does not exist, which is expected.');
        
        // Try to create the table
        console.log('Attempting to create table with SQL...');
        const { error: sqlError } = await supabase
          .rpc('exec_sql', {
            sql: `CREATE TABLE IF NOT EXISTS test_connection (id SERIAL PRIMARY KEY, name TEXT)`
          });
          
        if (sqlError) {
          console.error('Failed to create table with SQL:', sqlError.message);
        } else {
          console.log('Table created successfully!');
        }
      } else {
        console.error('Error inserting test data:', error.message);
      }
    } else {
      console.log('Insert successful, table already exists.');
    }
  } catch (err) {
    console.error('Error testing Supabase connection:',
      err instanceof Error ? err.message : String(err));
  }
}

// Run the test
testCreateTable();