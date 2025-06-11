#!/usr/bin/env python3
"""Weekly Hemp Automation Summary Report Generator"""
import os
import sys
from datetime import datetime, timedelta
from supabase import create_client, Client
import json

def generate_summary(days=7):
    """Generate weekly summary of hemp automation activities"""
    
    # Get environment variables
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
    
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("❌ Error: Missing Supabase credentials")
        print("SUPABASE_URL:", "Set" if SUPABASE_URL else "Not set")
        print("SUPABASE_ANON_KEY:", "Set" if SUPABASE_ANON_KEY else "Not set")
        return 1
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        print(f"📊 WEEKLY HEMP AUTOMATION SUMMARY")
        print(f"Report Period: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        print("=" * 60)
        
        # Get agent runs
        try:
            runs = supabase.table('hemp_agent_runs') \
                .select('*') \
                .gte('created_at', start_date.isoformat()) \
                .lte('created_at', end_date.isoformat()) \
                .execute()
            print(f"✅ Retrieved {len(runs.data)} agent runs")
        except Exception as e:
            print(f"⚠️ Error fetching agent runs: {e}")
            runs = type('obj', (object,), {'data': []})()
        
        # Get products discovered
        try:
            products = supabase.table('hemp_automation_products') \
                .select('*') \
                .gte('created_at', start_date.isoformat()) \
                .lte('created_at', end_date.isoformat()) \
                .execute()
            print(f"✅ Retrieved {len(products.data)} products")
        except Exception as e:
            print(f"⚠️ Error fetching products: {e}")
            products = type('obj', (object,), {'data': []})()
        
        # Get companies added
        try:
            companies = supabase.table('hemp_automation_companies') \
                .select('*') \
                .gte('created_at', start_date.isoformat()) \
                .lte('created_at', end_date.isoformat()) \
                .execute()
            print(f"✅ Retrieved {len(companies.data)} companies")
        except Exception as e:
            print(f"⚠️ Error fetching companies: {e}")
            companies = type('obj', (object,), {'data': []})()
        
        # Generate statistics
        agent_stats = {}
        for run in runs.data:
            agent = run.get('agent_type', 'unknown')
            if agent not in agent_stats:
                agent_stats[agent] = {
                    'runs': 0,
                    'products': 0,
                    'errors': 0,
                    'total_time': 0
                }
            
            agent_stats[agent]['runs'] += 1
            agent_stats[agent]['products'] += run.get('products_found', 0)
            if run.get('error'):
                agent_stats[agent]['errors'] += 1
            if run.get('duration_seconds'):
                agent_stats[agent]['total_time'] += run['duration_seconds']
        
        # Print summary
        print(f"\n📈 SUMMARY STATISTICS")
        print(f"Total Agent Runs: {len(runs.data)}")
        print(f"Total Products Discovered: {len(products.data)}")
        print(f"Total Companies Added: {len(companies.data)}")
        
        print(f"\n🤖 AGENT PERFORMANCE:")
        if agent_stats:
            for agent, stats in sorted(agent_stats.items()):
                if stats['runs'] > 0:
                    avg_time = stats['total_time'] / stats['runs']
                    error_rate = (stats['errors'] / stats['runs'] * 100)
                    
                    print(f"\n{agent.upper()}:")
                    print(f"  - Runs: {stats['runs']}")
                    print(f"  - Products Found: {stats['products']}")
                    print(f"  - Error Rate: {error_rate:.1f}%")
                    print(f"  - Avg Runtime: {avg_time:.1f}s")
        else:
            print("  No agent activity in this period")
        
        # Product categories breakdown
        print(f"\n📦 PRODUCTS BY CATEGORY:")
        category_counts = {}
        for product in products.data:
            category = product.get('product_type', 'Unknown')
            category_counts[category] = category_counts.get(category, 0) + 1
        
        if category_counts:
            for category, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True):
                print(f"  - {category}: {count}")
        else:
            print("  No products found in this period")
        
        # Top companies
        print(f"\n🏢 TOP COMPANIES BY PRODUCTS:")
        company_products = {}
        for product in products.data:
            company_id = product.get('company_id')
            if company_id:
                company_products[company_id] = company_products.get(company_id, 0) + 1
        
        if company_products:
            # Get company names for top companies
            top_companies = sorted(company_products.items(), key=lambda x: x[1], reverse=True)[:10]
            found_companies = 0
            for company_id, product_count in top_companies:
                company = next((c for c in companies.data if c.get('id') == company_id), None)
                if company:
                    print(f"  - {company.get('name', 'Unknown')}: {product_count} products")
                    found_companies += 1
            
            if found_companies == 0:
                print("  No company data available")
        else:
            print("  No products linked to companies in this period")
        
        print("\n" + "=" * 60)
        print("✅ Report generated successfully!")
        
        # Save report to file
        os.makedirs('reports', exist_ok=True)
        report_file = f"reports/weekly_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        
        # Create JSON report for better structure
        report_data = {
            'generated': datetime.now().isoformat(),
            'period': {
                'start': start_date.strftime('%Y-%m-%d'),
                'end': end_date.strftime('%Y-%m-%d'),
                'days': days
            },
            'summary': {
                'total_runs': len(runs.data),
                'total_products': len(products.data),
                'total_companies': len(companies.data)
            },
            'agent_stats': agent_stats,
            'category_counts': category_counts,
            'top_companies': [
                {
                    'id': company_id,
                    'name': next((c.get('name', 'Unknown') for c in companies.data if c.get('id') == company_id), 'Unknown'),
                    'products': count
                }
                for company_id, count in sorted(company_products.items(), key=lambda x: x[1], reverse=True)[:10]
            ]
        }
        
        # Save JSON report
        json_file = f"reports/weekly_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(json_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Reports saved to:")
        print(f"  - {json_file}")
        
        return 0
        
    except Exception as e:
        print(f"❌ Error generating summary: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    days = int(sys.argv[1]) if len(sys.argv) > 1 else 7
    sys.exit(generate_summary(days))