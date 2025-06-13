#!/usr/bin/env python3
"""
Example script showing how to run the Hemp AI agents
"""

import os
import sys
import asyncio
from datetime import datetime
import json

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agents.research.research_agent import ResearchAgent
from agents.content.content_agent import ContentAgent
from agents.seo.seo_agent import HempSEOAgent
from agents.compliance.compliance_agent import ComplianceAgent
from agents.outreach.outreach_agent import OutreachAgent
from agents.monetization.monetization_agent import MonetizationAgent
from supabase import create_client

# Configuration
config = {
    'supabase_url': os.environ.get('SUPABASE_URL'),
    'supabase_key': os.environ.get('SUPABASE_ANON_KEY'),
}

# Initialize Supabase client
supabase = create_client(config['supabase_url'], config['supabase_key']) if config['supabase_url'] else None

async def run_research_agent_example():
    """Example: Run the Research Agent to discover hemp products"""
    print("\n=== Running Research Agent ===")
    
    agent = ResearchAgent(config)
    
    # Discover new hemp products
    products = await agent.discover_hemp_products(
        sources=[
            "https://www.leafly.com/news/hemp",
            "https://www.hempindustrydaily.com"
        ],
        limit=5
    )
    
    print(f"Discovered {len(products)} products")
    for product in products:
        print(f"- {product.get('name')}: {product.get('category')}")
    
    # Analyze industry trends
    trends = await agent.analyze_industry_trends()
    print(f"\nIdentified {len(trends)} industry trends")

async def run_content_agent_example():
    """Example: Run the Content Agent to generate content"""
    print("\n=== Running Content Agent ===")
    
    agent = ContentAgent(config)
    
    # Generate a blog post
    blog_post = await agent.generate_blog_post(
        topic="The Future of Hemp in Sustainable Construction",
        keywords=["hemp concrete", "sustainable building", "eco-friendly"],
        word_count=800
    )
    
    print(f"Generated blog post: {blog_post.get('title')}")
    print(f"Word count: {len(blog_post.get('content', '').split())}")
    
    # Generate social media content
    social_posts = await agent.generate_social_media(
        topic="Hemp benefits",
        platforms=["twitter", "linkedin", "instagram"]
    )
    
    print(f"\nGenerated {len(social_posts)} social media posts")

async def run_seo_agent_example():
    """Example: Run the SEO Agent for site analysis"""
    print("\n=== Running SEO Agent ===")
    
    # Initialize with Supabase client
    agent = HempSEOAgent(supabase, "seo_agent")
    
    # Note: SEO Agent needs to be used within an async context manager
    async with agent:
        # Analyze site performance
        task = {
            'action': 'analyze_site',
            'params': {
                'url': 'https://example-hemp-site.com',
                'include_pages': 5
            }
        }
        
        result = await agent.execute(task)
        print(f"Site SEO Score: {result.get('overall_score', 0)}/100")
        print(f"Critical issues found: {result.get('critical_issues', 0)}")
        
        # Research keywords
        keyword_task = {
            'action': 'research_keywords',
            'params': {
                'seed_keywords': ['hemp fiber', 'hemp oil', 'hemp construction'],
                'product_focus': 'industrial hemp'
            }
        }
        
        keywords = await agent.execute(keyword_task)
        print(f"\nDiscovered {keywords.get('total_keywords', 0)} keywords")

async def run_outreach_agent_example():
    """Example: Run the Outreach Agent to find partnerships"""
    print("\n=== Running Outreach Agent ===")
    
    agent = OutreachAgent(config)
    
    # Find partnership opportunities
    opportunities = await agent.find_partnership_opportunities(
        industry="Hemp Textiles",
        opportunity_type="partnership",
        limit=10
    )
    
    print(f"Found {len(opportunities)} partnership opportunities")
    for opp in opportunities[:3]:
        print(f"- {opp.company_name} (Score: {opp.score:.2f})")
    
    # Generate outreach campaign
    if opportunities:
        campaign = await agent.generate_outreach_emails(
            opportunities=opportunities[:5],
            campaign_name="Hemp Textile Partnerships Q1 2025",
            template_type="partnership_intro"
        )
        
        print(f"\nCreated campaign: {campaign.name}")
        print(f"Recipients: {len(campaign.recipients)}")

