# Setting Up Supabase Secrets for AI Providers

## 1. Install Supabase CLI

For Windows (using Git Bash):
```bash
# Download the CLI
curl -o supabase.exe -L https://github.com/supabase/cli/releases/download/v1.137.2/supabase_1.137.2_windows_amd64.tar.gz

# Or use npm (if you have Node.js installed)
npm install -g supabase
```

## 2. Login to Supabase

```bash
supabase login
```
This will open a browser window for authentication.

## 3. Link Your Project

```bash
cd C:/Users/hempq/OneDrive/Desktop/HQz-Ai-DB-MCP-3
supabase link --project-ref ktoqznqmlnxrtvubewyz
```

## 4. Set Edge Function Secrets

```bash
# For Stable Diffusion (Stability AI)
supabase secrets set STABILITY_API_KEY="your-stability-api-key"

# For DALL-E 3 (you already have this in .env)
supabase secrets set OPENAI_API_KEY="your-openai-api-key"

# For Imagen 3 (Google)
supabase secrets set GOOGLE_API_KEY="your-google-api-key"

# For Midjourney (if using unofficial API)
supabase secrets set MIDJOURNEY_API_KEY="your-midjourney-api-key"
```

## 5. Verify Secrets

```bash
supabase secrets list
```

## Important Notes:
- Secrets are immediately available to your Edge Function
- No need to redeploy the function after adding secrets
- Secrets are encrypted and secure
