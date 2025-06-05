import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || 'https://lnclfnomfnoaqpatmqhj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuY2xmbm9tZm5vYXFwYXRtcWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTYwMTksImV4cCI6MjA1MjU5MjAxOX0.PF2Yp2Zyaxqrx6jcPYv_xuou_NDwOT949sRwGz3tPPc';

console.log('Attempting to connect using the Supabase client directly...');

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection using Supabase client
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('plant_types').select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase client connection error:', error);
    } else {
      console.log('Supabase client connection successful!');
    }
  } catch (err) {
    console.error('Unexpected error when testing Supabase connection:', err);
  }
}

// Run the test
testSupabaseConnection();

// Export the client
export default supabase;