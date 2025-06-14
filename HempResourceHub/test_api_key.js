#!/usr/bin/env node

/**
 * API Key Diagnostic Script
 * Tests if the Gemini API key is properly configured
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiKey() {
  console.log('🔍 Testing Gemini API Key Configuration');
  console.log('=' .repeat(50));
  
  try {
    // Test with explicit provider to get error details
    console.log('🧪 Testing Edge Function with explicit Imagen 3...');
    
    const { data, error } = await supabase.functions.invoke('hemp-image-generator', {
      body: {
        batchSize: 1,
        provider: 'imagen_3'
      }
    });
    
    if (error) {
      console.log('❌ Edge Function Error:', error);
      return false;
    }
    
    console.log('📋 Edge Function Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if it actually used Imagen 3
    if (data.results && data.results.providerStats) {
      const providers = Object.keys(data.results.providerStats);
      console.log('\n🤖 Providers Used:', providers);
      
      if (providers.includes('imagen_3')) {
        console.log('✅ SUCCESS: Imagen 3 is working!');
        return true;
      } else if (providers.includes('placeholder')) {
        console.log('⚠️ FALLBACK: Still using placeholder');
        console.log('💡 This means GEMINI_API_KEY is not found by the Edge Function');
        return false;
      }
    }
    
    // If we processed items but no cost, it's using placeholder
    if (data.results && data.results.totalCost === 0) {
      console.log('⚠️ Zero cost = placeholder provider used');
      console.log('💡 Gemini API key not detected by Edge Function');
      return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    return false;
  }
}

async function checkSupabaseSecrets() {
  console.log('\n🔐 Edge Function Secrets Check:');
  console.log('📍 Go to: Supabase Dashboard → Project Settings → Edge Functions');
  console.log('🔑 Required secret: GEMINI_API_KEY = your_api_key_here');
  console.log('⚠️ Secret name must be EXACTLY: GEMINI_API_KEY (case-sensitive)');
  console.log('');
  console.log('📝 Steps to add secret:');
  console.log('1. Open Supabase Dashboard');
  console.log('2. Go to Project Settings (gear icon)');
  console.log('3. Click "Edge Functions" in left menu');
  console.log('4. Click "Add Secret" button');
  console.log('5. Name: GEMINI_API_KEY');
  console.log('6. Value: your_actual_gemini_api_key');
  console.log('7. Click "Add Secret"');
  console.log('');
  console.log('🔗 Get Gemini API key: https://aistudio.google.com/app/apikey');
}

async function main() {
  console.log('🌿 Hemp Resource Hub - API Key Diagnostic');
  console.log('');
  
  const isWorking = await testApiKey();
  
  if (isWorking) {
    console.log('\n🎉 Gemini API Key is working correctly!');
    console.log('🚀 You can now generate real AI images');
    console.log('💰 Cost: $0.02 per image with Imagen 3');
    
    // Estimate remaining cost
    const { data: pending } = await supabase
      .from('image_generation_queue')
      .select('id')
      .eq('status', 'pending');
    
    if (pending) {
      const cost = pending.length * 0.02;
      console.log(`📊 ${pending.length} items remaining = ~$${cost.toFixed(2)} total cost`);
    }
  } else {
    console.log('\n❌ Gemini API Key not working');
    checkSupabaseSecrets();
    
    console.log('\n🔄 After adding the secret:');
    console.log('1. Wait 1-2 minutes for Edge Function to reload');
    console.log('2. Run this test again: node test_api_key.js');
    console.log('3. If working, generate images: node trigger_image_generation.js');
  }
}

main().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('💥 Diagnostic failed:', error);
  process.exit(1);
});