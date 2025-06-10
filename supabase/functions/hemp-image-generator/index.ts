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

    const { batchSize = 10, provider = await selectBestProvider() } = await req.json();

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
      const startTime = Date.now();
      
      try {
        // Update status to processing
        await supabase
          .from('image_generation_queue')
          .update({ status: 'processing', updated_at: new Date().toISOString() })
          .eq('id', item.id);

        // Generate image based on provider
        let imageUrl = '';
        let actualProvider = provider;
        
        try {
          switch (provider) {
            case IMAGE_PROVIDERS.PLACEHOLDER:
              imageUrl = generatePlaceholderUrl(item);
              break;
            
            case IMAGE_PROVIDERS.STABLE_DIFFUSION:
              imageUrl = await generateStableDiffusion(item.prompt, item.negative_prompt);
              break;
            
            case IMAGE_PROVIDERS.DALL_E:
              imageUrl = await generateDallE(item.prompt);
              break;
            
            default:
              // Fallback to placeholder if provider is unknown
              imageUrl = generatePlaceholderUrl(item);
              actualProvider = IMAGE_PROVIDERS.PLACEHOLDER;
          }
        } catch (apiError) {
          console.error(`API error for provider ${provider}:`, apiError);
          // Fallback to placeholder on API error
          imageUrl = generatePlaceholderUrl(item);
          actualProvider = IMAGE_PROVIDERS.PLACEHOLDER;
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
            generation_provider: actualProvider,
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
              provider: actualProvider,
              generation_time_ms: Date.now() - startTime
            }
          });

        // Log cost if not placeholder
        if (actualProvider !== IMAGE_PROVIDERS.PLACEHOLDER) {
          await logGenerationCost(actualProvider, item.product_id, item.id, Date.now() - startTime, true);
        }

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

        // Log failed cost
        await logGenerationCost(provider, item.product_id, item.id, Date.now() - startTime, false, error.message);

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

async function selectBestProvider(): Promise<string> {
  // Check which providers have API keys configured
  const hasStabilityKey = !!Deno.env.get('STABILITY_API_KEY');
  const hasOpenAIKey = !!Deno.env.get('OPENAI_API_KEY');
  
  const availableProviders = [];
  if (hasStabilityKey) availableProviders.push(IMAGE_PROVIDERS.STABLE_DIFFUSION);
  if (hasOpenAIKey) availableProviders.push(IMAGE_PROVIDERS.DALL_E);
  
  if (availableProviders.length === 0) {
    console.warn('No AI provider API keys found, using placeholder');
    return IMAGE_PROVIDERS.PLACEHOLDER;
  }
  
  // Get provider configs from database
  const { data: configs } = await supabase
    .from('ai_provider_config')
    .select('*')
    .in('provider_name', availableProviders)
    .eq('is_active', true)
    .order('quality_score', { ascending: false })
    .limit(1);
  
  if (configs && configs.length > 0) {
    return configs[0].provider_name;
  }
  
  // Default fallback
  return availableProviders[0];
}

async function generateStableDiffusion(prompt: string, negativePrompt?: string): Promise<string> {
  const apiKey = Deno.env.get('STABILITY_API_KEY');
  if (!apiKey) {
    throw new Error('Stability API key not configured');
  }

  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      text_prompts: [
        { text: prompt, weight: 1 },
        ...(negativePrompt ? [{ text: negativePrompt, weight: -1 }] : [])
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Stable Diffusion API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  // Upload base64 image to Supabase Storage
  const imageBase64 = data.artifacts[0].base64;
  const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
  
  const fileName = `hemp-product-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('hemp-product-images')
    .upload(fileName, imageBuffer, {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) {
    throw uploadError;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('hemp-product-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
}

async function generateDallE(prompt: string): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DALL-E API error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const imageUrl = data.data[0].url;
  
  // Download and re-upload to Supabase Storage for persistence
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
  const imageBuffer = await imageBlob.arrayBuffer();
  
  const fileName = `hemp-product-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('hemp-product-images')
    .upload(fileName, new Uint8Array(imageBuffer), {
      contentType: 'image/png',
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) {
    throw uploadError;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('hemp-product-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
}

async function logGenerationCost(
  provider: string, 
  productId: number, 
  queueId: string, 
  generationTimeMs: number, 
  success: boolean,
  errorMessage?: string
): Promise<void> {
  // Get provider config for cost
  const { data: providerConfig } = await supabase
    .from('ai_provider_config')
    .select('cost_per_image')
    .eq('provider_name', provider)
    .single();
  
  const cost = success ? (providerConfig?.cost_per_image || 0) : 0;
  
  await supabase
    .from('ai_generation_costs')
    .insert({
      provider_name: provider,
      product_id: productId,
      queue_id: queueId,
      cost: cost,
      generation_time_ms: generationTimeMs,
      image_size: '1024x1024',
      success: success,
      error_message: errorMessage,
      metadata: {
        edge_function: true,
        timestamp: new Date().toISOString()
      }
    });
}

function generatePlaceholderUrl(item: any): string {
  const productName = item.uses_products?.name || 'Hemp Product';
  const plantPart = item.uses_products?.plant_parts?.name || '';
  
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
  return `https://via.placeholder.com/1024x1024/${color}/FFFFFF?text=${formattedName}`;
}
