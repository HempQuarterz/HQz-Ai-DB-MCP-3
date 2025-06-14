#!/usr/bin/env node

/**
 * Trigger Image Generation via Supabase Edge Function
 * This script triggers the hemp-image-generator Edge Function to process queued images
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.log('Required environment variables:');
  console.log('- SUPABASE_URL or VITE_SUPABASE_URL');
  console.log('- SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function triggerImageGeneration() {
  console.log('🌿 Triggering Hemp Image Generation');
  console.log('=' * 50);
  
  try {
    // Check queue status first
    const { data: queueStatus, error: queueError } = await supabase
      .from('image_generation_queue')
      .select('status')
      .eq('status', 'pending');
    
    if (queueError) {
      console.error('❌ Error checking queue:', queueError);
      return;
    }
    
    console.log(`📊 Found ${queueStatus.length} pending items in queue`);
    
    if (queueStatus.length === 0) {
      console.log('✅ No pending items to process');
      return;
    }
    
    // Trigger the Edge Function
    console.log('🚀 Triggering hemp-image-generator Edge Function...');
    
    const { data, error } = await supabase.functions.invoke('hemp-image-generator', {
      body: {
        mode: 'process_queue',
        batchSize: 5,
        provider: 'imagen_3' // Use Google Imagen 3 for high-quality images
      }
    });
    
    if (error) {
      console.error('❌ Error invoking Edge Function:', error);
      return;
    }
    
    console.log('✅ Edge Function Response:', data);
    
    // Check updated queue status
    const { data: updatedQueue, error: updatedError } = await supabase
      .from('image_generation_queue')
      .select('status')
      .eq('status', 'pending');
    
    if (!updatedError) {
      console.log(`📊 Queue now has ${updatedQueue.length} pending items`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function main() {
  console.log('🔌 Connecting to Supabase...');
  console.log(`📍 URL: ${supabaseUrl}`);
  
  // Test connection
  try {
    const { data, error } = await supabase
      .from('uses_products')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return;
    }
    
    console.log(`✅ Connected! Found ${data} products in database`);
    
    await triggerImageGeneration();
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

// Run the script
main().then(() => {
  console.log('🎉 Script completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});

export { triggerImageGeneration };