import { supabase } from './supabase-connection';

// This file checks the existing Supabase tables and maps them to our application schema

async function checkSupabaseTables() {
  console.log('Checking existing Supabase tables...');
  
  try {
    // Check for hemp_plant_archtypes table
    const { data: plantTypes, error: plantTypesError } = await supabase
      .from('hemp_plant_archtypes')
      .select('*')
      .limit(1);
      
    if (plantTypesError) {
      console.error('Error accessing hemp_plant_archtypes:', plantTypesError.message);
    } else {
      console.log('Successfully accessed hemp_plant_archtypes table!');
      console.log('Sample data:', plantTypes);
    }
    
    // List all tables in the schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
      
    if (tablesError) {
      console.error('Error listing tables:', tablesError.message);
    } else {
      console.log('Tables in Supabase database:', tables);
    }
    
  } catch (err) {
    console.error('Error checking Supabase tables:', 
      err instanceof Error ? err.message : String(err));
  }
}

// Run the check
checkSupabaseTables();

export default checkSupabaseTables;