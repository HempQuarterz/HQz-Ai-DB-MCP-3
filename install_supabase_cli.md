# Installing Supabase CLI on Windows

## Option 1: Using Scoop (Recommended)

```bash
# Install Scoop if you don't have it
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## Option 2: Direct Download

1. Go to: https://github.com/supabase/cli/releases
2. Download `supabase_windows_amd64.tar.gz` from the latest release
3. Extract it to a folder (e.g., `C:\supabase`)
4. Add that folder to your PATH

## Option 3: Use npx (No Installation Required)

Instead of installing, you can use npx for all commands:

```bash
# Login
npx supabase login

# Link project
npx supabase link --project-ref ktoqznqmlnxrtvubewyz

# Deploy function
npx supabase functions deploy hemp-image-generator

# Set secrets
npx supabase secrets set OPENAI_API_KEY=$OPENAI_API_KEY
```

## Option 4: Alternative - Use the Supabase Dashboard

If CLI installation is problematic, you can:

1. **Deploy via Dashboard**:
   - Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/functions
   - Click "New function"
   - Name: `hemp-image-generator`
   - Copy the code from `supabase/functions/hemp-image-generator/index.ts`

2. **Set Secrets via Dashboard**:
   - Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/settings/vault
   - Add new secret: `OPENAI_API_KEY`
   - Add new secret: `STABILITY_API_KEY` (if you have one)

## Quick Test Without CLI

Once your function is deployed (via any method above), test it:

```bash
# Using curl
curl -X POST https://ktoqznqmlnxrtvubewyz.supabase.co/functions/v1/hemp-image-generator \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"productId\": 1, \"productName\": \"Test Product\", \"forceProvider\": \"dall_e_3\"}"
```

Or create a simple test script `test_edge_function.py`:

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

url = "https://ktoqznqmlnxrtvubewyz.supabase.co/functions/v1/hemp-image-generator"
headers = {
    "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
    "Content-Type": "application/json"
}
data = {
    "productId": 1,
    "productName": "Test Hemp Oil",
    "forceProvider": "dall_e_3"
}

response = requests.post(url, json=data, headers=headers)
print(response.status_code)
print(response.json())
```