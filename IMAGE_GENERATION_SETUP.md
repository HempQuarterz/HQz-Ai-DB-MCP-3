# Hemp Database AI Image Generation - Setup & Usage Guide

## 🎨 Overview

The Hemp Database now supports real AI image generation using multiple providers:
- **Stable Diffusion** (Stability AI) - High quality, cost-effective
- **DALL-E 3** (OpenAI) - Premium quality, higher cost
- **Placeholder** - Free fallback option

## 🚀 Quick Start

### 1. Set Up API Keys

Copy the environment template and add your API keys:

```bash
cp .env.image-generation .env
# Edit .env and add your API keys
```

Required API keys:
- `STABILITY_API_KEY` - Get from [Stability AI Platform](https://platform.stability.ai/account/keys)
- `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### 2. Deploy the Updated Edge Function

```bash
# Deploy to Supabase
supabase functions deploy hemp-image-generator
```

### 3. Reset Images for AI Generation

To regenerate existing placeholder images with AI:

```sql
-- Reset first 10 products as a test
SELECT * FROM reset_placeholder_images_for_ai_generation(10, 'stable_diffusion');

-- Reset all placeholder images
SELECT * FROM reset_placeholder_images_for_ai_generation(NULL, 'stable_diffusion');

-- Use DALL-E instead
SELECT * FROM reset_placeholder_images_for_ai_generation(NULL, 'dall_e');
```

### 4. Run Image Generation

#### Using Python Script:
```bash
# Test with a small batch
python image_generation/hemp_image_generator.py --batch-size 5

# Run continuous generation
python image_generation/hemp_image_generator.py --mode continuous --interval 5

# Monitor progress
python image_generation/hemp_image_generator.py --mode monitor
```

#### Using Edge Function:
```bash
# Call the edge function
curl -X POST https://[YOUR_PROJECT_ID].supabase.co/functions/v1/hemp-image-generator \
  -H "Authorization: Bearer [YOUR_ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 10, "provider": "stable_diffusion"}'
```

## 📊 Cost Management

### Check Current Costs
```sql
-- View cost summary by provider
SELECT * FROM get_ai_generation_cost_summary();

-- Estimate cost for remaining images
SELECT * FROM estimate_ai_generation_cost('stable_diffusion');
SELECT * FROM estimate_ai_generation_cost('dall_e');
```

### Cost Comparison
| Provider | Cost per Image | Quality | Speed |
|----------|---------------|---------|-------|
| Placeholder | $0.00 | Low | Instant |
| Stable Diffusion | $0.002 | High | Fast |
| DALL-E 3 | $0.04 | Premium | Medium |

## 🔧 Configuration

### Provider Settings

Update provider configuration:
```sql
-- Enable/disable providers
UPDATE ai_provider_config 
SET is_active = true 
WHERE provider_name = 'stable_diffusion';

-- Update rate limits
UPDATE ai_provider_config 
SET rate_limit_per_minute = 10,
    rate_limit_per_hour = 100
WHERE provider_name = 'stable_diffusion';
```

### Image Generation Settings

Customize prompts in `schema_image_generation.sql`:
- Industry-specific styling
- Plant part details
- Quality preferences

## 📈 Monitoring

### Dashboard View
```sql
SELECT * FROM image_generation_dashboard;
```

### Queue Status
```sql
SELECT 
    status,
    generation_provider,
    COUNT(*) as count
FROM image_generation_queue
GROUP BY status, generation_provider
ORDER BY status;
```

### Recent Activity
```sql
SELECT 
    igh.*,
    up.name as product_name
FROM image_generation_history igh
JOIN uses_products up ON igh.product_id = up.id
ORDER BY igh.created_at DESC
LIMIT 20;
```

## 🚨 Troubleshooting

### Common Issues

1. **"No API key found" errors**
   - Ensure API keys are set in environment variables
   - For Edge Functions, set them in Supabase Dashboard > Edge Functions > Secrets

2. **Storage bucket errors**
   - Make sure the bucket exists and is public
   - Check bucket policies allow uploads

3. **Rate limit errors**
   - Reduce batch size
   - Increase interval between runs
   - Check provider rate limits in config

### Debug Mode

Enable detailed logging:
```python
# In Python script
export LOG_LEVEL=DEBUG
python image_generation/hemp_image_generator.py
```

## 🎯 Best Practices

1. **Start Small**: Test with 5-10 products first
2. **Monitor Costs**: Check `ai_generation_costs` table regularly
3. **Use Appropriate Providers**: 
   - Stable Diffusion for bulk generation
   - DALL-E for hero/featured products
4. **Batch Processing**: Process in batches to avoid timeouts
5. **Error Handling**: Failed images automatically retry

## 📝 Example Workflow

```bash
# 1. Set up environment
cp .env.image-generation .env
# Add your API keys to .env

# 2. Reset 5 products for testing
psql -c "SELECT * FROM reset_placeholder_images_for_ai_generation(5, 'stable_diffusion');"

# 3. Generate images
python image_generation/hemp_image_generator.py --batch-size 5

# 4. Check results
python image_generation/hemp_image_generator.py --mode monitor

# 5. If successful, process all remaining
psql -c "SELECT * FROM reset_placeholder_images_for_ai_generation(NULL, 'stable_diffusion');"
python image_generation/hemp_image_generator.py --mode continuous
```

## 🔗 Resources

- [Stability AI Docs](https://platform.stability.ai/docs/api-reference)
- [OpenAI Image Generation](https://platform.openai.com/docs/guides/images)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## 💡 Tips

- Images are stored permanently in Supabase Storage
- Generated URLs are public and CDN-cached
- Prompts are customized per product category
- Failed generations fall back to placeholder
- All costs are tracked for budgeting
