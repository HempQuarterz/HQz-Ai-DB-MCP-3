# monitor_hemp.py
"""Quick monitoring script to check your hemp automation progress"""

import os
import argparse
from datetime import datetime, timedelta
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase
supabase = create_client(
    os.environ.get('SUPABASE_URL'),
    os.environ.get('SUPABASE_ANON_KEY')
)

def check_progress(agent_filter=None, hours=24):
    """Display current automation progress"""
    print("\n" + "="*60)
    print(f"🌿 HEMP AUTOMATION MONITOR - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("="*60)
    
    try:
        # Get totals
        if agent_filter:
            # Filter by specific agent
            products = supabase.table('hemp_automation_products').select('*', count='exact').eq('plant_part', agent_filter.split('-')[0]).execute()
            print(f"\n📊 DATABASE TOTALS for {agent_filter}:")
        else:
            products = supabase.table('hemp_automation_products').select('*', count='exact').execute()
            print(f"\n📊 DATABASE TOTALS:")
            
        companies = supabase.table('hemp_automation_companies').select('*', count='exact').execute()
        
        print(f"   Products:  {products.count}")
        print(f"   Companies: {companies.count}")
        
        # Get recent activity
        time_ago = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        # Build query for recent runs
        query = supabase.table('hemp_agent_runs').select('*').gte('timestamp', time_ago)
        
        if agent_filter:
            # Filter by agent name pattern
            agent_pattern = agent_filter.replace('-', '_')
            query = query.like('agent_name', f'%{agent_pattern}%')
            
        recent_runs = query.execute()
        
        if recent_runs.data:
            print(f"\n⏰ LAST {hours} HOURS:")
            total_runs = len(recent_runs.data)
            successful = sum(1 for run in recent_runs.data if run['status'] == 'success')
            products_added = sum(run.get('products_saved', 0) for run in recent_runs.data)
            companies_added = sum(run.get('companies_saved', 0) for run in recent_runs.data)
            
            print(f"   Runs:      {total_runs} ({successful} successful)")
            print(f"   Products:  +{products_added}")
            print(f"   Companies: +{companies_added}")
            
            # Show agent breakdown if not filtering
            if not agent_filter and recent_runs.data:
                print(f"\n🤖 AGENT ACTIVITY:")
                agent_stats = {}
                for run in recent_runs.data:
                    agent = run['agent_name']
                    if agent not in agent_stats:
                        agent_stats[agent] = {'runs': 0, 'products': 0}
                    agent_stats[agent]['runs'] += 1
                    agent_stats[agent]['products'] += run.get('products_saved', 0)
                
                for agent, stats in sorted(agent_stats.items()):
                    print(f"   {agent:25} - {stats['runs']:2} runs, {stats['products']:3} products")
        else:
            print(f"\n⏰ No activity in the last {hours} hours")
        
        # Get product breakdown
        if products.count > 0 and not agent_filter:
            products_data = supabase.table('hemp_automation_products').select('plant_part, industry').execute()
            
            print(f"\n📦 PRODUCT CATEGORIES:")
            categories = {}
            for product in products_data.data:
                key = f"{product['plant_part']} - {product['industry']}"
                categories[key] = categories.get(key, 0) + 1
            
            for category, count in sorted(categories.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"   {category:35} {count:3}")
        
        # Get latest runs
        latest_runs = supabase.table('hemp_agent_runs').select('*').order('timestamp', desc=True).limit(5).execute()
        
        if latest_runs.data:
            print(f"\n🚀 RECENT RUNS:")
            for run in latest_runs.data:
                timestamp = datetime.fromisoformat(run['timestamp'].replace('Z', '+00:00'))
                time_str = timestamp.strftime('%m/%d %H:%M')
                status = "✅" if run['status'] == 'success' else "❌"
                print(f"   {status} {time_str} - {run['agent_name']:25} ({run['products_saved']} products)")
        
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure your .env file has the correct API keys!")

def parse_arguments():
    parser = argparse.ArgumentParser(description='Monitor Hemp Automation Progress')
    parser.add_argument('--agent', type=str, help='Filter by specific agent type (e.g., seeds-food)')
    parser.add_argument('--recent', type=int, default=24, help='Show activity from last N hours (default: 24)')
    
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    check_progress(agent_filter=args.agent, hours=args.recent)
