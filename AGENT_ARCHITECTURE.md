# 🏗️ HempQuarterz Agent System Architecture

## 📊 Agent Dependency Diagram

```
                    🎯 BaseAgent (FOUNDATION)
                           |
                    (All agents inherit from this)
                           |
        ┌─────────────────┴─────────────────┐
        |                                   |
    AI Utils                          Orchestrator
        |                                   |
        └───────────┬───────────────────────┘
                    |
    ┌───────────────┼───────────────────┐
    |               |                   |
    |               |                   |
    ├── Research    ├── Content        ├── SEO
    |               |                   |
    ├── Outreach    ├── Monetization   └── Compliance ✅
    |               |                       (Already Done!)
    └───────────────┴───────────────────┘
```

## 🔄 Retrieval Order

### 🥇 Priority 1: Foundation (MUST DO FIRST)
1. **BaseAgent** (`agents/core/base_agent.py`)
   - Contains: `@rate_limited` and `@track_performance` decorators
   - All other agents inherit from this class
   - WITHOUT THIS, NO OTHER AGENTS WILL WORK!

### 🥈 Priority 2: Core Infrastructure
2. **AI Utils** (`agents/utils/ai_utils.py`)
   - Contains: `get_ai_client()` function and `AIProvider` enum
   - Used by most agents for AI operations

3. **Orchestrator** (`agents/core/orchestrator.py`)
   - Coordinates all other agents
   - Manages workflows and task dispatch

### 🥉 Priority 3: Functional Agents (Any Order)
4. **Research Agent** - Market research and product discovery
5. **Content Agent** - Blog posts and product descriptions
6. **SEO Agent** - Search optimization
7. **Outreach Agent** - Email campaigns
8. **Monetization Agent** - Business opportunities

## 🔗 Key Dependencies

```python
# Every agent file starts with:
from ..core.base_agent import BaseAgent, rate_limited, track_performance

# Many agents also need:
from ..utils.ai_utils import get_ai_client, AIProvider
```

## ⚠️ Common Import Errors and Solutions

### Error: `ImportError: cannot import name 'BaseAgent'`
**Solution:** You need to find and paste `base_agent.py` first!

### Error: `ImportError: cannot import name 'get_ai_client'`
**Solution:** You need to find and paste `ai_utils.py`

### Error: `ImportError: attempted relative import with no known parent package`
**Solution:** Make sure you're running from the project root directory

## 📁 File Size Reference

Use these as a guide - if your file is much smaller, you might be missing code:

| Agent | Expected Lines | Key Methods |
|-------|----------------|-------------|
| BaseAgent | 200-300 | `__init__`, decorators |
| AI Utils | 100-150 | `get_ai_client` |
| Orchestrator | 300-400 | `dispatch_task`, `run_workflow` |
| Research | 250-350 | `discover_products` |
| Content | 300-400 | `generate_blog_post` |
| SEO | 250-350 | `keyword_research` |
| Outreach | 300-400 | `create_email_campaign` |
| Monetization | 350-400 | `analyze_market_gaps` |

## 🎯 Success Indicators

You'll know you have the right code when:

1. **BaseAgent** has:
   - Two decorator functions
   - A BaseAgent class with logging methods

2. **Each Agent** has:
   - Inherits from BaseAgent
   - Multiple async methods
   - Uses decorators on methods
   - 200+ lines of code

## 🚦 Quick Status Check

Run this to see your current status:
```bash
python verify_agents.py
```

Green checkmarks (✅) = Ready
Red X marks (❌) = Still needed

## 💡 Remember

The Compliance Agent is already fully functional and can serve as a reference for how the other agents should look. Check its structure if you're unsure about something!