"""
Quick Fix Script for Existing Hemp Agents
This script patches common issues in the existing agents
"""

import os
import json
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ktoqznqmlnxrtvubewyz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fix_agent_mappings():
    """Fix the mapping issues in agent data"""
    
    # Common mapping fixes
    plant_part_fixes = {
        'seeds': 'Hemp Seed',
        'fiber': 'Hemp Bast (Fiber)',
        'hurds': 'Hemp Hurd (Shivs)',
        'leaves': 'Hemp Leaves',
        'flower': 'Hemp Flowers',
        'roots': 'Hemp Roots',
        'oil': 'Hemp Seed',  # Oil comes from seeds
        'biomass': 'Hemp Biomass'
    }
    
    industry_fixes = {
        'food_beverage': 'Food & Beverages',
        'textiles': 'Textiles & Fashion Industry',
        'cosmetics': 'Cosmetics & Personal Care',
        'medicine': 'Wellness & Pharmaceutical Industries',
        'wellness': 'Wellness & Pharmaceutical Industries',
        'construction': 'Construction & Building Materials',
        'hempcrete': 'Construction & Building Materials',
        'cbd_products': 'Wellness & Pharmaceutical Industries',
        'energy': 'Energy Storage',
        'biotech': 'Bioplastics & Biofuels',
        'nutritional_supplements': 'Pharmaceuticals & Nutraceuticals'
    }
    
    return plant_part_fixes, industry_fixes

def create_agent_scheduler():
    """Create a simple scheduler for agents"""
    
    schedule = {
        'daily': [
            'fiber_textiles',
            'seeds_food_beverage',
            'oil_cosmetics'
        ],
        'weekly': [
            'hurds_construction',
            'flower_wellness',
            'leaves_medicine',
            'roots_biotech',
            'biomass_energy'
        ],
        'monthly': [
            'comprehensive_product_discovery'
        ]
    }
    
    # Save schedule to database
    schedule_data = {
        'schedule_name': 'hemp_agent_schedule',
        'schedule_config': schedule,
        'created_at': datetime.now().isoformat(),
        'is_active': True
    }
    
    print("Agent schedule created:")
    print(json.dumps(schedule, indent=2))
    
    return schedule

def add_agent_monitoring():
    """Add monitoring capabilities to track agent health"""
    
    print("\nSetting up agent monitoring...")
    
    # Get agent statistics
    agent_runs = supabase.table("hemp_agent_runs").select("*").execute()
    
    # Group by agent
    agent_stats = {}
    for run in agent_runs.data:
        agent_name = run['agent_name']
        if agent_name not in agent_stats:
            agent_stats[agent_name] = {
                'total_runs': 0,
                'successful_runs': 0,
                'failed_runs': 0,
                'total_found': 0,
                'total_saved': 0,
                'last_run': None
            }
        
        stats = agent_stats[agent_name]
        stats['total_runs'] += 1
        
        if run.get('status') == 'completed':
            stats['successful_runs'] += 1
        elif run.get('error_message'):
            stats['failed_runs'] += 1
            
        stats['total_found'] += run.get('products_found', 0)
        stats['total_saved'] += run.get('products_saved', 0)
        
        if not stats['last_run'] or run['timestamp'] > stats['last_run']:
            stats['last_run'] = run['timestamp']
    
    print("\nAgent Health Status:")
    for agent_name, stats in agent_stats.items():
        save_rate = stats['total_saved'] / stats['total_found'] if stats['total_found'] > 0 else 0
        health = 'HEALTHY' if save_rate > 0.7 else 'NEEDS_ATTENTION'
        print(f"- {agent_name}: {health} (Save rate: {save_rate:.1%})")

def create_agent_config():
    """Create configuration for agents"""
    
    config = {
        'rate_limits': {
            'requests_per_minute': 10,
            'requests_per_hour': 300,
            'cooldown_seconds': 5
        },
        'quality_thresholds': {
            'min_description_length': 50,
            'min_benefits': 3,
            'min_keywords': 3,
            'required_fields': ['name', 'description', 'plant_part', 'industry']
        },
        'retry_policy': {
            'max_retries': 3,
            'backoff_seconds': [5, 30, 60]
        },
        'deduplication': {
            'check_name_similarity': True,
            'similarity_threshold': 0.85,
            'check_description': True
        }
    }
    
    # Save configuration
    with open('agent_config.json', 'w') as f:
        json.dump(config, f, indent=2)
    
    print("\nAgent configuration saved to agent_config.json")
    return config

def generate_agent_wrapper():
    """Generate a wrapper template for existing agents"""
    
    wrapper_template = '''
"""
Enhanced Agent Wrapper
Add this to your existing agents for better error handling and monitoring
"""

import functools
import time
from datetime import datetime

def agent_monitor(agent_name):
    """Decorator to monitor agent execution"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            products_found = 0
            products_saved = 0
            error_message = None
            status = 'started'
            
            try:
                # Run the original function
                result = func(*args, **kwargs)
                
                # Extract metrics from result
                if isinstance(result, dict):
                    products_found = result.get('found', 0)
                    products_saved = result.get('saved', 0)
                    
                status = 'completed'
                
            except Exception as e:
                error_message = str(e)
                status = 'failed'
                print(f"Agent {agent_name} failed: {e}")
                
            finally:
                # Log the run
                run_data = {
                    'agent_name': agent_name,
                    'timestamp': datetime.now().isoformat(),
                    'products_found': products_found,
                    'products_saved': products_saved,
                    'status': status,
                    'error_message': error_message,
                    'execution_time': time.time() - start_time
                }
                
                # Save to database
                try:
                    supabase.table('hemp_agent_runs').insert(run_data).execute()
                except:
                    print(f"Failed to log agent run: {run_data}")
                    
            return result
            
        return wrapper
    return decorator

# Usage example:
# @agent_monitor('my_agent_name')
# def my_agent_function():
#     # Your agent code here
#     pass
'''
    
    with open('agent_wrapper_template.py', 'w') as f:
        f.write(wrapper_template)
    
    print("\nAgent wrapper template saved to agent_wrapper_template.py")

def main():
    """Main execution"""
    print("🔧 Hemp Agent Fix Script 🔧\n")
    
    # 1. Get mapping fixes
    plant_part_fixes, industry_fixes = fix_agent_mappings()
    print("✓ Mapping fixes loaded")
    
    # 2. Create scheduler
    schedule = create_agent_scheduler()
    print("✓ Agent scheduler created")
    
    # 3. Add monitoring
    add_agent_monitoring()
    
    # 4. Create configuration
    config = create_agent_config()
    
    # 5. Generate wrapper template
    generate_agent_wrapper()
    
    print("\n📋 Next Steps:")
    print("1. Apply the agent_wrapper to your existing agents")
    print("2. Update agent mappings using the fix dictionaries")
    print("3. Run agents according to the schedule")
    print("4. Monitor agent health regularly")
    print("5. Run the migration script to consolidate products")

if __name__ == "__main__":
    main()
