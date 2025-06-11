# 🚀 HempQuarterz Agent Code Retrieval Checklist

## Quick Reference Guide

Use this checklist to track your progress retrieving code from previous chats.

### ⚡ Priority Order (Do These First!)

1. - [ ] **BaseAgent** (`agents/core/base_agent.py`)
   - Search: `"class BaseAgent"` OR `"@rate_limited"`
   - Must have: decorators + BaseAgent class
   - Size: ~200-300 lines

2. - [ ] **AI Utils** (`agents/utils/ai_utils.py`)
   - Search: `"get_ai_client"` OR `"AIProvider"`
   - Must have: AIProvider enum + get_ai_client function
   - Size: ~100-150 lines

### 📦 Main Agents (Do These Next)

3. - [ ] **Orchestrator** (`agents/core/orchestrator.py`)
   - Search: `"class Orchestrator(BaseAgent)"` OR `"LangGraph"`
   - Must have: dispatch_task, run_workflow methods
   - Size: ~300-400 lines

4. - [ ] **Research Agent** (`agents/research/research_agent.py`)
   - Search: `"class ResearchAgent"` OR `"discover_products"`
   - Must have: market research methods
   - Size: ~250-350 lines

5. - [ ] **Content Agent** (`agents/content/content_agent.py`)
   - Search: `"class ContentAgent"` OR `"generate_blog_post"`
   - Must have: content generation methods
   - Size: ~300-400 lines

6. - [ ] **SEO Agent** (`agents/seo/seo_agent.py`)
   - Search: `"class SEOAgent"` OR `"keyword_research"`
   - Must have: SEO analysis methods
   - Size: ~250-350 lines

7. - [ ] **Outreach Agent** (`agents/outreach/outreach_agent.py`)
   - Search: `"class OutreachAgent"` OR `"email_campaign"`
   - Must have: email campaign methods
   - Size: ~300-400 lines

8. - [ ] **Monetization Agent** (`agents/monetization/monetization_agent.py`)
   - Search: `"class MonetizationAgent"` OR `"market_gaps"`
   - Must have: business opportunity methods
   - Size: ~350-400 lines

### ✅ Already Complete
- [x] Compliance Agent (all files)
- [x] Configuration (agent_config.yaml)
- [x] Database Migration
- [x] All __init__.py files

### 🔍 Quick Search Patterns

Copy these into your chat search:

```
# For BaseAgent:
"def rate_limited" OR "@rate_limited" OR "class BaseAgent"

# For AI Utils:
"get_ai_client" OR "AIProvider.CLAUDE" OR "enum AIProvider"

# For Orchestrator:
"from langgraph" OR "StateGraph" OR "orchestrator.py"

# For Research Agent:
"feedparser" OR "discover_products" OR "hemp research agent"

# For Content Agent:
"generate_blog_post" OR "readability_score" OR "content agent"

# For SEO Agent:
"keyword_research" OR "analyze_site_performance" OR "seo agent"

# For Outreach Agent:
"email_campaign" OR "partnership_email" OR "outreach agent"

# For Monetization Agent:
"market_gaps" OR "revenue_forecast" OR "monetization agent"
```

### 🧪 Quick Test After Each File

```python
# Run this after pasting each file:
import sys
sys.path.append(r'C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3')

# Test the file you just added (example for BaseAgent):
from agents.core.base_agent import BaseAgent
print("✅ Import successful!")
```

### 📊 Progress Tracker

Files Found: ___/8
Files Pasted: ___/8
Files Tested: ___/8

### 💡 Tips
- Start with BaseAgent - it's required by all others
- Each file should be 200-400 lines
- If a file seems too short, search for more
- Test imports after each file

Good luck! Check off each item as you complete it.