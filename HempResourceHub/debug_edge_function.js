#!/usr/bin/env node

/**
 * Debug Edge Function Environment
 * Tests what environment variables are available to the Edge Function
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugEdgeFunction() {
  console.log('🔍 Debug Edge Function Environment');
  console.log('=' .repeat(50));
  
  try {
    // Create a simple test function call to see environment
    console.log('🧪 Testing Edge Function environment access...');
    
    const { data, error } = await supabase.functions.invoke('hemp-image-generator', {
      body: {
        debug: true,
        test: 'environment_check'
      }
    });
    
    if (error) {
      console.log('❌ Edge Function Error:', error);
      return;
    }
    
    console.log('📋 Edge Function Debug Response:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

// Also test if we can deploy a simple debug version
async function createDebugEdgeFunction() {
  console.log('\n💡 Alternative: Create Debug Edge Function');
  console.log('You can create a simple test function to check environment:');
  console.log('');
  console.log('// supabase/functions/debug-env/index.ts');
  console.log(`
serve(async (req) => {
  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  
  return new Response(JSON.stringify({
    hasGeminiKey: !!geminiKey,
    keyLength: geminiKey ? geminiKey.length : 0,
    keyPreview: geminiKey ? geminiKey.substring(0, 10) + '...' : 'Not found',
    allEnvVars: Object.keys(Deno.env.toObject())
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
  `);
  
  console.log('\nThen deploy with: supabase functions deploy debug-env');
}

async function main() {
  console.log('🌿 Hemp Resource Hub - Edge Function Debug');
  console.log('');
  
  await debugEdgeFunction();
  await createDebugEdgeFunction();
  
  console.log('\n🔧 Manual Check Steps:');
  console.log('1. Go to Supabase Dashboard');
  console.log('2. Settings → Edge Functions');
  console.log('3. Look for "GEMINI_API_KEY" in the secrets list');
  console.log('4. Make sure the value starts with "AIza" (typical Gemini key format)');
  console.log('5. Try deleting and re-adding the secret');
  console.log('6. Wait 2-3 minutes after adding');
  
  console.log('\n🎯 Alternative Solution:');
  console.log('If Edge Function secrets aren\'t working, we can:');
  console.log('1. Use a different provider (DALL-E, Stable Diffusion)');
  console.log('2. Test with placeholder images to verify the UI workflow');
  console.log('3. Debug the Edge Function deployment');
}

main().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('💥 Debug failed:', error);
  process.exit(1);
});