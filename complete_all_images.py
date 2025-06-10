#!/usr/bin/env python3
"""
Complete All Images with Placeholder
Quick script to finish image generation
"""

import os
from dotenv import load_dotenv
from ai_provider_manager import AIProviderManager
import time

# Load environment variables
load_dotenv()

def main():
    print("🌿 Complete All Images with Placeholder Provider")
    print("="*50)
    
    # Get configuration
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Missing environment variables!")
        return
    
    # Initialize manager
    manager = AIProviderManager(supabase_url, supabase_key, 'ktoqznqmlnxrtvubewyz')
    
    while True:
        # Get current status
        status = manager.get_queue_status()
        pending = status['queue_status']['pending']
        retry = status['queue_status']['retry']
        products_without_images = status['products_without_images']
        
        print(f"\n📊 Current Status:")
        print(f"   Pending in queue: {pending}")
        print(f"   Retry in queue: {retry}")
        print(f"   Products without images: {products_without_images}")
        
        # If nothing to process, check if we need to queue more
        if pending + retry == 0:
            if products_without_images > 0:
                print(f"\n📝 Queuing {products_without_images} products...")
                manager.queue_products_for_generation()
                continue
            else:
                print("\n✅ All products have images! 🎉")
                break
        
        # Process what's in queue
        batch_size = min(pending + retry, 30)  # Process up to 30 at a time
        print(f"\n🚀 Processing {batch_size} items...")
        
        result = manager.trigger_generation(batch_size=batch_size)
        
        print(f"   ✅ Success: {result['results']['success']}")
        print(f"   ❌ Failed: {result['results']['failed']}")
        
        # Brief pause between batches
        if pending + retry > batch_size:
            print("\n⏳ Waiting 2 seconds before next batch...")
            time.sleep(2)
    
    print("\n🎉 COMPLETE! All 149 products now have images!")
    print("   Total cost: $0.00 (placeholder provider)")
    print("\n   Next steps:")
    print("   1. Review the images in your app")
    print("   2. Consider upgrading to real AI providers")
    print("   3. Set up CDN when ready to scale")

if __name__ == "__main__":
    main()
