#!/usr/bin/env node

/**
 * Complete Image Generation Workflow
 * This script handles the entire process of generating images for the Hemp Resource Hub
 */

import { createClient } from '@supabase/supabase-js';
import { populateImageQueue } from './populate_image_queue.js';
import { triggerImageGeneration } from './trigger_image_generation.js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const CONFIG = {
  BATCH_SIZE: 5,
  DELAY_BETWEEN_BATCHES: 30000, // 30 seconds
  MAX_RETRIES: 3,
  PROVIDER: 'imagen_3' // Use Google Imagen 3
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkApiConfiguration() {
  console.log('🔍 Checking API Configuration...');
  
  // Check if Imagen 3 is configured in the database
  const { data: providerConfig, error } = await supabase
    .from('ai_provider_config')
    .select('*')
    .eq('provider_name', 'imagen_3')
    .eq('is_active', true)
    .single();
  
  if (error || !providerConfig) {
    console.error('❌ Imagen 3 provider not configured in database');
    console.log('💡 Make sure you have run the Imagen 3 setup script');
    return false;
  }
  
  console.log('✅ Imagen 3 provider configured');
  console.log(`   💰 Cost per image: $${providerConfig.cost_per_image}`);
  console.log(`   ⚡ Quality score: ${providerConfig.quality_score}/10`);
  
  return true;
}

async function monitorProgress() {
  const { data: queueStatus } = await supabase
    .from('image_generation_queue')
    .select('status')
    .in('status', ['pending', 'processing', 'completed', 'failed']);
  
  if (!queueStatus) return null;
  
  const pending = queueStatus.filter(q => q.status === 'pending').length;
  const processing = queueStatus.filter(q => q.status === 'processing').length;
  const completed = queueStatus.filter(q => q.status === 'completed').length;
  const failed = queueStatus.filter(q => q.status === 'failed').length;
  
  return { pending, processing, completed, failed, total: queueStatus.length };
}

async function updatePlantTypeImages() {
  console.log('🌿 Updating Plant Type Images...');
  
  // Get completed plant type images from queue
  const { data: completedQueue, error } = await supabase
    .from('image_generation_queue')
    .select('metadata, generated_image_url')
    .eq('status', 'completed')
    .not('generated_image_url', 'is', null)
    .contains('metadata', { type: 'plant_type' });
  
  if (error || !completedQueue?.length) {
    console.log('⚠️ No completed plant type images found');
    return;
  }
  
  let updated = 0;
  for (const item of completedQueue) {
    if (item.metadata?.plant_type_id && item.generated_image_url) {
      const { error: updateError } = await supabase
        .from('hemp_plant_archetypes')
        .update({ image_url: item.generated_image_url })
        .eq('id', item.metadata.plant_type_id);
      
      if (!updateError) {
        updated++;
      }
    }
  }
  
  console.log(`✅ Updated ${updated} plant type images`);
}

async function updatePlantPartImages() {
  console.log('🌱 Updating Plant Part Images...');
  
  // Get completed plant part images from queue
  const { data: completedQueue, error } = await supabase
    .from('image_generation_queue')
    .select('metadata, generated_image_url')
    .eq('status', 'completed')
    .not('generated_image_url', 'is', null)
    .contains('metadata', { type: 'plant_part' });
  
  if (error || !completedQueue?.length) {
    console.log('⚠️ No completed plant part images found');
    return;
  }
  
  let updated = 0;
  for (const item of completedQueue) {
    if (item.metadata?.plant_part_id && item.generated_image_url) {
      const { error: updateError } = await supabase
        .from('plant_parts')
        .update({ image_url: item.generated_image_url })
        .eq('id', item.metadata.plant_part_id);
      
      if (!updateError) {
        updated++;
      }
    }
  }
  
  console.log(`✅ Updated ${updated} plant part images`);
}

async function processImageGeneration() {
  console.log('🚀 Starting Image Generation Process...');
  console.log('=' .repeat(60));
  
  let retries = 0;
  
  while (retries < CONFIG.MAX_RETRIES) {
    try {
      // Check current queue status
      const progress = await monitorProgress();
      if (!progress) {
        console.log('❌ Could not check queue status');
        break;
      }
      
      console.log(`\n📊 Queue Status:`);
      console.log(`   ⏳ Pending: ${progress.pending}`);
      console.log(`   🔄 Processing: ${progress.processing}`);
      console.log(`   ✅ Completed: ${progress.completed}`);
      console.log(`   ❌ Failed: ${progress.failed}`);
      console.log(`   📝 Total: ${progress.total}`);
      
      if (progress.pending === 0 && progress.processing === 0) {
        console.log('\n🎉 All images processed!');
        break;
      }
      
      if (progress.pending > 0) {
        console.log(`\n🔄 Processing batch of ${Math.min(CONFIG.BATCH_SIZE, progress.pending)} images...`);
        
        // Trigger image generation
        await triggerImageGeneration();
        
        console.log(`⏱️ Waiting ${CONFIG.DELAY_BETWEEN_BATCHES/1000} seconds before next batch...`);
        await sleep(CONFIG.DELAY_BETWEEN_BATCHES);
      } else {
        console.log('\n⏳ Waiting for current batch to complete...');
        await sleep(10000); // Wait 10 seconds
      }
      
    } catch (error) {
      retries++;
      console.error(`❌ Error in batch processing (attempt ${retries}/${CONFIG.MAX_RETRIES}):`, error);
      
      if (retries < CONFIG.MAX_RETRIES) {
        console.log(`🔄 Retrying in ${CONFIG.DELAY_BETWEEN_BATCHES/1000} seconds...`);
        await sleep(CONFIG.DELAY_BETWEEN_BATCHES);
      }
    }
  }
  
  // Update database with generated images
  await updatePlantTypeImages();
  await updatePlantPartImages();
}

