#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('=== Hemp Resource Hub Web App Tester ===\n');

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ 
        status: res.statusCode, 
        headers: res.headers,
        body: data 
      }));
    }).on('error', reject);
  });
}

async function testEndpoint(name, url) {
  console.log(`Testing ${name}...`);
  try {
    const result = await fetchUrl(url);
    console.log(`✓ Status: ${result.status}`);
    
    if (url.includes('/api/')) {
      // API endpoint - parse JSON
      try {
        const json = JSON.parse(result.body);
        if (json.error) {
          console.log(`⚠ API Error: ${json.error.message}`);
        } else if (Array.isArray(json)) {
          console.log(`✓ Response: Array with ${json.length} items`);
        } else {
          console.log(`✓ Response: ${JSON.stringify(json).substring(0, 100)}...`);
        }
      } catch (e) {
        console.log(`✓ Response length: ${result.body.length} bytes`);
      }
    } else {
      // HTML page
      const title = result.body.match(/<title>(.*?)<\/title>/)?.[1] || 'No title';
      console.log(`✓ Page title: ${title}`);
      console.log(`✓ Response length: ${result.body.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
  }
  console.log('');
}

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  
  // Test main pages
  await testEndpoint('Home Page', `${baseUrl}/`);
  await testEndpoint('Hemp Dex', `${baseUrl}/hemp-dex`);
  await testEndpoint('Debug Supabase', `${baseUrl}/debug-supabase`);
  await testEndpoint('Admin Page', `${baseUrl}/admin`);
  
  // Test API endpoints
  console.log('--- API Endpoints ---\n');
  await testEndpoint('Plant Types API', `${baseUrl}/api/plant-types`);
  await testEndpoint('Industries API', `${baseUrl}/api/industries`);
  await testEndpoint('Plant Parts API', `${baseUrl}/api/plant-parts`);
  await testEndpoint('Products API', `${baseUrl}/api/products`);
  await testEndpoint('Stats API', `${baseUrl}/api/stats`);
  
  console.log('=== Test Complete ===');
}

// Run tests
runTests().catch(console.error);