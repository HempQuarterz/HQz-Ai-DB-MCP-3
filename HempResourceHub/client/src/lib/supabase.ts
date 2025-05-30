import { createClient } from '@supabase/supabase-js';

// Get the environment variables from import.meta.env (Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lnclfnomfnoaqpatmqhj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuY2xmbm9tZm5vYXFwYXRtcWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTYwMTksImV4cCI6MjA1MjU5MjAxOX0.PF2Yp2Zyaxqrx6jcPYv_xuou_NDwOT949sRwGz3tPPc';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized with URL:', supabaseUrl);

export default supabase;