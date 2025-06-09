# Image Generation Automation System

## Overview

This system provides automated image generation for all hemp products in the database. It includes:

- Automated queue management
- Smart prompt generation based on product attributes
- Multiple image provider support
- Progress tracking and monitoring
- Edge Function for scalable processing

## Components

### 1. Database Schema (`schema_image_generation.sql`)

Creates the necessary tables:
- `image_generation_queue` - Manages the queue of products needing images
- `image_generation_history` - Tracks all generation activities
- `image_generation_schedule` - Manages automated scheduling

### 2. Python Scripts

#### `hemp_image_generator.py`
Main script for managing image generation:
- Queue products for image generation
- Process the queue
- Monitor progress
- Handle retries and failures

#### `setup_image_generation.py`
Initial setup script:
- Creates database tables
- Queues all products without images
- Sets up initial configuration

### 3. Edge Function (`supabase/functions/hemp-image-generator/`)

Serverless function for scalable image processing:
- Batch processing support
- Multiple provider integration
- Error handling and logging

## Quick Start

1. **Set up the database schema:**
   ```bash
   # Run the SQL migration in Supabase SQL editor
   # Use schema_image_generation.sql
   ```

2. **Configure environment:**
   ```bash
   # Add to .env file:
   IMAGE_GENERATION_PROVIDER=placeholder  # or stable_diffusion, dall_e
   STABILITY_API_KEY=your_key_here       # For Stable Diffusion
   OPENAI_API_KEY=your_key_here          # For DALL-E
   ```

3. **Run initial setup:**
   ```bash
   python image_generation/setup_image_generation.py
   ```

4. **Start the generator:**
   ```bash
   python image_generation/hemp_image_generator.py
   ```

## Image Providers

### Currently Supported:
- **Placeholder** - Generates placeholder images (default)
- **Stable Diffusion** - Via Stability AI API (requires API key)
- **DALL-E** - Via OpenAI API (requires API key)
- **Midjourney** - Coming soon

### Provider Configuration:

Edit `hemp_image_generator.py` to change the default provider:
```python
PROVIDER = os.getenv('IMAGE_GENERATION_PROVIDER', 'placeholder')
```

## Monitoring

### Check Progress:
```sql
SELECT * FROM image_generation_dashboard;
```

### View Queue Status:
```sql
SELECT status, COUNT(*) 
FROM image_generation_queue 
GROUP BY status;
```

### Recent Activity:
```sql
SELECT * FROM image_generation_history 
ORDER BY created_at DESC 
LIMIT 20;
```

## Scheduling

The system can run:
1. **Manually** - Run the Python script
2. **Scheduled** - Use cron or task scheduler
3. **Edge Function** - Call via HTTP endpoint
4. **GitHub Actions** - Automated runs

## API Usage

### Edge Function Endpoint:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/hemp-image-generator \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 20, "provider": "stable_diffusion"}'
```

## Troubleshooting

### Common Issues:

1. **Images not generating:**
   - Check API keys in environment
   - Verify provider is correctly configured
   - Check error logs in `image_generation_history`

2. **Slow processing:**
   - Adjust batch size in configuration
   - Check API rate limits
   - Consider using Edge Function for parallel processing

3. **Failed generations:**
   - System automatically retries up to 3 times
   - Check `error_message` in queue table
   - Verify prompts are valid

## Best Practices

1. **Start with placeholder images** to test the system
2. **Monitor API costs** when using paid providers
3. **Use appropriate batch sizes** to avoid rate limits
4. **Regular monitoring** of the dashboard
5. **Backup generated images** to cloud storage

## Future Enhancements

- [ ] Image variation generation
- [ ] A/B testing different prompts
- [ ] Auto-upload to CDN
- [ ] Image optimization pipeline
- [ ] Custom style presets per industry
- [ ] User feedback integration