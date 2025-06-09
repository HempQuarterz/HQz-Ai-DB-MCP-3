import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Image generation providers configuration
const IMAGE_PROVIDERS = {
  PLACEHOLDER: 'placeholder',
  STABLE_DIFFUSION: 'stable_diffusion',
  DALL_E: 'dall_e',
  MIDJOURNEY: 'midjourney'
};

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { batchSize = 10, provider = IMAGE_PROVIDERS.PLACEHOLDER } = await req.json();

    // Fetch pending image generation tasks
    const { data: queue, error: queueError } = await supabase
      .from('image_generation_queue')
      .select(`
        id,
        product_id,
        prompt,
        style_preset,
        negative_prompt,
        uses_products (
          name,
          plant_parts (name),
          industry_sub_categories (
            name,
            industries (name)
          )
        )
      `)
      .in('status', ['pending', 'retry'])
      .order('priority', { ascending: false })
      .order('created_at')
      .limit(batchSize);

    if (queueError) {
      throw queueError;
    }

    const results = {
      processed: 0,
      success: 0,
      failed: 0,
      errors: []
    };

    // Process each queued item
    for (const item of queue) {
      try {
        // Update status to processing
        await supabase
          .from('image_generation_queue')
          .update({ status: 'processing', updated_at: new Date().toISOString() })
          .eq('id', item.id);

        // Generate image based on provider
        let imageUrl = '';
        
        switch (provider) {
          case IMAGE_PROVIDERS.PLACEHOLDER:
            imageUrl = generatePlaceholderUrl(item);
            break;
          
          case IMAGE_PROVIDERS.STABLE_DIFFUSION:
            // Integration with Stable Diffusion API
            // imageUrl = await generateStableDiffusion(item.prompt);
            imageUrl = generatePlaceholderUrl(item); // Fallback for now
            break;
          
          case IMAGE_PROVIDERS.DALL_E:
            // Integration with OpenAI DALL-E API
            // imageUrl = await generateDallE(item.prompt);
            imageUrl = generatePlaceholderUrl(item); // Fallback for now
            break;
          
          default:
            imageUrl = generatePlaceholderUrl(item);
        }

        // Update product with generated image
        await supabase
          .from('uses_products')
          .update({ 
            image_url: imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.product_id);

        // Update queue status
        await supabase
          .from('image_generation_queue')
          .update({ 
            status: 'completed',
            generated_image_url: imageUrl,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        // Log success
        await supabase
          .from('image_generation_history')
          .insert({
            queue_id: item.id,
            product_id: item.product_id,
            action: 'completed',
            details: {
              image_url: imageUrl,
              provider: provider
            }
          });

        results.success++;
      } catch (error) {
        // Handle errors
        await supabase
          .from('image_generation_queue')
          .update({ 
            status: 'failed',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        results.failed++;
        results.errors.push({ itemId: item.id, error: error.message });
      }
      
      results.processed++;
    }

    // Log agent run
    await supabase
      .from('hemp_agent_runs')
      .insert({
        agent_name: 'hemp_image_generator_edge',
        products_found: queue.length,
        products_saved: results.success,
        companies_saved: 0,
        status: 'completed',
        error_message: results.errors.length > 0 ? JSON.stringify(results.errors) : null
      });

    return new Response(JSON.stringify({
      success: true,
      results,
      message: `Processed ${results.processed} items: ${results.success} successful, ${results.failed} failed`
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
});

function generatePlaceholderUrl(item: any): string {
  const productName = item.uses_products?.name || 'Hemp Product';
  const plantPart = item.uses_products?.plant_parts?.name || '';
  const industry = item.uses_products?.industry_sub_categories?.industries?.name || '';
  
  // Color mapping based on plant part
  const colorMap: { [key: string]: string } = {
    'Seed': '8B4513',
    'Fiber': '228B22',
    'Flower': '9370DB',
    'Hurd': 'D2691E',
    'Root': '8B4513',
    'Leaves': '32CD32'
  };
  
  let color = '2E8B57'; // Default sea green
  for (const [key, value] of Object.entries(colorMap)) {
    if (plantPart.includes(key)) {
      color = value;
      break;
    }
  }
  
  // Generate URL with better formatting
  const formattedName = encodeURIComponent(productName.replace(/[^a-zA-Z0-9 ]/g, ''));
  return `https://via.placeholder.com/800x600/${color}/FFFFFF?text=${formattedName}`;
}

// Placeholder functions for real image generation APIs
// These would be implemented with actual API integrations

// async function generateStableDiffusion(prompt: string): Promise<string> {
//   // Integration with Stable Diffusion API
//   const response = await fetch('https://api.stability.ai/v1/generation', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${Deno.env.get('STABILITY_API_KEY')}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       text_prompts: [{ text: prompt }],
//       cfg_scale: 7,
//       height: 512,
//       width: 512,
//       samples: 1,
//       steps: 30
//     })
//   });
//   // Process response and return image URL
// }

// async function generateDallE(prompt: string): Promise<string> {
//   // Integration with OpenAI DALL-E API
//   const response = await fetch('https://api.openai.com/v1/images/generations', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       prompt: prompt,
//       n: 1,
//       size: '512x512'
//     })
//   });
//   // Process response and return image URL
// }