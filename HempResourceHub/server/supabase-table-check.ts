import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Creating Supabase client to check available tables...');
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to check if a table exists
async function checkTable(tableName: string) {
  try {
    const { data, error, status } = await supabase
      .from(tableName)
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error(`Table '${tableName}' check failed:`, error.message);
      return false;
    } else {
      console.log(`Table '${tableName}' exists! Count: ${data}`);
      return true;
    }
  } catch (err) {
    console.error(`Error checking table '${tableName}':`, 
      err instanceof Error ? err.message : String(err));
    return false;
  }
}

// Check common table names for hemp data
async function checkTables() {
  const tablesToCheck = [
    'hemp_plants',
    'hemp_plant_archetypes',
    'hemp_plant_types',
    'hemp_categories',
    'plant_types',
    'plants',
    'plant_archetypes',
    'hemp',
    'plants_hemp',
    'hemp_data'
  ];
  
  console.log('Checking for tables in Supabase database...');
  
  for (const table of tablesToCheck) {
    const exists = await checkTable(table);
    console.log(`${table}: ${exists ? 'EXISTS' : 'NOT FOUND'}`);
  }
}

// Run the check
checkTables();