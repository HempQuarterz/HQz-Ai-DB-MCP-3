// Image Generation type definitions

export type ImageProvider = 'dalle3' | 'midjourney' | 'stable_diffusion' | 'flux';

export type QueueStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retry';

export type ImageGenerationQueue = {
  id: number;
  hemp_product_id: number;
  product_name?: string;
  provider: ImageProvider;
  prompt: string;
  status: QueueStatus;
  attempts: number;
  error_message?: string | null;
  estimated_cost?: number | null;
  actual_cost?: number | null;
  processing_time_seconds?: number | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
};

export type ImageGeneration = {
  id: number;
  hemp_product_id: number;
  product_name?: string;
  provider: ImageProvider;
  prompt: string;
  image_url: string;
  s3_key?: string | null;
  cost?: number | null;
  generation_time_seconds?: number | null;
  metadata?: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at?: string | null;
};

export type DashboardStats = {
  total_in_queue: number;
  pending_count: number;
  processing_count: number;
  completed_count: number;
  failed_count: number;
  daily_cost: number;
  weekly_cost: number;
  monthly_cost: number;
  total_cost: number;
  avg_processing_time: number;
  success_rate: number;
  products_without_images: number;
  products_with_placeholder: number;
};

export type ProviderStats = {
  provider: ImageProvider;
  total_generated: number;
  success_count: number;
  failed_count: number;
  success_rate: number;
  total_cost: number;
  avg_cost: number;
  avg_processing_time: number;
  last_used: string | null;
};

export type ProductNeedingAttention = {
  id: number;
  name: string;
  plant_part_name: string;
  industry_name: string;
  issue_type: 'no_image' | 'placeholder' | 'generation_failed' | 'old_image';
  last_attempt?: string | null;
  failure_count?: number;
  image_url?: string | null;
};

export type ImageComparison = {
  hemp_product_id: number;
  product_name: string;
  dalle3?: {
    image_url: string;
    cost: number;
    generation_time: number;
  } | null;
  midjourney?: {
    image_url: string;
    cost: number;
    generation_time: number;
  } | null;
  stable_diffusion?: {
    image_url: string;
    cost: number;
    generation_time: number;
  } | null;
  flux?: {
    image_url: string;
    cost: number;
    generation_time: number;
  } | null;
};
