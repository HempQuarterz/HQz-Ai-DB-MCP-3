# 🚀 GitHub Actions Quick Reference

## ⚡ Immediate Next Steps:

### 1️⃣ Add Command-Line Arguments to hemp_agent.py
Look at `hemp_agent_modifications.py` for the code to add

### 2️⃣ Add GitHub Secrets:
```
Repository → Settings → Secrets → Actions → New Secret

SUPABASE_URL = https://ktoqznqmlnxrtvubewyz.supabase.co
SUPABASE_ANON_KEY = [from your .env file]
OPENAI_API_KEY = [from your .env file]
```

### 3️⃣ Push to GitHub:
```bash
git add .
git commit -m "Add GitHub Actions for hemp automation"
git push origin main
```

### 4️⃣ Test Manual Run:
Actions tab → Hemp Product Automation → Run workflow → Select agent → Run

## 📅 Automation Schedule:
- **High Priority** (seeds-food): Every 6 hours
- **Medium Priority** (fiber, oil): Every 12 hours  
- **Low Priority** (cbd, construction): Daily
- **Archive** (others): Every 2 days

## 📊 Free Tier Usage:
- **Used**: ~1,285 minutes/month
- **Available**: 2,000 minutes/month
- **Buffer**: 715 minutes for testing

## 🔗 Quick Links:
- Actions: `https://github.com/[username]/[repo]/actions`
- Secrets: `https://github.com/[username]/[repo]/settings/secrets/actions`
- Workflows: `.github/workflows/`

## ❓ Help:
- Full guide: `GITHUB_ACTIONS_SETUP.md`
- Modifications: `hemp_agent_modifications.py`
- Summary: `SETUP_COMPLETE.md`