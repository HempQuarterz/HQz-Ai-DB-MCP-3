import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current module's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing Supabase credentials in .env file');
  console.log('Make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file');
  process.exit(1);
}

console.log('Creating Supabase client...');
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Test endpoint
app.get('/api/health', async (req, res) => {
  console.log('Health check endpoint called');
  
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('plant_types')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to query Supabase',
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }
    
    console.log('Successfully connected to Supabase');
    res.json({ 
      status: 'ok', 
      message: 'Server is running and connected to Supabase',
      data: data || []
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Unexpected error in health check:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok', message: 'Test endpoint is working' });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=== Server Information ===`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`==========================\n`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
