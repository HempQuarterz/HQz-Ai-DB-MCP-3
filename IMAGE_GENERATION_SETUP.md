# Image Generation Setup Guide

## Prerequisites

1. **Supabase Project** with the hemp database already set up
2. **Python 3.7+** installed
3. **API Keys** (optional, for AI providers):
   - Stability AI API key (for Stable Diffusion)
   - OpenAI API key (for DALL-E)

## Quick Setup

### 1. Environment Configuration

Add the following to your `.env` file:

```bash
# Required
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for AI image generation)
IMAGE_GENERATION_PROVIDER=placeholder  # Options: placeholder, stable_diffusion, dall_e
STABILITY_API_KEY=your_stability_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 2. Database Setup

Run the migration SQL in your Supabase SQL editor:

```sql
-- Copy the contents of image_generation/schema_image_generation.sql
-- Paste and run in Supabase SQL editor
```

### 3. Initial Setup

Run the setup script to queue all products:

```bash
python image_generation/setup_image_generation.py
```

This will:
- Verify all tables are created
- Queue all products without images
- Set up the default schedule
- Display initial statistics

### 4. Start Image Generation

#### Option A: Run Once
```bash
python image_generation/hemp_image_generator.py
```

#### Option B: Run Continuously
```bash
python image_generation/hemp_image_generator.py --mode continuous --interval 15
```

#### Option C: Monitor Progress
```bash
python image_generation/hemp_image_generator.py --mode monitor
```

## Edge Function Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

### 4. Deploy the Function

```bash
supabase functions deploy hemp-image-generator
```

### 5. Set Environment Variables

```bash
supabase secrets set STABILITY_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
```

## Using the System

### Command Line Options

```bash
# Process a specific batch size
python image_generation/hemp_image_generator.py --batch-size 20

# Use a specific provider
python image_generation/hemp_image_generator.py --provider stable_diffusion

# Continuous mode with custom interval
python image_generation/hemp_image_generator.py --mode continuous --interval 30 --max-runs 10
```

### Monitoring via SQL

```sql
-- Check overall progress
SELECT * FROM image_generation_dashboard;

-- View recent activity
SELECT * FROM image_generation_history 
ORDER BY created_at DESC 
LIMIT 20;

-- Check failed generations
SELECT 
    igq.*,
    up.name as product_name
FROM image_generation_queue igq
JOIN uses_products up ON igq.product_id = up.id
WHERE igq.status = 'failed';
```

### Using the Edge Function

```bash
# Call the edge function
curl -X POST https://your-project.supabase.co/functions/v1/hemp-image-generator \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 20, "provider": "placeholder"}'
```

## GitHub Actions Setup

The system includes a GitHub Actions workflow for automated generation:

1. Add secrets to your repository:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `STABILITY_API_KEY` (optional)
   - `OPENAI_API_KEY` (optional)

2. The workflow runs:
   - Every 6 hours automatically
   - On manual trigger with custom parameters

## Troubleshooting

### Common Issues

1. **"Missing Supabase credentials"**
   - Ensure `.env` file exists and contains correct credentials
   - Run `source .env` or restart your terminal

2. **"Table does not exist"**
   - Run the SQL migration in Supabase
   - Verify you're connected to the correct project

3. **"No products queued"**
   - Check if products already have images
   - Verify products exist in the database

4. **Edge Function Not Working**
   - Check function logs: `supabase functions logs hemp-image-generator`
   - Verify environment variables are set
   - Check CORS settings if calling from browser

### Performance Tips

1. **Start with smaller batches** to test the system
2. **Use placeholder provider** for initial testing
3. **Monitor API costs** when using paid providers
4. **Adjust batch sizes** based on API rate limits

## API Provider Configuration

### Stable Diffusion (Stability AI)

1. Get API key from: https://platform.stability.ai/
2. Add to environment: `STABILITY_API_KEY=your_key`
3. Set provider: `IMAGE_GENERATION_PROVIDER=stable_diffusion`

### DALL-E (OpenAI)

1. Get API key from: https://platform.openai.com/
2. Add to environment: `OPENAI_API_KEY=your_key`
3. Set provider: `IMAGE_GENERATION_PROVIDER=dall_e`

## Next Steps

1. **Customize Prompts**: Edit `generate_image_prompt` function in the schema
2. **Add CDN Upload**: Integrate with Cloudinary or similar
3. **Implement Caching**: Store generated images in cloud storage
4. **Add Image Variations**: Generate multiple options per product
5. **User Feedback**: Allow voting on best images