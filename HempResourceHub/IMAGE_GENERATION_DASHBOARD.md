# Image Generation Dashboard

This document describes the image generation dashboard that has been integrated into the HempResourceHub frontend.

## Overview

The image generation dashboard provides a comprehensive interface for managing AI-generated product images across multiple providers (DALL-E 3, Midjourney, Stable Diffusion, and Flux).

## Features

### 1. Dashboard Overview (`/admin` → Image Generation tab)
- **Real-time Statistics**: Monitor queue status, costs, and success rates
- **Queue Monitor**: Track pending, processing, completed, and failed generations
- **Provider Performance**: Compare providers by success rate, cost, and speed
- **Products Needing Attention**: Identify products without images or with failed generations

### 2. Product Image Management (Product Detail Pages)
- **Image Generation**: Generate new images using any available provider
- **Image History**: View all generated images for a product
- **Provider Comparison**: See side-by-side comparisons of images from different providers
- **Active Image Selection**: Choose which image to display as the product's main image

## Components Created

### Types
- `HempResourceHub/client/src/types/image-generation.ts`: TypeScript definitions for all image generation entities

### API Functions
- `HempResourceHub/client/src/lib/image-generation-api.ts`: Supabase API functions for image generation operations

### Hooks
- `HempResourceHub/client/src/hooks/useImageGeneration.ts`: React Query hooks for data fetching and mutations

### Components
- `HempResourceHub/client/src/components/admin/image-generation-dashboard.tsx`: Main dashboard component
- `HempResourceHub/client/src/components/product/product-image-management.tsx`: Product-level image management

### Updated Pages
- `HempResourceHub/client/src/pages/admin.tsx`: Added Image Generation tab
- `HempResourceHub/client/src/pages/product-detail.tsx`: Added image management section (admin only)

## Usage

### For Administrators

1. **Access the Dashboard**:
   - Navigate to `/admin`
   - Click on the "Image Generation" tab

2. **Monitor Queue**:
   - View real-time status of image generation tasks
   - Retry failed generations
   - Cancel pending tasks

3. **Track Costs**:
   - Monitor daily, weekly, and monthly costs
   - Compare provider costs

4. **Manage Product Images**:
   - Go to any product detail page
   - Use the "Image Management" section to generate or manage images

### Real-time Updates

The dashboard uses Supabase real-time subscriptions to:
- Update queue status automatically
- Show toast notifications when images are generated
- Refresh statistics as operations complete

## Database Views Used

The dashboard relies on these Supabase views (created in previous chat):
- `image_generation_dashboard`: Main statistics
- `image_generation_monitor`: Detailed queue monitoring
- `provider_performance_stats`: Provider comparison metrics
- `products_needing_attention`: Products requiring image attention
- `image_comparison_view`: Side-by-side provider comparisons

## Authentication Note

Currently, the image management section on product pages is shown when:
- `localStorage.isAdmin === 'true'`
- URL contains `?admin=true`

You should implement proper authentication/authorization for production use.

## Future Enhancements

1. **Bulk Operations**: Generate images for multiple products at once
2. **Custom Prompts**: Allow editing of generation prompts
3. **A/B Testing**: Compare image performance across providers
4. **Automated Generation**: Schedule automatic image generation for new products
5. **Image Quality Scoring**: AI-powered quality assessment
6. **Cost Budgets**: Set and monitor cost limits

## Environment Variables

Ensure your backend has these configured:
```
OPENAI_API_KEY=your_openai_key
MIDJOURNEY_API_KEY=your_midjourney_key
STABILITY_API_KEY=your_stability_key
FLUX_API_KEY=your_flux_key
```

## Troubleshooting

1. **Images not generating**: Check API keys and provider status
2. **Real-time updates not working**: Ensure Supabase realtime is enabled
3. **Dashboard not loading**: Verify database views are created
4. **Access issues**: Check admin authentication logic
