#!/usr/bin/env python3
"""
Test script to verify all agents are properly implemented
"""

import os
import sys
import asyncio
import logging
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

async def test_agents():
    """Test all agent implementations"""
    
    print("\n=== Hemp AI Agent Test Suite ===\n")
    
    # Test configuration
    config = {
        'supabase_url': os.environ.get('SUPABASE_URL'),
        'supabase_key': os.environ.get('SUPABASE_ANON_KEY'),
    }
    
    results = {}
    
    # Test Research Agent
    try:
        from agents.research.research_agent import ResearchAgent
        print("✅ Research Agent imported successfully")
        
        agent = ResearchAgent(config)
        print("✅ Research Agent initialized")
        
        # Test a method
        products = await agent.discover_hemp_products(
            sources=["https://example.com"],
            limit=1
        )
        print(f"✅ Research Agent discover_hemp_products works - found {len(products)} products")
        results['research_agent'] = 'Active'
        
    except Exception as e:
        print(f"❌ Research Agent error: {e}")
        results['research_agent'] = 'Error'
    
    # Test Content Agent
    try:
        from agents.content.content_agent import ContentAgent
        print("\n✅ Content Agent imported successfully")
        
        agent = ContentAgent(config)
        print("✅ Content Agent initialized")
        
        # Test a method
        blog_post = await agent.generate_blog_post(
            topic="Hemp benefits",
            keywords=["sustainable", "eco-friendly"],
            word_count=100
        )
        print(f"✅ Content Agent generate_blog_post works - generated {len(blog_post.get('content', ''))} chars")
        results['content_agent'] = 'Active'
        
    except Exception as e:
        print(f"❌ Content Agent error: {e}")
        results['content_agent'] = 'Error'
    
    # Test SEO Agent
    try:
        from agents.seo.seo_agent import SEOAgent
        print("\n✅ SEO Agent imported successfully")
        
        agent = SEOAgent(config)
        print("✅ SEO Agent initialized")
        results['seo_agent'] = 'Active'
        
    except ImportError:
        print("❌ SEO Agent not implemented yet")
        results['seo_agent'] = 'Pending'
    except Exception as e:
        print(f"❌ SEO Agent error: {e}")
        results['seo_agent'] = 'Error'
    
    # Test Compliance Agent
    try:
        from agents.compliance.compliance_agent import ComplianceAgent
        print("\n✅ Compliance Agent imported successfully")
        
        agent = ComplianceAgent(config)
        print("✅ Compliance Agent initialized")
        results['compliance_agent'] = 'Active'
        
    except Exception as e:
        print(f"❌ Compliance Agent error: {e}")
        results['compliance_agent'] = 'Error'
    
    # Test Outreach Agent
    try:
        from agents.outreach.outreach_agent import OutreachAgent
        print("\n✅ Outreach Agent imported successfully")
        
        agent = OutreachAgent(config)
        print("✅ Outreach Agent initialized")
        
        # Test a method
        opportunities = await agent.find_partnership_opportunities(
            industry="Hemp Textiles",
            opportunity_type="partnership",
            limit=2
        )
        print(f"✅ Outreach Agent find_partnership_opportunities works - found {len(opportunities)} opportunities")
        results['outreach_agent'] = 'Active'
        
    except Exception as e:
        print(f"❌ Outreach Agent error: {e}")
        results['outreach_agent'] = 'Error'
    
    # Test Monetization Agent
    try:
        from agents.monetization.monetization_agent import MonetizationAgent
        print("\n✅ Monetization Agent imported successfully")
        
        agent = MonetizationAgent(config)
        print("✅ Monetization Agent initialized")
        
        # Test a method
        opportunities = await agent.analyze_product_opportunities()
        print(f"✅ Monetization Agent analyze_product_opportunities works - found {len(opportunities)} opportunities")
        results['monetization_agent'] = 'Active'
        
    except Exception as e:
        print(f"❌ Monetization Agent error: {e}")
        results['monetization_agent'] = 'Error'
    
    # Summary
    print("\n\n=== Agent Status Summary ===")
    print("Agent Name          | Status")
    print("-------------------|--------")
    
    for agent_type, status in results.items():
        agent_name = agent_type.replace('_', ' ').title()
        status_emoji = "✅" if status == "Active" else "⚠️" if status == "Pending" else "❌"
        print(f"{agent_name:<18} | {status_emoji} {status}")
    
    # Overall status
    active_count = sum(1 for status in results.values() if status == "Active")
    total_count = len(results)
    
    print(f"\n✅ Active Agents: {active_count}/{total_count}")
    
    if active_count == total_count:
        print("\n🎉 All agents are active and working!")
    else:
        print(f"\n⚠️  {total_count - active_count} agents need attention")
    
    return results

if __name__ == "__main__":
    # Run the test
    results = asyncio.run(test_agents())
    
    # Exit with appropriate code
    if all(status == "Active" for status in results.values()):
        sys.exit(0)
    else:
        sys.exit(1)