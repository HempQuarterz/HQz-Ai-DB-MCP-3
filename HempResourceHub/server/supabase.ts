import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '@shared/schema';

// Log environment variables for debugging (without exposing values)
console.log('Checking Supabase environment variables...');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Not present'}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Not present'}`);
console.log(`VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? 'Present' : 'Not present'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Not present'}`);

// Use environment variables safely
let supabaseUrl = '';
// Prioritize SUPABASE_URL, then VITE_SUPABASE_URL
if (process.env.SUPABASE_URL) {
  supabaseUrl = process.env.SUPABASE_URL;
} else if (process.env.VITE_SUPABASE_URL) {
  supabaseUrl = process.env.VITE_SUPABASE_URL;
} else if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')) {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
}

let supabaseKey = '';
// Prioritize SUPABASE_ANON_KEY, then VITE_SUPABASE_ANON_KEY
if (process.env.SUPABASE_ANON_KEY) {
  supabaseKey = process.env.SUPABASE_ANON_KEY;
} else if (process.env.VITE_SUPABASE_ANON_KEY) {
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
} else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.startsWith('http')) {
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

// Create a mock client if we're missing credentials
let supabase;

if (supabaseUrl && supabaseKey) {
  console.log('Creating Supabase client with provided credentials');
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client created successfully');
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    // Create a dummy client that logs operations but doesn't actually connect
    supabase = {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: { message: 'Supabase connection not available' } }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
      }),
      auth: {
        signIn: () => Promise.resolve({ user: null, error: { message: 'Supabase connection not available' } }),
        signOut: () => Promise.resolve({ error: { message: 'Supabase connection not available' } }),
      }
    };
  }
} else {
  console.error('Missing Supabase credentials. Please check your environment variables.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('Required: NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
  
  // Create a dummy client that logs operations but doesn't actually connect
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: { message: 'Supabase connection not available' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase connection not available' } }),
    }),
    auth: {
      signIn: () => Promise.resolve({ user: null, error: { message: 'Supabase connection not available' } }),
      signOut: () => Promise.resolve({ error: { message: 'Supabase connection not available' } }),
    }
  };
}

// Export the Supabase client
export { supabase };
export default supabase;