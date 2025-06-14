#!/usr/bin/env node

/**
 * Populate Image Generation Queue
 * This script adds all needed images to the generation queue for processing by Imagen 3
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

// Enhanced prompts for different categories
const PROMPT_TEMPLATES = {
  // Plant Types (Hemp Archetypes)
  plant_type: {
    'Fiber Hemp': 'Professional hemp fiber plant growing in field, tall stalks with strong fibers, industrial hemp cultivation, photorealistic, high quality',
    'Grain/Seed Hemp': 'Hemp plants with mature seeds ready for harvest, focus on seed heads, agricultural setting, photorealistic detail',
    'Cannabinoid Hemp': 'Premium CBD hemp flowers with visible trichomes, medical cannabis plant, close-up detail, professional lighting',
    'Oil Archetype': 'Hemp seeds and hemp oil extraction process, golden hemp oil droplets, natural organic setting',
    'Fiber Archetype': 'Raw hemp bast fibers, natural textile materials, sustainable fiber production, clean industrial setting',
    'Seeds Archetype': 'Hemp seeds in various stages, from plant to harvest to processed seeds, nutritional hemp products'
  },
  
  // Plant Parts
  plant_part: {
    'Cannabinoids': 'Hemp flower buds with visible cannabinoid crystals, macro photography, scientific illustration style',
    'Hemp Bast (Fiber)': 'Raw hemp bast fibers, natural textile processing, sustainable material production',
    'Hemp Flowers': 'Hemp flower clusters in full bloom, detailed botanical illustration, natural lighting',
    'Hemp Hurd (Shivs)': 'Hemp hurds and shivs for construction material, biomass processing, industrial application',
    'Hemp Leaves': 'Fresh hemp leaves with detailed leaf structure, botanical accuracy, natural green tones',
    'Hemp Roots': 'Hemp root system in soil, underground plant structure, agricultural cross-section view',
    'Hemp Seed': 'Hemp seeds close-up, nutritional hemp products, food grade quality, natural setting',
    'Terpenes': 'Hemp terpene extraction process, aromatic compounds visualization, laboratory setting'
  }
};

// Generate optimized prompts for products
function generateProductPrompt(product, plantPart, industry, subIndustry) {
  const productName = product.name;
  const description = product.description || '';
  
  // Base hemp product context
  let prompt = `High-quality ${productName}`;
  
  // Add plant part context
  if (plantPart) {
    prompt += ` made from ${plantPart.toLowerCase()}`;
  }
  
  // Add industry context
  if (industry) {
    if (industry.toLowerCase().includes('textile')) {
      prompt += ', sustainable textile product, eco-friendly fabric';
    } else if (industry.toLowerCase().includes('food')) {
      prompt += ', organic food product, healthy natural ingredient';
    } else if (industry.toLowerCase().includes('construction')) {
      prompt += ', sustainable building material, eco-friendly construction';
    } else if (industry.toLowerCase().includes('automotive')) {
      prompt += ', automotive hemp composite material, sustainable manufacturing';
    } else if (industry.toLowerCase().includes('health')) {
      prompt += ', natural health product, wellness supplement';
    }
  }
  
  // Add style and quality modifiers
  prompt += ', professional product photography, clean white background, commercial quality, photorealistic, high resolution, product showcase lighting';
  
  return prompt.slice(0, 800); // Keep within reasonable length
}

async function populateImageQueue() {
  console.log('🌿 Populating Image Generation Queue');
  console.log('=' .repeat(50));
  
  try {
    // 1. Add Plant Type Images
    console.log('\n📸 Adding Plant Type Images...');
    const { data: plantTypes, error: plantError } = await supabase
      .from('hemp_plant_archetypes')
      .select('id, name, description, image_url')
      .is('image_url', null);
    
    if (plantError) throw plantError;
    
    let queueItems = [];
    
    for (const plantType of plantTypes) {
      const prompt = PROMPT_TEMPLATES.plant_type[plantType.name] || 
        `Professional ${plantType.name} plant, hemp cultivation, agricultural setting, photorealistic, high quality`;
      
      queueItems.push({
        product_id: null, // No product ID for plant types
        prompt: prompt,
        style_preset: 'photographic',
        negative_prompt: 'cartoon, anime, low quality, blurry, text, watermark',
        priority: 'high',
        metadata: {
          type: 'plant_type',
          plant_type_id: plantType.id,
          name: plantType.name
        }
      });
    }
    
    console.log(`✅ Added ${plantTypes.length} plant type image requests`);
    
    // 2. Add Plant Part Images
    console.log('\n🌱 Adding Plant Part Images...');
    const { data: plantParts, error: partError } = await supabase
      .from('plant_parts')
      .select('id, name, image_url')
      .is('image_url', null);
    
    if (partError) throw partError;
    
    for (const plantPart of plantParts) {
      const prompt = PROMPT_TEMPLATES.plant_part[plantPart.name] || 
        `Hemp ${plantPart.name.toLowerCase()}, botanical illustration, natural detail, professional photography`;
      
      queueItems.push({
        product_id: null, // No product ID for plant parts
        prompt: prompt,
        style_preset: 'photographic',
        negative_prompt: 'cartoon, anime, low quality, blurry, text, watermark',
        priority: 'medium',
        metadata: {
          type: 'plant_part',
          plant_part_id: plantPart.id,
          name: plantPart.name
        }
      });
    }
    
    console.log(`✅ Added ${plantParts.length} plant part image requests`);
    
    // 3. Add Product Images (for placeholder ones)
    console.log('\n🏭 Adding Product Images...');
    const { data: products, error: productError } = await supabase
      .from('uses_products')
      .select(`
        id, name, description, image_url,
        plant_parts (name),
        industry_sub_categories (name)
      `)
      .like('image_url', '%placeholder%');
    
    if (productError) throw productError;
    
    for (const product of products) {
      const plantPartName = product.plant_parts?.name;
      const subIndustryName = product.industry_sub_categories?.name;
      
      const prompt = generateProductPrompt(product, plantPartName, null, subIndustryName);
      
      queueItems.push({
        product_id: product.id,
        prompt: prompt,
        style_preset: 'photographic',
        negative_prompt: 'cartoon, anime, low quality, blurry, text, watermark, logo, brand',
        priority: 'normal',
        metadata: {
          type: 'product',
          product_name: product.name,
          plant_part: plantPartName,
          sub_industry: subIndustryName
        }
      });
    }
    
    console.log(`✅ Added ${products.length} product image requests`);
    
    // 4. Insert all queue items
    console.log('\n⏳ Inserting queue items into database...');
    
    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    let totalInserted = 0;
    
    for (let i = 0; i < queueItems.length; i += batchSize) {
      const batch = queueItems.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('image_generation_queue')
        .insert(batch);
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error);
        continue;
      }
      
      totalInserted += batch.length;
      console.log(`📦 Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(queueItems.length/batchSize)} (${batch.length} items)`);
    }
    
    console.log(`\n🎉 Successfully queued ${totalInserted} image generation requests!`);
    
    // 5. Show queue summary
    const { data: queueSummary } = await supabase
      .from('image_generation_queue')
      .select('status, priority')
      .eq('status', 'pending');
    
    if (queueSummary) {
      const highPriority = queueSummary.filter(q => q.priority === 'high').length;
      const mediumPriority = queueSummary.filter(q => q.priority === 'medium').length;
      const normalPriority = queueSummary.filter(q => q.priority === 'normal').length;
      
      console.log('\n📊 Queue Summary:');
      console.log(`   🔴 High Priority: ${highPriority} items`);
      console.log(`   🟡 Medium Priority: ${mediumPriority} items`);
      console.log(`   🟢 Normal Priority: ${normalPriority} items`);
      console.log(`   📝 Total Pending: ${queueSummary.length} items`);
    }
    
    console.log('\n🚀 Ready to run image generation!');
    console.log('   Run: node trigger_image_generation.js');
    
  } catch (error) {
    console.error('❌ Error populating queue:', error);
    throw error;
  }
}

async function main() {
  console.log('🔌 Connecting to Supabase...');
  console.log(`📍 URL: ${supabaseUrl}`);
  
  try {
    // Test connection
    const { data, error } = await supabase
      .from('uses_products')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    
    console.log(`✅ Connected! Found ${data} products in database`);
    
    await populateImageQueue();
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

// Run the script
main().then(() => {
  console.log('\n✨ Image queue population completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});

export { populateImageQueue };