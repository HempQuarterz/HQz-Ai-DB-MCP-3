import { createClient } from '@supabase/supabase-js';

// Function to list all tables in the Supabase database
async function listSupabaseTables() {
  // Get credentials from environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    return;
  }

  console.log('Creating Supabase client to inspect tables...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Use Supabase's RPC function to get all tables in the public schema
    const { data, error } = await supabase.rpc('list_tables');

    if (error) {
      console.error('Error listing tables:', error.message);
      
      // Fallback method if RPC fails
      console.log('Trying alternative method to list tables...');
      const { data: tableData, error: tableError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
        
      if (tableError) {
        console.error('Alternative method failed:', tableError.message);
      } else {
        console.log('Tables in Supabase database:', tableData);
      }
    } else {
      console.log('Tables in Supabase database:', data);
    }
    
    // Try a direct query to check for hemp tables specifically
    const { data: hempTables, error: hempError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .ilike('tablename', '%hemp%');
      
    if (hempError) {
      console.error('Error searching for hemp tables:', hempError.message);
    } else {
      console.log('Hemp-related tables found:', hempTables);
    }
  } catch (err) {
    console.error('Error inspecting Supabase tables:',
      err instanceof Error ? err.message : String(err));
  }
}

// Run the inspection
listSupabaseTables();