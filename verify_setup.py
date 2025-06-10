# verify_setup.py
"""Quick script to verify your hemp automation setup is working"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

print("🔍 Verifying Hemp Automation Setup...")
print("="*50)

# Check environment variables
env_vars = {
    'SUPABASE_URL': os.environ.get('SUPABASE_URL'),
    'SUPABASE_ANON_KEY': os.environ.get('SUPABASE_ANON_KEY'),
    'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY')
}

all_set = True
for var, value in env_vars.items():
    if value and value not in ['your_supabase_anon_key_here', 'sk-...']:
        print(f"✅ {var}: Set")
    else:
        print(f"❌ {var}: Not set or using placeholder")
        all_set = False

if not all_set:
    print("\n⚠️  Please update your .env file with actual API keys")
    print("   See README_HEMP_AUTOMATION.md for instructions")
    exit(1)

# Test Supabase connection
print("\n📡 Testing Supabase connection...")
try:
    supabase = create_client(env_vars['SUPABASE_URL'], env_vars['SUPABASE_ANON_KEY'])
    
    # Check tables
    tables_to_check = [
        'hemp_automation_companies',
        'hemp_automation_products',
        'hemp_agent_runs'
    ]
    
    for table in tables_to_check:
        result = supabase.table(table).select('*', count='exact').limit(1).execute()
        print(f"✅ {table}: Ready ({result.count} records)")
    
    print("\n✅ All systems ready! You can now run:")
    print("   python hemp_agent.py seeds-food")
    
except Exception as e:
    print(f"\n❌ Connection error: {e}")
    print("   Check your API keys in .env file")
