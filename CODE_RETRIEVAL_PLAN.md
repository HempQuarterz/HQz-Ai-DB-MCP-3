# 📋 HempQuarterz AI Agents - Code Retrieval Plan

## 🎯 Overview
You need to retrieve 7 main files from your previous Claude chats. Here's a detailed plan to find and place each one.

---

## 📁 File 1: Base Agent Class (CRITICAL - Do This First!)
**File:** `agents/core/base_agent.py`  
**Estimated Size:** 200-300 lines

### 🔍 How to Find It:
1. Search your Claude chat history for these terms:
   - "BaseAgent class"
   - "@rate_limited" 
   - "@track_performance"
   - "class BaseAgent:"
   - "Performance tracking decorator"

2. Look for code that includes:
   ```python
   import functools
   import time
   from typing import Dict, Any, Callable
   import logging
   
   def rate_limited(calls_per_minute: int):
       """Rate limiting decorator"""
   
   def track_performance(func: Callable):
       """Performance tracking decorator"""
   
   class BaseAgent:
       """Base class for all agents"""
       def __init__(self, config: Dict[str, Any], agent_name: str):
   ```

3. The file should contain:
   - Two decorators: `@rate_limited` and `@track_performance`
   - A `BaseAgent` class with methods like:
     - `__init__`
     - `log_task`
     - `track_cost`
     - `handle_error`

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\core\base_agent.py`

---

## 📁 File 2: AI Utils
**File:** `agents/utils/ai_utils.py`  
**Estimated Size:** 100-150 lines

### 🔍 How to Find It:
1. Search for:
   - "get_ai_client"
   - "AIProvider"
   - "enum AIProvider"
   - "class AIClient"

2. Look for code that includes:
   ```python
   from enum import Enum
   import openai
   import anthropic
   
   class AIProvider(Enum):
       OPENAI = "openai"
       CLAUDE = "claude"
       GPT4O = "gpt-4o"
   
   def get_ai_client(provider: AIProvider):
       """Factory function to get AI client"""
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\utils\ai_utils.py`

---

## 📁 File 3: Orchestrator Agent
**File:** `agents/core/orchestrator.py`  
**Estimated Size:** 300-400 lines

### 🔍 How to Find It:
1. Search for:
   - "class Orchestrator(BaseAgent)"
   - "LangGraph"
   - "dispatch_task"
   - "run_workflow"
   - "agent orchestration"

2. Look for code that includes:
   ```python
   from langgraph.graph import StateGraph
   from ..base_agent import BaseAgent
   
   class Orchestrator(BaseAgent):
       """Main orchestrator agent that coordinates all other agents"""
       
       async def dispatch_task(self, agent_name: str, task_type: str):
       async def run_workflow(self, workflow_name: str):
       async def prioritize_tasks(self):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\core\orchestrator.py`

---

## 📁 File 4: Research Agent
**File:** `agents/research/research_agent.py`  
**Estimated Size:** 250-350 lines

### 🔍 How to Find It:
1. Search for:
   - "class ResearchAgent(BaseAgent)"
   - "discover_products"
   - "analyze_market_trends"
   - "scrape_product_data"
   - "hemp research"

2. Look for code that includes:
   ```python
   import feedparser
   from bs4 import BeautifulSoup
   
   class ResearchAgent(BaseAgent):
       """Agent responsible for market research and product discovery"""
       
       async def discover_products(self):
       async def analyze_market_trends(self):
       async def scrape_product_data(self, url: str):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\research\research_agent.py`

---

## 📁 File 5: Content Agent
**File:** `agents/content/content_agent.py`  
**Estimated Size:** 300-400 lines

### 🔍 How to Find It:
1. Search for:
   - "class ContentAgent(BaseAgent)"
   - "generate_blog_post"
   - "generate_product_description"
   - "generate_email"
   - "SEO optimization"

2. Look for code that includes:
   ```python
   import textstat
   
   class ContentAgent(BaseAgent):
       """Agent responsible for content generation"""
       
       async def generate_blog_post(self, topic: str, keywords: List[str]):
       async def generate_product_description(self, product_data: Dict):
       async def optimize_seo(self, content: str):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\content\content_agent.py`

---

## 📁 File 6: SEO Agent
**File:** `agents/seo/seo_agent.py`  
**Estimated Size:** 250-350 lines

### 🔍 How to Find It:
1. Search for:
   - "class SEOAgent(BaseAgent)"
   - "analyze_site_performance"
   - "keyword_research"
   - "competitor_analysis"
   - "generate_meta_descriptions"

2. Look for code that includes:
   ```python
   from pytrends.request import TrendReq
   
   class SEOAgent(BaseAgent):
       """Agent responsible for SEO optimization"""
       
       async def analyze_site_performance(self):
       async def keyword_research(self, seed_keywords: List[str]):
       async def analyze_competitors(self):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\seo\seo_agent.py`

---

## 📁 File 7: Outreach Agent
**File:** `agents/outreach/outreach_agent.py`  
**Estimated Size:** 300-400 lines

### 🔍 How to Find It:
1. Search for:
   - "class OutreachAgent(BaseAgent)"
   - "create_email_campaign"
   - "send_partnership_email"
   - "manage_follow_ups"
   - "email templates"

2. Look for code that includes:
   ```python
   import sendgrid
   
   class OutreachAgent(BaseAgent):
       """Agent responsible for email outreach and partnerships"""
       
       async def create_email_campaign(self, campaign_type: str):
       async def send_partnership_email(self, recipient: Dict):
       async def analyze_response_sentiment(self):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\outreach\outreach_agent.py`

---

## 📁 File 8: Monetization Agent
**File:** `agents/monetization/monetization_agent.py`  
**Estimated Size:** 350-400 lines

### 🔍 How to Find It:
1. Search for:
   - "class MonetizationAgent(BaseAgent)"
   - "analyze_market_gaps"
   - "generate_business_case"
   - "forecast_revenue"
   - "competitor_pricing_analysis"

2. Look for code that includes:
   ```python
   import numpy as np
   
   class MonetizationAgent(BaseAgent):
       """Agent responsible for identifying monetization opportunities"""
       
       async def analyze_market_gaps(self):
       async def generate_business_case(self, opportunity_id: str):
       async def forecast_revenue(self, product_data: Dict):
   ```

### 📌 Where to Paste:
`C:\Users\hempq\OneDrive\Desktop\HQz-Ai-DB-MCP-3\agents\monetization\monetization_agent.py`

---

## ✅ Verification Steps

After pasting each file, verify it's correct:

### 1. Check File Sizes
Each agent file should be between 200-400 lines. If a file is much smaller, you might be missing part of it.

### 2. Test Imports
Create a test file `test_imports.py`:

```python
try:
    from agents.core.base_agent import BaseAgent, rate_limited, track_performance
    print("✅ BaseAgent imported successfully")
