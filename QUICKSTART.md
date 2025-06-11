# Quick Start Guide - Hemp Resource Hub

## 🚀 Immediate Actions Required

### 1. Push Your Changes to GitHub
```bash
git push origin main
```
*Note: You'll need to authenticate with GitHub*

### 2. Handle Pull Requests on GitHub

**Close these PRs** (no longer needed):
- PR #1 - Already implemented in codebase
- PR #2 - Outdated approach 
- PR #4 - Files don't exist

**Merge these PRs**:
- PR #6 - Simple README improvement
- PR #3 - Adds search functionality

**Update then merge**:
- PR #5 - Apply fixes from `pr-5-fix` branch first

### 3. Populate Your Database
```bash
# From project root directory
python populate_supabase_db.py
python populate_hemp_products_advanced.py
```

### 4. Start Development Server
```bash
cd HempResourceHub
npm install  # If not done already
npm run dev
```

## 📋 Current Status (Updated: Jan 11, 2025 - 11:30 PM)

### ✅ What's Working
- Supabase connection (frontend)
- Basic UI components
- Plant type cards display
- Stats counter
- Image generation infrastructure
- Table name consistency (FIXED!)
- Foreign key references (FIXED!)

### ❌ What Needs Fixing
- Empty product database
- Server database connection
- Search functionality (after PR #3)

### 🔧 Quick Fixes You Can Do Now

1. **Check your environment variables**:
   ```bash
   # .env should have:
   VITE_SUPABASE_URL=https://ktoqznqmlnxrtvubewyz.supabase.co
   VITE_SUPABASE_ANON_KEY=[your-key]
   DATABASE_URL=postgresql://postgres:[password]@db.ktoqznqmlnxrtvubewyz.supabase.co:5432/postgres
   ```

2. **Verify Supabase connection**:
   - Visit http://localhost:5173/debug-supabase
   - Should show "Connected" status

3. **Test the app**:
   - Home page: http://localhost:5173
   - Products: http://localhost:5173/hemp-dex
   - Admin: http://localhost:5173/admin

## 🎯 Next Development Tasks

1. ✅ ~~**Fix table references** - Update code to use correct table names~~ (COMPLETED)
2. **Add product data** - Run population scripts
3. **Implement search** - Merge PR #3 and create UI
4. **Fix routing** - Update routes to match expected patterns
5. **Fix server connection** - Update DATABASE_URL password encoding

## 📚 Key Documentation

- **Full Status**: See `PROJECT_STATUS_SUMMARY.md`
- **Improvement Plan**: See `COMPREHENSIVE_IMPROVEMENT_PLAN.md`
- **Database Schema**: See `schema.sql`
- **PR Fixes**: See `PR5_FIX_SUMMARY.md`

## 🆘 Troubleshooting

**If products don't show:**
- Database is empty - run population scripts
- Check console for errors about table names

**If server won't start:**
- Check DATABASE_URL encoding
- Verify all npm packages installed
- Check port 5173 isn't in use

**If Supabase errors:**
- Verify your project URL is `ktoqznqmlnxrtvubewyz`
- Check anon key is correct
- Ensure tables exist in Supabase

---

*Start with pushing to GitHub and handling PRs - this will sync your repository and enable collaboration!*

---

# AI Image Generation - Quick Start Guide

## 🚀 Step-by-Step Provider Activation

### Step 1: Get API Keys

1. **Stable Diffusion (Stability AI)** - $0.002/image
   - Sign up at: https://platform.stability.ai/
   - Get API key from: https://platform.stability.ai/account/keys
   - Monthly free tier available

2. **DALL-E 3 (OpenAI)** - $0.040/image  
   - You already have this! (in your .env)
   - If needed: https://platform.openai.com/api-keys

3. **Imagen 3 (Google Cloud)** - $0.020/image
   - Enable Vertex AI: https://console.cloud.google.com/vertex-ai
   - Create service account and download JSON key

4. **Midjourney** - $0.015/image
   - Unofficial APIs: replicate.com or midjourney-api services
   - Note: Less reliable, use as backup

### Step 2: Add Keys to Supabase

**Option A: Via Dashboard (Easiest)**
1. Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz
2. Navigate to: Functions → hemp-image-generator → Secrets
3. Add these secrets:
   - `STABILITY_API_KEY`
   - `OPENAI_API_KEY` 
   - `GOOGLE_API_KEY`
   - `MIDJOURNEY_API_KEY`

**Option B: Via CLI**
```bash
# Install Supabase CLI (one-time)
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref ktoqznqmlnxrtvubewyz

# Add secrets
supabase secrets set STABILITY_API_KEY="your-key-here"
supabase secrets set OPENAI_API_KEY="your-key-here"
```

### Step 3: Test Providers

```bash
cd C:/Users/hempq/OneDrive/Desktop/HQz-Ai-DB-MCP-3
python scripts/test_providers.py
```

This will:
- Show current provider status
- Test individual providers
- Verify API keys are working
- Show actual costs

### Step 4: Choose Migration Strategy

```bash
python scripts/migration_planner.py
```

Recommended approach:
1. **Start with Test Phase**: 10 products across providers
2. **Evaluate results**: Check quality and costs
3. **Choose strategy**:
   - Budget: Use Stable Diffusion ($0.30 total)
   - Quality: Use DALL-E 3 ($5.96 total)
   - Balanced: 80% SD / 20% DALL-E 3 ($2.39 total)

### Step 5: Execute Migration

**For Test Run (10 products):**
```bash
python scripts/run_generation.py
# Select option 7
# Enter IDs: 1,2,3,4,5,6,7,8,9,10
```

**For Full Migration:**
```bash
python scripts/ai_provider_manager.py
# Activate your chosen provider(s)
# Then run:
python scripts/complete_all_images.py
```

## 📊 Monitoring Progress

### Check Generation Status
```bash
python scripts/check_image_status.py
```

### View in Supabase
```sql
-- Check costs
SELECT * FROM ai_generation_costs ORDER BY created_at DESC;

-- Check queue
SELECT * FROM image_generation_queue WHERE status = 'pending';

-- View dashboard
SELECT * FROM dashboard_overview;
```

## 🔧 Troubleshooting

### "API Key Not Found" Error
- Keys must be in Supabase secrets, not .env
- Check spelling: `STABILITY_API_KEY` not `STABLE_DIFFUSION_KEY`
- Verify in dashboard or with: `supabase secrets list`

### Provider Not Working
1. Check if activated: `python scripts/ai_provider_manager.py`
2. Verify API key is valid
3. Check provider's API status page
4. Look at Edge Function logs in Supabase dashboard

### Rate Limiting
- Stable Diffusion: 150 req/10 seconds
- DALL-E 3: 5 images/minute
- Add delays between batches if needed

## 💾 CDN Storage (Future)

Hold off on CDN migration until you have 500+ images. When ready:

1. **Set up CDN bucket** in Supabase Storage
2. **Update Edge Function** to upload to CDN
3. **Migrate existing images** with a batch script
4. **Update uses_products** table with CDN URLs

## 💰 Cost Management

### Budget Alerts
```python
# Add to your generation scripts
MAX_BUDGET = 10.00  # $10 limit
current_cost = get_total_cost()
if current_cost > MAX_BUDGET:
    print("Budget exceeded! Stopping generation.")
    sys.exit()
```

### Cost Optimization
1. Use Stable Diffusion for most products
2. Reserve DALL-E 3 for hero/featured products
3. Generate thumbnails separately (lower cost)
4. Cache and reuse similar product images

## 🎯 Next Actions

1. **Immediate**: Add STABILITY_API_KEY to Supabase
2. **Test**: Run test_providers.py with Stable Diffusion
3. **Verify**: Generate 5-10 test images
4. **Scale**: Use migration_planner.py for full rollout
5. **Monitor**: Check costs and quality regularly

## 📞 Support Resources

- Stability AI Docs: https://platform.stability.ai/docs
- OpenAI Docs: https://platform.openai.com/docs
- Supabase Support: https://supabase.com/docs
- Your GitHub: https://github.com/HempQuarterz/HQz-Ai-DB-MCP-3

Remember: Start small, test thoroughly, then scale up! 🚀
