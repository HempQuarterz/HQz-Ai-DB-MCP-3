#!/usr/bin/env node

/**
 * Image Generation Setup Checker
 * Verifies that everything is configured correctly for image generation
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSetup() {
  console.log('🔍 Hemp Resource Hub - Image Generation Setup Check');
  console.log('=' .repeat(60));
  
  let allGood = true;
  
  try {
    // 1. Check Supabase connection
    console.log('\n1️⃣ Checking Supabase Connection...');
    const { data, error } = await supabase
      .from('uses_products')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      allGood = false;
    } else {
      console.log(`✅ Supabase connected (${data} products found)`);
    }
    
    // 2. Check AI provider configuration
    console.log('\n2️⃣ Checking AI Provider Configuration...');
    const { data: providers, error: providerError } = await supabase
      .from('ai_provider_config')
      .select('*')
      .eq('is_active', true);
    
    if (providerError) {
      console.log('❌ Could not check AI providers:', providerError.message);
      allGood = false;
    } else {
      console.log(`✅ Found ${providers.length} active AI providers:`);
      providers.forEach(p => {
        console.log(`   🤖 ${p.provider_name}: $${p.cost_per_image}/image, Quality: ${p.quality_score}/10`);
      });
      
      const hasImagen3 = providers.find(p => p.provider_name === 'imagen_3');
      if (!hasImagen3) {
        console.log('⚠️ Imagen 3 not found in active providers');
        allGood = false;
      }
    }
    
    // 3. Check image generation queue table
    console.log('\n3️⃣ Checking Image Generation Queue...');
    const { data: queueCheck, error: queueError } = await supabase
      .from('image_generation_queue')
      .select('status')
      .limit(1);
    
    if (queueError) {
      console.log('❌ Image generation queue table not accessible:', queueError.message);
      allGood = false;
    } else {
      console.log('✅ Image generation queue table accessible');
      
      // Check current queue status
      const { data: queueStatus } = await supabase
        .from('image_generation_queue')
        .select('status')
        .in('status', ['pending', 'processing', 'completed', 'failed']);
      
      if (queueStatus) {
        const pending = queueStatus.filter(q => q.status === 'pending').length;
        const processing = queueStatus.filter(q => q.status === 'processing').length;
        const completed = queueStatus.filter(q => q.status === 'completed').length;
        const failed = queueStatus.filter(q => q.status === 'failed').length;
        
        console.log(`   📊 Queue Status: ${pending} pending, ${processing} processing, ${completed} completed, ${failed} failed`);
      }
    }
    
    // 4. Check Edge Function
    console.log('\n4️⃣ Testing Edge Function...');
    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('hemp-image-generator', {
        body: { test: true, batchSize: 0 }
      });
      
      if (funcError) {
        console.log('❌ Edge function error:', funcError.message);
        allGood = false;
      } else {
        console.log('✅ Edge function responding');
      }
    } catch (e) {
      console.log('❌ Edge function not accessible:', e.message);
      allGood = false;
    }
    
    // 5. Check what images are needed
    console.log('\n5️⃣ Analyzing Image Needs...');
    
    // Plant types
    const { data: plantTypesWithoutImages } = await supabase
      .from('hemp_plant_archetypes')
      .select('id, name')
      .is('image_url', null);
    
    // Plant parts
    const { data: plantPartsWithoutImages } = await supabase
      .from('plant_parts')
      .select('id, name')
      .is('image_url', null);
    
    // Products with placeholders
    const { data: productsWithPlaceholders } = await supabase
      .from('uses_products')
      .select('id, name')
      .like('image_url', '%placeholder%');
    
    console.log(`📋 Images Needed:`);
    console.log(`   🌿 Plant Types: ${plantTypesWithoutImages?.length || 0} missing images`);
    console.log(`   🌱 Plant Parts: ${plantPartsWithoutImages?.length || 0} missing images`);
    console.log(`   🏭 Products: ${productsWithPlaceholders?.length || 0} with placeholders`);
    
    const totalNeeded = (plantTypesWithoutImages?.length || 0) + 
                       (plantPartsWithoutImages?.length || 0) + 
                       (productsWithPlaceholders?.length || 0);
    
    if (totalNeeded === 0) {
      console.log('🎉 No images needed - all are already generated!');
    } else {
      console.log(`📝 Total images to generate: ${totalNeeded}`);
      
      // Cost estimate
      const { data: imagen3Config } = await supabase
        .from('ai_provider_config')
        .select('cost_per_image')
        .eq('provider_name', 'imagen_3')
        .single();
      
      if (imagen3Config) {
        const estimatedCost = totalNeeded * imagen3Config.cost_per_image;
        console.log(`💰 Estimated cost with Imagen 3: $${estimatedCost.toFixed(2)}`);
      }
    }
    
    // 6. Final assessment
    console.log('\n🎯 Setup Assessment:');
    if (allGood && totalNeeded > 0) {
      console.log('✅ Everything looks good! Ready to generate images.');
      console.log('\n🚀 Next Steps:');
      console.log('1. Make sure you have a Gemini API key');
      console.log('2. Add GEMINI_API_KEY to Supabase Edge Function secrets');
      console.log('3. Run: node generate_all_images.js');
    } else if (allGood && totalNeeded === 0) {
      console.log('✅ Setup is good and no images needed!');
    } else {
      console.log('❌ Setup issues detected. Please fix the errors above.');
      allGood = false;
    }
    
  } catch (error) {
    console.error('💥 Setup check failed:', error);
    allGood = false;
  }
  
  return allGood;
}

// Run the check
checkSetup().then(success => {
  if (success) {
    console.log('\n✨ Setup check completed successfully! 🌿');
    process.exit(0);
  } else {
    console.log('\n❌ Setup check found issues that need to be resolved.');
    process.exit(1);
  }
}).catch(error => {
  console.error('💥 Setup check failed:', error);
  process.exit(1);
});