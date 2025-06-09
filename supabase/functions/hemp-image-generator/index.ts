import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// API Keys from environment
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const STABILITY_API_KEY = Deno.env.get('STABILITY_API_KEY');

// Image generation providers configuration
const IMAGE_PROVIDERS = {
  PLACEHOLDER: 'placeholder',
  STABLE_DIFFUSION: 'stable_diffusion',
  DALL_E: 'dall_e_3',
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

    const requestBody = await req.json();
    const { 
      batchSize = 10, 
      provider = IMAGE_PROVIDERS.PLACEHOLDER,
      productId,
      productName,
      productDescription,
      forceProvider
    } = requestBody;

    // If specific product is requested
    if (productId && productName) {
      const imageUrl = await generateSingleImage(
        productId,
        productName,
        productDescription || '',
        forceProvider || provider
      );
      
      return new Response(JSON.stringify({
        success: true,
        imageUrl,
        provider: forceProvider || provider
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }

    // Batch processing
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
          description,
          plant_parts (name),
          industry_sub_categories (
            name,
            industries (name)
          )
        )
      `)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at')
      .limit(batchSize);

    if (queueError) throw queueError;

    const results = {
      processed: 0,
      success: 0,
      failed: 0,
      errors: []
    };

    for (const item of queue || []) {
      try {
        let imageUrl = '';
        
        const productName = item.uses_products?.name || 'Hemp Product';
        const productDescription = item.uses_products?.description || '';
        const plantPart = item.uses_products?.plant_parts?.name || '';
        const industry = item.uses_products?.industry_sub_categories?.industries?.name || '';
        
        // Generate prompt if not provided
        const prompt = item.prompt || generatePrompt(productName, productDescription, plantPart, industry);
        
        // Generate image based on provider
        imageUrl = await generateImageByProvider(
          provider,
          prompt,
          productName,
          item.style_preset,
          item.negative_prompt
        );

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

async function generateSingleImage(
  productId: number,
  productName: string,
  productDescription: string,
  provider: string
): Promise<string> {
  const prompt = generatePrompt(productName, productDescription, '', '');
  return generateImageByProvider(provider, prompt, productName, 'product_photography', '');
}

async function generateImageByProvider(
  provider: string,
  prompt: string,
  productName: string,
  stylePreset?: string,
  negativePrompt?: string
): Promise<string> {
  switch (provider) {
    case IMAGE_PROVIDERS.STABLE_DIFFUSION:
      return generateWithStableDiffusion(prompt, stylePreset, negativePrompt);
    case IMAGE_PROVIDERS.DALL_E:
      return generateWithDallE(prompt);
    case IMAGE_PROVIDERS.PLACEHOLDER:
    default:
      return generatePlaceholderUrl(productName);
  }
}

async function generateWithStableDiffusion(
  prompt: string,
  stylePreset: string = 'product-photography',
  negativePrompt?: string
): Promise<string> {
  if (!STABILITY_API_KEY) {
    console.log('Stability API key not found, falling back to placeholder');
    return generatePlaceholderUrl(prompt.substring(0, 30));
  }

  try {
    const engineId = 'stable-diffusion-v1-6';
    const apiHost = 'https://api.stability.ai';
    
    const response = await fetch(
      `${apiHost}/v1/generation/${engineId}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            ...(negativePrompt ? [{
              text: negativePrompt,
              weight: -1
            }] : [])
          ],
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30,
          samples: 1,
          style_preset: stylePreset,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`);
    }

    const responseJSON = await response.json();
    const base64Image = responseJSON.artifacts[0].base64;
    
    // Convert base64 to blob and upload to Supabase storage
    const imageBlob = base64ToBlob(base64Image, 'image/png');
    const fileName = `products/${Date.now()}_${sanitizeFileName(prompt.substring(0, 30))}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Stable Diffusion error:', error);
    throw error;
  }
}

async function generateWithDallE(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.log('OpenAI API key not found, falling back to placeholder');
    return generatePlaceholderUrl(prompt.substring(0, 30));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    
    // Download and re-upload to Supabase storage for persistence
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    const fileName = `products/${Date.now()}_${sanitizeFileName(prompt.substring(0, 30))}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('DALL-E error:', error);
    throw error;
  }
}

function generatePrompt(
  productName: string,
  productDescription: string,
  plantPart: string,
  industry: string
): string {
  let prompt = `Professional product photography of ${productName}`;
  
  if (productDescription) {
    prompt += `, ${productDescription}`;
  }
  
  if (plantPart) {
    prompt += `, made from hemp ${plantPart}`;
  }
  
  if (industry) {
    prompt += `, for ${industry} industry`;
  }
  
  prompt += ', clean white background, studio lighting, high quality, commercial photography, 4k, sharp focus';
  
  return prompt;
}

function generatePlaceholderUrl(productName: string): string {
  // Use a placeholder service with customization
  const encodedText = encodeURIComponent(productName);
  const bgColor = '2a9d8f';
  const textColor = 'ffffff';
  return `https://via.placeholder.com/512x512/${bgColor}/${textColor}?text=${encodedText}`;
}

function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
}