// Simple test to verify Supabase connectivity
import https from 'https';
import dns from 'dns';

const SUPABASE_URL = 'https://lnclfnomfnoaqpatmqhj.supabase.co';
const DB_HOST = 'db.lnclfnomfnoaqpatmqhj.supabase.co';

console.log('Testing Supabase connectivity...\n');

// Test 1: Check if main Supabase URL is accessible
https.get(SUPABASE_URL, (res) => {
  console.log(`✓ Main Supabase URL (${SUPABASE_URL}): Status ${res.statusCode}`);
}).on('error', (err) => {
  console.log(`✗ Main Supabase URL (${SUPABASE_URL}): ${err.message}`);
});

// Test 2: DNS lookup for database host
dns.lookup(DB_HOST, (err, address) => {
  if (err) {
    console.log(`✗ Database host DNS lookup (${DB_HOST}): ${err.message}`);
    console.log('\nPossible issues:');
    console.log('1. The Supabase project ID might be incorrect');
    console.log('2. The project might be paused or deleted');
    console.log('3. Check your Supabase dashboard at https://supabase.com/dashboard');
  } else {
    console.log(`✓ Database host DNS lookup (${DB_HOST}): Resolved to ${address}`);
  }
});

// Test 3: Try to fetch from REST API
https.get(`${SUPABASE_URL}/rest/v1/`, {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuY2xmbm9tZm5vYXFwYXRtcWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcwMTYwMTksImV4cCI6MjA1MjU5MjAxOX0.PF2Yp2Zyaxqrx6jcPYv_xuou_NDwOT949sRwGz3tPPc'
  }
}, (res) => {
  console.log(`✓ Supabase REST API: Status ${res.statusCode}`);
}).on('error', (err) => {
  console.log(`✗ Supabase REST API: ${err.message}`);
});