except ImportError as e:
    print(f"❌ BaseAgent import failed: {e}")

try:
    from agents.utils.ai_utils import get_ai_client, AIProvider
    print("✅ AI Utils imported successfully")
except ImportError as e:
    print(f"❌ AI Utils import failed: {e}")

try:
    from agents.core.orchestrator import Orchestrator
    print("✅ Orchestrator imported successfully")
except ImportError as e:
    print(f"❌ Orchestrator import failed: {e}")

# ... repeat for all agents
```

### 3. Check Class Structure
Each agent should:
- Inherit from `BaseAgent`
- Have an `__init__` method that calls `super().__init__(config, "Agent Name")`
- Have async methods decorated with `@track_performance` and `@rate_limited`

---

## 🔄 Order of Operations

1. **FIRST**: Find and paste `base_agent.py` - Everything depends on this
2. **SECOND**: Find and paste `ai_utils.py` - Many agents use this
3. **THEN**: Paste the remaining agents in any order

---

## 💡 Search Tips

1. **Use Quote Marks**: Search for exact phrases like `"class BaseAgent"` in your chat history
2. **Look for Session Markers**: The code might be after phrases like:
   - "Here's the implementation for..."
   - "Creating the [Agent Name] agent..."
   - "Let me implement..."
3. **Check Multiple Sessions**: The agents might have been created across different chat sessions
4. **Look for Long Code Blocks**: Agent implementations are typically 200+ lines in a single code block

---

## 🚨 Common Issues

1. **Missing Imports**: If you get import errors, you might be missing the top part of a file
2. **Indentation Errors**: Python is sensitive to indentation - make sure it's consistent
3. **Missing Methods**: Each agent should have several async methods - if you only see 1-2, you might be missing code

---

## 📞 Need Help?

If you can't find a specific agent, let me know which one and I can help you identify what to search for or potentially recreate it based on the system design.