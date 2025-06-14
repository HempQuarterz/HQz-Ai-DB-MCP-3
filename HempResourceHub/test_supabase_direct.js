#!/usr/bin/env node

/**
 * Test Supabase Direct Connection
 * Verify that our updates are actually in the database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDirectFetch() {
  console.log('🔍 Testing Direct Supabase Fetch (Same as Frontend)');
  console.log('=' .repeat(60));
  
  try {
    // This is exactly what the frontend hook does
    console.log('Fetching plant types from Supabase...');
    
    const { data, error } = await supabase
      .from('hemp_plant_archetypes')
      .select('*');

    console.log('Raw response:', { data, error });

    if (error) {
      console.error('Error fetching plant types:', error);
      throw new Error(error.message);
    }
    
    // Map snake_case fields to camelCase (same as frontend)
    const result = Array.isArray(data)
      ? data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          imageUrl: item.image_url,  // THIS IS THE KEY MAPPING
          plantingDensity: item.planting_density,
          characteristics: item.characteristics,
          createdAt: item.created_at,
        }))
      : [];
    
    console.log('\n📋 Mapped Results (Same as Frontend Gets):');
    result.forEach(plantType => {
      console.log(`   ${plantType.name}:`);
      console.log(`     imageUrl: ${plantType.imageUrl || 'NULL'}`);
      console.log(`     imageUrl length: ${plantType.imageUrl ? plantType.imageUrl.length : 0}`);
    });
    
    console.log('\n🎯 Summary:');
    console.log(`   Total plant types: ${result.length}`);
    console.log(`   With images: ${result.filter(p => p.imageUrl).length}`);
    console.log(`   Without images: ${result.filter(p => !p.imageUrl).length}`);
    
    if (result.filter(p => p.imageUrl).length > 0) {
      console.log('\n✅ SUCCESS: Database has the image URLs!');
      console.log('❓ The frontend cache must be stale');
    } else {
      console.log('\n❌ PROBLEM: Database still shows null image URLs');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDirectFetch().then(() => {
  console.log('\n🏁 Direct fetch test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});