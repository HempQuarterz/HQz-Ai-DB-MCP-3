import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Simple test function to check the connection
export async function testSupabaseConnection() {
  try {
    // Attempt to get data from a table
    const { data, error } = await supabase
      .from('plant_types')
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