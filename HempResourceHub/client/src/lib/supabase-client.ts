import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

// Ensure URL has https:// protocol
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  supabaseUrl = `https://${supabaseUrl}`;
}

// Debug logging
console.log('Supabase initialization:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseKey ? `${supabaseKey.substring(0, 30)}...` : 'MISSING',
  envVars: import.meta.env
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Available env vars:', Object.keys(import.meta.env));
  console.error('Make sure your .env file contains:');
  console.error('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=your-anon-key');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Simple test function to check the connection
export async function testSupabaseConnection() {
  try {
    // Attempt to get data from a table
    const { data, error } = await supabase
      .from('hemp_plant_archetypes')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection error:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Error testing Supabase connection:', 
      err instanceof Error ? err.message : String(err));
    return { success: false, message: String(err) };
  }
}

export default supabase;