async def run_monetization_agent_example():
    """Example: Run the Monetization Agent to find revenue opportunities"""
    print("\n=== Running Monetization Agent ===")
    
    agent = MonetizationAgent(config)
    
    # Analyze product opportunities
    opportunities = await agent.analyze_product_opportunities(
        focus_areas=["Hemp Textiles", "Hemp Construction", "Hemp Foods"]
    )
    
    print(f"Identified {len(opportunities)} monetization opportunities")
    for opp in opportunities[:3]:
        print(f"- {opp.name}")
        print(f"  ROI: {opp.roi_percentage:.0f}%")
        print(f"  Investment: ${opp.investment_required:,.0f}")
        print(f"  Expected Revenue: ${opp.expected_revenue:,.0f}")
    
    # Identify market gaps
    gaps = await agent.identify_market_gaps(
        categories=["Textiles", "Construction", "Food & Beverages"]
    )
    
    print(f"\nFound {len(gaps)} market gaps")
    for gap in gaps[:3]:
        print(f"- {gap.gap_description}")
        print(f"  Market Value: ${gap.estimated_market_value:,.0f}")

async def run_compliance_agent_example():
    """Example: Run the Compliance Agent to check regulations"""
    print("\n=== Running Compliance Agent ===")
    
    agent = ComplianceAgent(config)
    
    # Check compliance for a product
    task = {
        'action': 'check_product_compliance',
        'product_id': 'hemp-textile-001',
        'jurisdictions': ['US', 'EU', 'Canada']
    }
    
    result = await agent.execute(task)
    print(f"Compliance check completed: {result.get('status')}")
    
    # Monitor regulatory changes
    monitor_task = {
        'action': 'monitor_regulatory_changes',
        'sources': ['FDA', 'USDA', 'EU Commission'],
        'keywords': ['hemp', 'CBD', 'industrial hemp']
    }
    
    changes = await agent.execute(monitor_task)
    print(f"Found {len(changes.get('changes', []))} regulatory updates")

async def create_agent_task_in_db(agent_type: str, task_type: str, params: dict):
    """Create a task in the database for an agent to process"""
    if not supabase:
        print("Supabase not configured")
        return
    
    task = {
        'agent_type': agent_type,
        'task_type': task_type,
        'status': 'pending',
        'priority': 'medium',
        'params': params,
        'created_at': datetime.utcnow().isoformat()
    }
    
    result = supabase.table('agent_task_queue').insert(task).execute()
    print(f"Created task {result.data[0]['task_id']} for {agent_type}")
    return result.data[0]['task_id']

async def main():
    """Run agent examples"""
    print("=== Hemp AI Agents Example Runner ===")
    print("\nSelect which agent to run:")
    print("1. Research Agent - Discover products and trends")
    print("2. Content Agent - Generate blog posts and social media")
    print("3. SEO Agent - Analyze site and research keywords")
    print("4. Outreach Agent - Find partnerships and create campaigns")
    print("5. Monetization Agent - Identify revenue opportunities")
    print("6. Compliance Agent - Check regulations")
    print("7. Create tasks in database (for background processing)")
    print("8. Run all agents")
    
    choice = input("\nEnter your choice (1-8): ")
    
    try:
        if choice == '1':
            await run_research_agent_example()
        elif choice == '2':
            await run_content_agent_example()
        elif choice == '3':
            await run_seo_agent_example()
        elif choice == '4':
            await run_outreach_agent_example()
        elif choice == '5':
            await run_monetization_agent_example()
        elif choice == '6':
            await run_compliance_agent_example()
        elif choice == '7':
            # Create tasks in database
            print("\nCreating sample tasks in database...")
            
            # Research task
            await create_agent_task_in_db(
                'research_agent',
                'discover_products',
                {'sources': ['https://example.com'], 'limit': 10}
            )
            
            # Content task
            await create_agent_task_in_db(
                'content_agent',
                'generate_blog_post',
                {'topic': 'Hemp Innovation', 'keywords': ['hemp', 'sustainable']}
            )
            
            # SEO task
            await create_agent_task_in_db(
                'seo_agent',
                'research_keywords',
                {'seed_keywords': ['hemp products']}
            )
            
            print("\nTasks created! They will be processed by the agent orchestrator.")
            
        elif choice == '8':
            # Run all agents
            await run_research_agent_example()
            await run_content_agent_example()
            await run_seo_agent_example()
            await run_outreach_agent_example()
            await run_monetization_agent_example()
            await run_compliance_agent_example()
        else:
            print("Invalid choice")
            
    except Exception as e:
        print(f"\nError running agent: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # Make sure environment variables are set
    if not os.environ.get('SUPABASE_URL'):
        print("Warning: SUPABASE_URL not set. Database features will be disabled.")
        print("Set it with: export SUPABASE_URL='your-supabase-url'")
    
    if not os.environ.get('OPENAI_API_KEY') and not os.environ.get('ANTHROPIC_API_KEY'):
        print("Warning: No AI API keys found. Agent AI features will be limited.")
        print("Set with: export OPENAI_API_KEY='your-key' or ANTHROPIC_API_KEY='your-key'")
    
    # Run the main function
    asyncio.run(main())