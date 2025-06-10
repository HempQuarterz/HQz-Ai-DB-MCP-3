# Deploy AI Image Providers - Step by Step Guide

## Prerequisites
- Supabase CLI installed
- Your OpenAI API key (you already have this in .env)
- Stability AI API key (optional, for Stable Diffusion)

## Step 1: Create Storage Bucket (One-time setup)

Go to your Supabase dashboard:
1. Navigate to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/storage/buckets
2. Click "New bucket"
3. Name: `product-images`
4. Public bucket: ✅ (check this)
5. Click "Create bucket"

## Step 2: Install Supabase CLI

```bash
# Using npm (recommended)
npm install -g supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase

# Or download directly for Windows
# Visit: https://github.com/supabase/cli/releases
```

## Step 3: Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref ktoqznqmlnxrtvubewyz
```

## Step 4: Deploy the Enhanced Edge Function

```bash
# Deploy the function
supabase functions deploy hemp-image-generator
```

## Step 5: Set API Keys as Secrets

### Option A: Use your existing OpenAI key (Recommended to start)
```bash
# Windows Git Bash
supabase secrets set OPENAI_API_KEY=$OPENAI_API_KEY

# Or manually with your actual key
supabase secrets set OPENAI_API_KEY=sk-your-actual-key-here
```

### Option B: Add Stability AI for Stable Diffusion (Optional)
1. Get API key from: https://platform.stability.ai/
2. Set the secret:
```bash
supabase secrets set STABILITY_API_KEY=your-stability-key-here
```

## Step 6: Update Your Script to Use Real Providers

Create a new file `test_real_provider.py`:

```python
#!/usr/bin/env python3
import os
import requests
from dotenv import load_dotenv

load_dotenv()

# Test with DALL-E 3
url = f"{os.getenv('SUPABASE_URL')}/functions/v1/hemp-image-generator"
headers = {
    "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
    "Content-Type": "application/json"
}

# Test single product
data = {
    "productId": 1,
    "productName": "Premium Hemp Oil",
    "productDescription": "Cold-pressed organic hemp seed oil",
    "forceProvider": "dall_e_3"  # Use DALL-E 3
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## Step 7: Run Complete Image Generation

After setting up the providers, modify `scripts/complete_all_images.py`:

Replace line 80:
```python
if provider:
    payload["forceProvider"] = provider['provider_name']
```

With:
```python
# Force DALL-E 3 or Stable Diffusion
payload["forceProvider"] = "dall_e_3"  # or "stable_diffusion"
```

Then run:
```bash
python scripts/complete_all_images.py
```

## Cost Estimates

### DALL-E 3
- Cost: $0.040 per image
- Total for 149 products: $5.96
- Quality: Highest (1024x1024)

### Stable Diffusion
- Cost: $0.002 per image
- Total for 149 products: $0.30
- Quality: Good (512x512)

## Troubleshooting

### "Invalid JWT" Error
- Make sure you're using the service role key, not the anon key
- Check that the key is properly set in your .env file

### "Function not found" Error
- The function needs to be deployed first
- Run: `supabase functions deploy hemp-image-generator`

### Images Not Generating
- Check function logs: `supabase functions logs hemp-image-generator`
- Verify API keys are set: `supabase secrets list`

### Storage Error
- Make sure the `product-images` bucket exists and is public
- Check bucket permissions in Supabase dashboard

## Quick Test Command

Test if everything is working:
```bash
curl -X POST https://ktoqznqmlnxrtvubewyz.supabase.co/functions/v1/hemp-image-generator \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "productName": "Test Hemp Product", "forceProvider": "dall_e_3"}'
```

## Next Steps

1. Start with a small batch (5-10 products) to test
2. Monitor costs in your provider dashboards
3. Adjust quality settings if needed
4. Consider implementing a hybrid approach (important products with DALL-E, others with Stable Diffusion)