#!/usr/bin/env python3
"""
HempQuarterz AI Agent System - Verification Script
Run this after pasting all agent files to verify everything is in place
"""

import os
import sys
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent
sys.path.insert(0, str(project_dir))

print("🔍 HempQuarterz AI Agent System Verification")
print("=" * 50)

# Track results
results = {
    "files_found": 0,
    "files_missing": 0,
    "imports_success": 0,
    "imports_failed": 0
}

# Define expected files and their minimum sizes
expected_files = {
    "agents/core/base_agent.py": 200,
    "agents/core/orchestrator.py": 300,
    "agents/research/research_agent.py": 250,
    "agents/content/content_agent.py": 300,
    "agents/seo/seo_agent.py": 250,
    "agents/outreach/outreach_agent.py": 300,
    "agents/monetization/monetization_agent.py": 350,
    "agents/compliance/compliance_agent.py": 350,  # Already exists
    "agents/utils/ai_utils.py": 100,
    "config/agent_config.yaml": 300,
    "migrations/004_agent_infrastructure.sql": 400
}

print("\n📁 Checking File Existence and Sizes:")
print("-" * 50)

for file_path, min_lines in expected_files.items():
    full_path = project_dir / file_path
    if full_path.exists():
        with open(full_path, 'r', encoding='utf-8') as f:
            line_count = len(f.readlines())
        
        if line_count >= min_lines:
            print(f"✅ {file_path} ({line_count} lines)")
            results["files_found"] += 1
        else:
            print(f"⚠️  {file_path} ({line_count} lines - expected >{min_lines})")
            results["files_found"] += 1
    else:
        print(f"❌ {file_path} - MISSING")
        results["files_missing"] += 1

print("\n🔌 Testing Imports:")
print("-" * 50)

# Test imports
import_tests = [
    ("Base Agent", "from agents.core.base_agent import BaseAgent, rate_limited, track_performance"),
    ("AI Utils", "from agents.utils.ai_utils import get_ai_client, AIProvider"),
    ("Orchestrator", "from agents.core.orchestrator import Orchestrator"),
    ("Research Agent", "from agents.research.research_agent import ResearchAgent"),
    ("Content Agent", "from agents.content.content_agent import ContentAgent"),
    ("SEO Agent", "from agents.seo.seo_agent import SEOAgent"),
    ("Outreach Agent", "from agents.outreach.outreach_agent import OutreachAgent"),
    ("Monetization Agent", "from agents.monetization.monetization_agent import MonetizationAgent"),
    ("Compliance Agent", "from agents.compliance.compliance_agent import ComplianceAgent"),
]

for name, import_statement in import_tests:
    try:
        exec(import_statement)
        print(f"✅ {name} imported successfully")
        results["imports_success"] += 1
    except ImportError as e:
        print(f"❌ {name} import failed: {str(e)}")
        results["imports_failed"] += 1
    except Exception as e:
        print(f"❌ {name} import error: {type(e).__name__}: {str(e)}")
        results["imports_failed"] += 1

print("\n🧪 Testing Agent Registry:")
print("-" * 50)

try:
    from agents import AGENT_REGISTRY, get_agent
    print(f"✅ Agent Registry loaded with {len(AGENT_REGISTRY)} agents:")
    for agent_name in AGENT_REGISTRY:
        print(f"   • {agent_name}")
except Exception as e:
    print(f"❌ Failed to load Agent Registry: {str(e)}")

print("\n📊 Summary:")
print("-" * 50)
print(f"Files Found: {results['files_found']}/{len(expected_files)}")
print(f"Files Missing: {results['files_missing']}")
print(f"Imports Success: {results['imports_success']}/{len(import_tests)}")
print(f"Imports Failed: {results['imports_failed']}")

# Overall status
if results["files_missing"] == 0 and results["imports_failed"] == 0:
    print("\n✅ All systems operational! The HempQuarterz AI Agent System is ready to use.")
else:
    print("\n⚠️  Some components are missing. Please check the files listed above.")
    
    if results["files_missing"] > 0:
        print("\n📝 Next Steps:")
        print("1. Find the missing files in your previous Claude chats")
        print("2. Use the search terms in CODE_RETRIEVAL_PLAN.md")
        print("3. Paste the code into the appropriate files")
        print("4. Run this verification script again")

print("\n🚀 Quick Start Commands:")
print("-" * 50)
print("# Run database migration:")
print("psql $DATABASE_URL -f migrations/004_agent_infrastructure.sql")
print("\n# Test Compliance Agent:")
print("python agents/compliance/compliance_agent.py --test")
print("\n# Run example usage:")
print("python example_agent_usage.py")
