#!/usr/bin/env node

/**
 * Fix Plant Type and Plant Part Images
 * Directly updates plant types and plant parts with appropriate image URLs
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

// High-quality placeholder images with hemp-specific colors and better text
const PLANT_TYPE_IMAGES = {
  'Fiber Hemp': 'https://via.placeholder.com/1024x1024/2D5016/FFFFFF?text=🌿+Fiber+Hemp',
  'Grain/Seed Hemp': 'https://via.placeholder.com/1024x1024/8B4513/FFFFFF?text=🌾+Grain%2FSeed+Hemp', 
  'Cannabinoid Hemp': 'https://via.placeholder.com/1024x1024/9370DB/FFFFFF?text=💜+Cannabinoid+Hemp',
  'Oil Archetype': 'https://via.placeholder.com/1024x1024/FFD700/000000?text=🛢️+Oil+Archetype',
  'Fiber Archetype': 'https://via.placeholder.com/1024x1024/228B22/FFFFFF?text=🧵+Fiber+Archetype',
  'Seeds Archetype': 'https://via.placeholder.com/1024x1024/8B4513/FFFFFF?text=🌰+Seeds+Archetype'
};

const PLANT_PART_IMAGES = {
  'Cannabinoids': 'https://via.placeholder.com/1024x1024/9370DB/FFFFFF?text=💎+Cannabinoids',
  'Hemp Bast (Fiber)': 'https://via.placeholder.com/1024x1024/228B22/FFFFFF?text=🧵+Hemp+Bast',
  'Hemp Flowers': 'https://via.placeholder.com/1024x1024/FFB6C1/000000?text=🌸+Hemp+Flowers',
  'Hemp Hurd (Shivs)': 'https://via.placeholder.com/1024x1024/D2691E/FFFFFF?text=🪵+Hemp+Hurd',
  'Hemp Leaves': 'https://via.placeholder.com/1024x1024/32CD32/000000?text=🍃+Hemp+Leaves', 
  'Hemp Roots': 'https://via.placeholder.com/1024x1024/8B4513/FFFFFF?text=🌱+Hemp+Roots',
  'Hemp Seed': 'https://via.placeholder.com/1024x1024/DEB887/000000?text=🌰+Hemp+Seed',
  'Terpenes': 'https://via.placeholder.com/1024x1024/00D4FF/000000?text=💧+Terpenes'
};

async function updatePlantTypes() {
  console.log('🌿 Updating Plant Type Images...');
  
  const { data: plantTypes, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('id, name, image_url')
    .is('image_url', null);
  
  if (error) {
    console.error('❌ Error fetching plant types:', error);
    return 0;
  }
  
  let updated = 0;
  for (const plantType of plantTypes) {
    const imageUrl = PLANT_TYPE_IMAGES[plantType.name];
    
    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('hemp_plant_archetypes')
        .update({ image_url: imageUrl })
        .eq('id', plantType.id);
      
      if (updateError) {
        console.error(`❌ Failed to update ${plantType.name}:`, updateError);
      } else {
        console.log(`✅ Updated: ${plantType.name}`);
        updated++;
      }
    } else {
      console.log(`⚠️ No image defined for: ${plantType.name}`);
    }
  }
  
  return updated;
}

async function updatePlantParts() {
  console.log('\n🌱 Updating Plant Part Images...');
  
  const { data: plantParts, error } = await supabase
    .from('plant_parts')
    .select('id, name, image_url')
    .is('image_url', null);
  
  if (error) {
    console.error('❌ Error fetching plant parts:', error);
    return 0;
  }
  
  let updated = 0;
  for (const plantPart of plantParts) {
    const imageUrl = PLANT_PART_IMAGES[plantPart.name];
    
    if (imageUrl) {
      const { error: updateError } = await supabase
        .from('plant_parts')
        .update({ image_url: imageUrl })
        .eq('id', plantPart.id);
      
      if (updateError) {
        console.error(`❌ Failed to update ${plantPart.name}:`, updateError);
      } else {
        console.log(`✅ Updated: ${plantPart.name}`);
        updated++;
      }
    } else {
      console.log(`⚠️ No image defined for: ${plantPart.name}`);
    }
  }
  
  return updated;
}

async function verifyUpdates() {
  console.log('\n🔍 Verifying Updates...');
  
  // Check plant types
  const { data: plantTypes } = await supabase
    .from('hemp_plant_archetypes')
    .select('name, image_url')
    .not('image_url', 'is', null);
  
  // Check plant parts  
  const { data: plantParts } = await supabase
    .from('plant_parts')
    .select('name, image_url')
    .not('image_url', 'is', null);
  
  console.log(`✅ Plant Types with images: ${plantTypes?.length || 0}`);
  console.log(`✅ Plant Parts with images: ${plantParts?.length || 0}`);
  
  if (plantTypes?.length > 0) {
    console.log('\n🌿 Plant Type Images:');
    plantTypes.forEach(pt => console.log(`   ${pt.name}: ${pt.image_url.substring(0, 50)}...`));
  }
  
  if (plantParts?.length > 0) {
    console.log('\n🌱 Plant Part Images:');
    plantParts.forEach(pp => console.log(`   ${pp.name}: ${pp.image_url.substring(0, 50)}...`));
  }
}

async function main() {
  console.log('🔧 Hemp Resource Hub - Fix Plant Images');
  console.log('=' .repeat(50));
  console.log('🎯 Adding colorful placeholder images for plant types & parts');
  console.log('');
  
  try {
    // Test connection
    const { data, error } = await supabase
      .from('hemp_plant_archetypes')
      .select('count', { count: 'exact', head: true });
    
    if (error) throw error;
    console.log(`✅ Connected to Supabase`);
    
    // Update both tables
    const plantTypesUpdated = await updatePlantTypes();
    const plantPartsUpdated = await updatePlantParts();
    
    // Verify results
    await verifyUpdates();
    
    console.log('\n📊 Summary:');
    console.log(`   🌿 Plant Types Updated: ${plantTypesUpdated}`);
    console.log(`   🌱 Plant Parts Updated: ${plantPartsUpdated}`);
    console.log(`   📝 Total Updates: ${plantTypesUpdated + plantPartsUpdated}`);
    
    if (plantTypesUpdated + plantPartsUpdated > 0) {
      console.log('\n🎉 SUCCESS! Plant images have been updated!');
      console.log('🌐 Refresh your website to see the changes');
      console.log('💡 Plant type cards on home page should now show images');
      console.log('💡 Plant parts page should now show images');
    } else {
      console.log('\n⚠️ No updates made. Images may already be set.');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main().then(() => {
  console.log('\n✨ Plant image fix completed!');
  process.exit(0);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});