# GitHub Actions Setup Guide for Hemp Automation

## 📋 Prerequisites

1. GitHub repository with your hemp automation code
2. Supabase project credentials
3. OpenAI API key

## 🔐 Step 1: Add GitHub Secrets

### Navigate to Repository Settings:
1. Go to your GitHub repository: `https://github.com/[your-username]/[your-repo-name]`
2. Click on **Settings** tab (gear icon)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button

### Add These Secrets:

#### 1. SUPABASE_URL
- **Name**: `SUPABASE_URL`
- **Value**: `https://ktoqznqmlnxrtvubewyz.supabase.co`
- Click "Add secret"

#### 2. SUPABASE_ANON_KEY
- **Name**: `SUPABASE_ANON_KEY`
- **Value**: [Your Supabase anon key from .env file]
- Click "Add secret"

#### 3. OPENAI_API_KEY
- **Name**: `OPENAI_API_KEY`
- **Value**: [Your OpenAI API key from .env file]
- Click "Add secret"

## 📁 Step 2: Prepare Your Repository

### 1. Create requirements.txt
Make sure you have a `requirements.txt` file in your repository root:

```
supabase
openai
python-dotenv
requests
pandas
```

### 2. Update Your Python Scripts
Ensure your scripts accept command-line arguments:

```python
# hemp_agent.py modifications
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--type', help='Agent type to run')
parser.add_argument('--limit', type=int, default=10, help='Limit products per run')
args = parser.parse_args()
```

## 📤 Step 3: Push to GitHub

### 1. Stage Your Changes:
```bash
# From your project directory
cd C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3

# Add all files
git add .

# Commit changes
git commit -m "Add GitHub Actions workflows for hemp automation"
```

### 2. Set Remote Repository (if not already set):
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/[your-username]/[your-repo-name].git

# Or if already exists, verify with:
git remote -v
```

### 3. Push to GitHub:
```bash
# Push to main branch
git push -u origin main

# Or if using master branch:
git push -u origin master
```

## ✅ Step 4: Verify GitHub Actions

### 1. Check Workflows:
- Go to your repository on GitHub
- Click the **Actions** tab
- You should see three workflows:
  - Hemp Product Automation
  - Weekly Hemp Summary Report
  - Hemp Status Check

### 2. Test Manual Run:
- Click on "Hemp Product Automation"
- Click "Run workflow" button
- Select an agent type from dropdown
- Click "Run workflow" (green button)
- Watch the progress in real-time

### 3. Monitor Scheduled Runs:
- Scheduled runs will appear automatically
- Check the Actions tab daily to monitor

## 💰 Cost Optimization

### GitHub Actions Usage (Free Tier: 2,000 minutes/month):

**Estimated Monthly Usage:**
- Seeds-Food: 4 runs/day × 30 days × 5 min = 600 minutes
- Fiber/Oil: 2 runs/day × 30 days × 5 min = 300 minutes
- CBD/Construction: 1 run/day × 30 days × 5 min = 150 minutes
- Others: 0.5 runs/day × 30 days × 5 min = 75 minutes
- Weekly Reports: 4 runs × 10 min = 40 minutes
- Status Checks: 60 runs × 2 min = 120 minutes
- **Total: ~1,285 minutes/month** (64% of free tier)

### OpenAI API Cost Reduction:
- Using `gpt-4o-mini` model (cheapest)
- Limited to 5 products per run
- Staggered scheduling prevents concurrent API calls
- Monitor usage at: https://platform.openai.com/usage

## 🔍 Monitoring & Troubleshooting

### View Logs:
1. Go to Actions tab
2. Click on any workflow run
3. Click on job name to see detailed logs
4. Each step shows output with timestamps

### Common Issues:

**1. Secrets Not Found:**
- Error: "Error: Input required and not supplied: SUPABASE_URL"
- Solution: Double-check secret names (case-sensitive)

**2. Module Import Errors:**
- Error: "ModuleNotFoundError: No module named 'supabase'"
- Solution: Ensure requirements.txt includes all dependencies

**3. Rate Limits:**
- OpenAI: Monitor usage, upgrade plan if needed
- GitHub: Stay under 2,000 minutes/month

**4. Database Connection:**
- Check Supabase project is active (not paused)
- Verify API keys are correct

### Email Notifications:
- GitHub sends email notifications for failed workflows
- Configure in Settings → Notifications

## 📊 Dashboard & Reports

### Weekly Reports Location:
- Actions tab → Weekly Hemp Summary Report
- Click latest run → View summary
- Download artifacts for detailed logs

### Quick Status Checks:
- Run manually anytime from Actions tab
- Automatic health checks twice daily
- Shows last 24 hours of activity

## 🚀 Next Steps

1. **Monitor First Week:**
   - Check Actions tab daily
   - Review any failed runs
   - Adjust scheduling if needed

2. **Optimize Performance:**
   - Increase/decrease agent limits
   - Adjust scheduling based on results
   - Fine-tune product search parameters

3. **Scale Up:**
   - Add more agent types
   - Increase product limits
   - Consider GitHub Actions paid tier for more minutes

## 📞 Support

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Supabase Docs**: https://supabase.com/docs
- **OpenAI Docs**: https://platform.openai.com/docs