import { createClient } from '@supabase/supabase-js';

// Get credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase credentials!');
  console.error('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment.');
}

// Create and export the Supabase client
console.log(`Creating Supabase client with URL: ${supabaseUrl}`);
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase.from('plant_types').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection test successful!');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Supabase connection error:', errorMessage);
  }
})();

export default supabase;