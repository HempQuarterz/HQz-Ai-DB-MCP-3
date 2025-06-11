import supabase from './supabase-client';
import type { 
  DashboardStats, 
  ImageGenerationQueue, 
  ProviderStats, 
  ProductNeedingAttention,
  ImageComparison,
  ImageGeneration
} from '../types/image-generation';

// Dashboard Statistics
export async function getImageGenerationStats(): Promise<DashboardStats> {
  const { data, error } = await supabase
    .from('image_generation_dashboard')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
}

// Queue Management
export async function getImageGenerationQueue(
  status?: string,
  limit: number = 50
): Promise<ImageGenerationQueue[]> {
  let query = supabase
    .from('image_generation_monitor')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

// Provider Performance
export async function getProviderStats(): Promise<ProviderStats[]> {
  const { data, error } = await supabase
    .from('provider_performance_stats')
    .select('*')
    .order('success_rate', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Products Needing Attention
export async function getProductsNeedingAttention(
  limit: number = 50
): Promise<ProductNeedingAttention[]> {
  const { data, error } = await supabase
    .from('products_needing_attention')
    .select('*')
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}

// Image Comparisons
export async function getImageComparisons(
  productId?: number
): Promise<ImageComparison[]> {
  let query = supabase
    .from('image_comparison_view')
    .select('*');
  
  if (productId) {
    query = query.eq('hemp_product_id', productId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}

// Queue Operations
export async function retryFailedGeneration(queueId: number): Promise<void> {
  const { error } = await supabase
    .from('image_generation_queue')
    .update({ 
      status: 'pending', 
      attempts: 0,
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', queueId);
  
  if (error) throw error;
}

export async function cancelQueueItem(queueId: number): Promise<void> {
  const { error } = await supabase
    .from('image_generation_queue')
    .delete()
    .eq('id', queueId);
  
  if (error) throw error;
}

// Product Image Operations
export async function regenerateProductImage(
  productId: number,
  provider: string
): Promise<void> {
  // Get product details for prompt generation
  const { data: product, error: productError } = await supabase
    .from('hemp_products')
    .select('name, description, plant_parts(name), industries(name)')
    .eq('id', productId)
    .single();
  
  if (productError) throw productError;
  
  // Generate a basic prompt
  const prompt = `Professional product photo of ${product.name}, a hemp-based ${product.industries?.name || 'product'} made from ${product.plant_parts?.name || 'hemp'}. ${product.description}. High quality, white background, commercial photography style.`;
  
  // Add to queue
  const { error } = await supabase
    .from('image_generation_queue')
    .insert({
      hemp_product_id: productId,
      provider,
      prompt,
      status: 'pending',
      attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
}

// Get active images for a product
export async function getProductImages(productId: number): Promise<ImageGeneration[]> {
  const { data, error } = await supabase
    .from('image_generations')
    .select('*')
    .eq('hemp_product_id', productId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Set active image for a product
export async function setActiveImage(
  productId: number,
  imageId: number
): Promise<void> {
  // First, deactivate all images for this product
  const { error: deactivateError } = await supabase
    .from('image_generations')
    .update({ is_active: false })
    .eq('hemp_product_id', productId);
  
  if (deactivateError) throw deactivateError;
  
  // Then activate the selected image
  const { error: activateError } = await supabase
    .from('image_generations')
    .update({ is_active: true })
    .eq('id', imageId);
  
  if (activateError) throw activateError;
  
  // Update the product's image_url
  const { data: image, error: imageError } = await supabase
    .from('image_generations')
    .select('image_url')
    .eq('id', imageId)
    .single();
  
  if (imageError) throw imageError;
  
  const { error: updateError } = await supabase
    .from('hemp_products')
    .update({ image_url: image.image_url })
    .eq('id', productId);
  
  if (updateError) throw updateError;
}

// Real-time subscriptions
export function subscribeToQueueUpdates(
  callback: (payload: any) => void
) {
  return supabase
    .channel('queue-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'image_generation_queue'
      },
      callback
    )
    .subscribe();
}

export function subscribeToImageGenerations(
  productId: number,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`product-images-${productId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'image_generations',
        filter: `hemp_product_id=eq.${productId}`
      },
      callback
    )
    .subscribe();
}
