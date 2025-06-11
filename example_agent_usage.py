#!/usr/bin/env python3
"""
HempQuarterz AI Agent System - Example Usage
Demonstrates how to use the complete agent system
"""

import asyncio
import os
from dotenv import load_dotenv
from agents import get_agent, AGENT_REGISTRY

# Load environment variables
load_dotenv()

async def run_compliance_check():
    """Example: Run a compliance check"""
    print("🔍 Running Compliance Check...")
    
    config = {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_SERVICE_KEY'),
        'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
        'stripe_api_key': os.getenv('STRIPE_API_KEY'),
        'email_service': os.getenv('SENDGRID_API_KEY'),
        'slack_webhook_url': os.getenv('SLACK_WEBHOOK_URL')
    }
    
    # Get compliance agent
    compliance_agent = get_agent('compliance', config)
    
    # Check platform compliance
    platform_results = await compliance_agent.check_platform_compliance()
    print(f"✅ Platform compliance checks: {len(platform_results)} issues found")
    
    # Generate compliance report
    report = await compliance_agent.generate_compliance_report(period='weekly')
    print(f"📊 Compliance report generated: {report['summary']}")

async def run_monetization_analysis():
    """Example: Find new business opportunities"""
    print("💰 Running Monetization Analysis...")
    
    config = {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_SERVICE_KEY'),
        'openai_api_key': os.getenv('OPENAI_API_KEY'),
    }
    
    # Get monetization agent
    monetization_agent = get_agent('monetization', config)
    
    # Analyze market gaps
    gaps = await monetization_agent.analyze_market_gaps()
    print(f"🎯 Found {len(gaps)} market opportunities")
    
    # Generate business case for top opportunity
    if gaps:
        top_gap = gaps[0]
        business_case = await monetization_agent.generate_business_case(
            opportunity_id=top_gap['id'],
            include_financials=True
        )
        print(f"📈 Business case generated: {business_case['title']}")
        print(f"   ROI: {business_case['financial_projections']['roi_percentage']}%")

async def run_content_generation():
    """Example: Generate SEO-optimized content"""
    print("✍️ Generating Content...")
    
    config = {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_SERVICE_KEY'),
        'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
    }
    
    # Get content agent
    content_agent = get_agent('content', config)
    
    # Generate blog post
    blog_post = await content_agent.generate_blog_post(
        topic="Benefits of Hemp Protein",
        keywords=["hemp protein", "plant-based nutrition", "sustainable protein"],
        tone="informative",
        word_count=1200
    )
    print(f"📝 Blog post generated: {blog_post['title']}")
    print(f"   SEO Score: {blog_post['seo_score']}/100")

async def run_daily_automation():
    """Example: Run the daily automation workflow"""
    print("🤖 Running Daily Automation Workflow...")
    
    config = {
        'supabase_url': os.getenv('SUPABASE_URL'),
        'supabase_key': os.getenv('SUPABASE_SERVICE_KEY'),
        'openai_api_key': os.getenv('OPENAI_API_KEY'),
        'anthropic_api_key': os.getenv('ANTHROPIC_API_KEY'),
    }
    
    # Get orchestrator
    orchestrator = get_agent('orchestrator', config)
    
    # Run daily workflow
    workflow_result = await orchestrator.run_workflow('daily_automation')
    
    print(f"✅ Workflow completed!")
    print(f"   Tasks executed: {workflow_result['tasks_completed']}")
    print(f"   Total cost: ${workflow_result['total_cost']:.2f}")
    print(f"   Duration: {workflow_result['duration_minutes']:.1f} minutes")

async def main():
    """Main function to demonstrate agent capabilities"""
    print("🌿 HempQuarterz AI Agent System Demo\n")
    
    # Show available agents
    print("Available Agents:")
    for agent_name in AGENT_REGISTRY:
        print(f"  • {agent_name}")
    print()
    
    # Run examples
    try:
        # 1. Compliance check (critical for hemp business)
        await run_compliance_check()
        print()
        
        # 2. Find monetization opportunities
        await run_monetization_analysis()
        print()
        
        # 3. Generate content
        await run_content_generation()
        print()
        
        # 4. Run full automation
        # await run_daily_automation()
        
        print("🎉 Demo completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise

if __name__ == "__main__":
    # Run the demo
    asyncio.run(main())