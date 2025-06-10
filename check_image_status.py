#!/usr/bin/env python3
"""
Check Image Generation Status
Works with SUPABASE_ANON_KEY
"""

import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def main():
    print("🌿 HempQuarterz Image Generation Status Check")
    print("="*50)
    
    # Get configuration
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_ANON_KEY')  # Using anon key for read-only
    
    if not supabase_url or not supabase_key:
        print("❌ Error: Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file")
        return
    
    # Initialize client
    supabase = create_client(supabase_url, supabase_key)
    
    try:
        # Check products with/without images
        total_products = supabase.table('uses_products').select("id", count='exact').execute()
        products_with_images = supabase.table('uses_products').select("id", count='exact').not_.is_('image_url', 'null').execute()
        products_without_images = supabase.table('uses_products').select("id", count='exact').is_('image_url', 'null').execute()
        
        print("\n📸 Product Image Status:")
        print(f"   Total Products: {total_products.count}")
        print(f"   With Images: {products_with_images.count}")
        print(f"   Without Images: {products_without_images.count}")
        print(f"   Coverage: {(products_with_images.count / total_products.count * 100):.1f}%")
        
        # Check queue status
        queue_statuses = ['pending', 'processing', 'completed', 'failed']
        print("\n📋 Queue Status:")
        for status in queue_statuses:
            count = supabase.table('image_generation_queue').select("id", count='exact').eq('status', status).execute()
            print(f"   {status.capitalize()}: {count.count}")
        
        # Check recent agent runs
        recent_runs = supabase.table('hemp_agent_runs').select("*").order('timestamp', desc=True).limit(5).execute()
        
        if recent_runs.data:
            print("\n🤖 Recent Agent Runs:")
            for run in recent_runs.data:
                print(f"   {run['agent_name']}: {run['products_saved']} products saved ({run['timestamp'][:10]})")
        
        print("\n✅ Status check complete!")
        print("\nNext steps:")
        print("1. Add SUPABASE_SERVICE_ROLE_KEY to your .env file")
        print("2. Run: python run_generation.py")
        print("3. Or use: python ai_provider_manager.py --help")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nMake sure your Supabase project is accessible and the tables exist.")

if __name__ == "__main__":
    main()
