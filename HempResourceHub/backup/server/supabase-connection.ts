import { createClient } from '@supabase/supabase-js';

// Check for environment variables
console.log('Setting up Supabase connection...');

// The correct way to access Supabase credentials
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase credentials.');
  console.error('Please make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment.');
  throw new Error('Missing Supabase credentials');
}

// Log URL (without exposing full credentials)
const displayUrl = url.substring(0, 15) + '...';
console.log(`Connecting to Supabase at ${displayUrl}`);

// Create the Supabase client
export const supabase = createClient(url, key);

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('plant_types').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Error testing Supabase connection:', err instanceof Error ? err.message : String(err));
    return false;
  }
}

// Run the test
testConnection();

export default supabase;