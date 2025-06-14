#!/usr/bin/env node

/**
 * Simple Image Queue Population Script
 * Adds missing plant type and plant part images to the queue
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

// Simple prompt templates
const PLANT_TYPE_PROMPTS = {
  'Fiber Hemp': 'Industrial hemp fiber plant with tall stalks, professional agricultural photography, photorealistic',
  'Grain/Seed Hemp': 'Hemp plant with mature seed heads ready for harvest, agricultural setting, high quality photo',
  'Cannabinoid Hemp': 'Premium CBD hemp flower with visible trichomes, medical cannabis plant, detailed photography',
  'Oil Archetype': 'Hemp seeds and golden hemp oil, natural organic product photography',
  'Fiber Archetype': 'Raw hemp bast fibers for textiles, sustainable material production, clean photo',
  'Seeds Archetype': 'Hemp seeds from plant to harvest, nutritional hemp products, food photography'
};

const PLANT_PART_PROMPTS = {
  'Cannabinoids': 'Hemp flower buds with cannabinoid crystals, macro photography, scientific detail',
  'Hemp Bast (Fiber)': 'Raw hemp bast fibers for textile processing, natural material photography',
  'Hemp Flowers': 'Hemp flower clusters in bloom, botanical illustration style, natural lighting',
  'Hemp Hurd (Shivs)': 'Hemp hurds and shivs for construction, biomass material, industrial photo',
  'Hemp Leaves': 'Fresh hemp leaves with detailed structure, botanical photography, green tones',
  'Hemp Roots': 'Hemp root system in soil, agricultural cross-section, educational photo',
  'Hemp Seed': 'Hemp seeds close-up, nutritional product, food grade quality photography',
  'Terpenes': 'Hemp terpene extraction, aromatic compounds, laboratory setting photo'
};

async function addPlantTypeImages() {
  console.log('🌿 Adding Plant Type Images...');
  
  const { data: plantTypes, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('id, name')
    .is('image_url', null);
  
  if (error) throw error;
  
  let inserted = 0;
  for (const plantType of plantTypes) {
    const prompt = PLANT_TYPE_PROMPTS[plantType.name] || 
      `Professional ${plantType.name} plant, hemp cultivation, agricultural photography`;
    
    const { error: insertError } = await supabase
      .from('image_generation_queue')
      .insert({
        product_id: null,
        prompt: prompt,
        style_preset: 'photographic',
        negative_prompt: 'cartoon, anime, low quality, blurry, text, watermark',
        priority: 3, // High priority
        status: 'pending'
      });
    
    if (!insertError) {
      inserted++;
      console.log(`✅ Added: ${plantType.name}`);
    } else {
      console.log(`❌ Failed to add ${plantType.name}:`, insertError.message);
    }
  }
  
  return inserted;
}

async function addPlantPartImages() {
  console.log('\n🌱 Adding Plant Part Images...');
  
  const { data: plantParts, error } = await supabase
    .from('plant_parts')
    .select('id, name')
    .is('image_url', null);
  
  if (error) throw error;
  
  let inserted = 0;
  for (const plantPart of plantParts) {
    const prompt = PLANT_PART_PROMPTS[plantPart.name] || 
      `Hemp ${plantPart.name.toLowerCase()}, botanical photography, natural detail`;
    
    const { error: insertError } = await supabase
      .from('image_generation_queue')
      .insert({
        product_id: null,
        prompt: prompt,
        style_preset: 'photographic',  
        negative_prompt: 'cartoon, anime, low quality, blurry, text, watermark',
        priority: 2, // Medium priority
        status: 'pending'
      });
    
    if (!insertError) {
      inserted++;
      console.log(`✅ Added: ${plantPart.name}`);
    } else {
      console.log(`❌ Failed to add ${plantPart.name}:`, insertError.message);
    }
  }
  
  return inserted;
}

async function main() {
  console.log('🚀 Simple Image Queue Population');
  console.log('=' .repeat(40));
  
  try {
    // Test connection
    const { data, error } = await supabase
      .from('uses_products')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`✅ Connected to Supabase`);
    
    // Add images
    const plantTypesAdded = await addPlantTypeImages();
    const plantPartsAdded = await addPlantPartImages();
    
    console.log('\n📊 Summary:');
    console.log(`   🌿 Plant Types: ${plantTypesAdded} added`);
    console.log(`   🌱 Plant Parts: ${plantPartsAdded} added`);
    console.log(`   📝 Total: ${plantTypesAdded + plantPartsAdded} items queued`);
    
    // Check queue status
    const { data: queueStatus } = await supabase
      .from('image_generation_queue')
      .select('status')
      .eq('status', 'pending');
    
    if (queueStatus) {
      console.log(`\n🎯 Total pending items in queue: ${queueStatus.length}`);
    }
    
    console.log('\n🚀 Ready to generate images!');
    console.log('   Next: node trigger_image_generation.js');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main().then(() => {
  console.log('\n✨ Queue population completed!');
  process.exit(0);
});