async function generateCostEstimate() {
  console.log('💰 Calculating Cost Estimate...');
  
  // Get provider cost
  const { data: provider } = await supabase
    .from('ai_provider_config')
    .select('cost_per_image')
    .eq('provider_name', CONFIG.PROVIDER)
    .single();
  
  if (!provider) {
    console.log('⚠️ Could not get provider cost information');
    return;
  }
  
  // Count items to be generated
  const { data: plantTypes } = await supabase
    .from('hemp_plant_archetypes')
    .select('id')
    .is('image_url', null);
  
  const { data: plantParts } = await supabase
    .from('plant_parts')
    .select('id')
    .is('image_url', null);
  
  const { data: products } = await supabase
    .from('uses_products')
    .select('id')
    .like('image_url', '%placeholder%');
  
  const totalImages = (plantTypes?.length || 0) + (plantParts?.length || 0) + (products?.length || 0);
  const estimatedCost = totalImages * provider.cost_per_image;
  
  console.log(`\n💳 Cost Estimate:`);
  console.log(`   🌿 Plant Types: ${plantTypes?.length || 0} images`);
  console.log(`   🌱 Plant Parts: ${plantParts?.length || 0} images`);
  console.log(`   🏭 Products: ${products?.length || 0} images`);
  console.log(`   📝 Total Images: ${totalImages}`);
  console.log(`   💰 Cost per Image: $${provider.cost_per_image}`);
  console.log(`   🧮 Estimated Total: $${estimatedCost.toFixed(2)}`);
  
  return { totalImages, estimatedCost };
}

async function main() {
  console.log('🌿 Hemp Resource Hub - Complete Image Generation');
  console.log('=' .repeat(60));
  console.log('🚀 This script will generate ALL missing images using Google Imagen 3');
  console.log('');
  
  try {
    // Step 1: Check configuration
    const isConfigured = await checkApiConfiguration();
    if (!isConfigured) {
      console.log('\n💡 Setup Instructions:');
      console.log('1. Get a Gemini API key from: https://aistudio.google.com/app/apikey');
      console.log('2. Add it to Supabase Edge Function secrets as: GEMINI_API_KEY');
      console.log('3. Make sure the Imagen 3 provider is configured in the database');
      return;
    }
    
    // Step 2: Generate cost estimate
    const estimate = await generateCostEstimate();
    if (!estimate) return;
    
    // Step 3: Confirm with user (in production, you might want user input)
    console.log('\n⚠️ This will generate real images using AI and incur costs.');
    console.log('🔍 Review the cost estimate above before proceeding.');
    
    // Step 4: Populate the queue
    console.log('\n📋 Step 1: Populating Image Generation Queue...');
    await populateImageQueue();
    
    // Step 5: Process all images
    console.log('\n🔥 Step 2: Processing All Images...');
    await processImageGeneration();
    
    // Step 6: Final status
    const finalProgress = await monitorProgress();
    if (finalProgress) {
      console.log('\n🎯 Final Results:');
      console.log(`   ✅ Successfully Generated: ${finalProgress.completed} images`);
      console.log(`   ❌ Failed: ${finalProgress.failed} images`);
      console.log(`   📊 Success Rate: ${((finalProgress.completed / finalProgress.total) * 100).toFixed(1)}%`);
      
      if (finalProgress.failed > 0) {
        console.log('\n🔍 To retry failed images, run this script again');
      }
    }
    
    console.log('\n🎉 Image generation workflow completed!');
    console.log('🌐 Check your website - all images should now display properly');
    
  } catch (error) {
    console.error('💥 Workflow failed:', error);
    process.exit(1);
  }
}

// Run the workflow
main().then(() => {
  console.log('\n✨ All done! Your Hemp Resource Hub now has beautiful AI-generated images! 🌿');
  process.exit(0);
}).catch(error => {
  console.error('💥 Workflow failed:', error);
  process.exit(1);
});