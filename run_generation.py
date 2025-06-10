#!/usr/bin/env python3
"""
Simple Image Generation Runner for HempQuarterz
Uses environment variables for configuration
"""

import os
import sys
from dotenv import load_dotenv
from ai_provider_manager import AIProviderManager

# Load environment variables
load_dotenv()

def get_env_or_exit(key):
    """Get environment variable or exit with error"""
    value = os.getenv(key)
    if not value:
        print(f"❌ Error: {key} not found in environment variables")
        print(f"   Please add {key} to your .env file")
        sys.exit(1)
    return value

def main():
    print("🌿 HempQuarterz Image Generation Tool")
    print("="*50)
    
    # Get configuration from environment
    supabase_url = get_env_or_exit('SUPABASE_URL')
    supabase_key = get_env_or_exit('SUPABASE_SERVICE_ROLE_KEY')
    project_id = os.getenv('SUPABASE_PROJECT_ID', 'ktoqznqmlnxrtvubewyz')
    
    # Initialize manager
    manager = AIProviderManager(supabase_url, supabase_key, project_id)
    
    while True:
        print("\n📋 Menu:")
        print("1. Show Dashboard")
        print("2. Queue Products for Generation")
        print("3. Trigger Image Generation")
        print("4. Activate Provider")
        print("5. Show Queue Status")
        print("6. Exit")
        
        choice = input("\nSelect option (1-6): ").strip()
        
        if choice == '1':
            manager.display_dashboard()
            
        elif choice == '2':
            limit = input("How many products to queue? (press Enter for all): ").strip()
            priority = input("Priority (1-10, default 5): ").strip() or '5'
            
            count = manager.queue_products_for_generation(
                limit=int(limit) if limit else None,
                priority=int(priority)
            )
            print(f"\n✅ Queued {count} products")
            
        elif choice == '3':
            batch_size = input("Batch size (default 10): ").strip() or '10'
            provider = input("Force provider (optional, press Enter to skip): ").strip()
            
            result = manager.trigger_generation(
                batch_size=int(batch_size),
                force_provider=provider if provider else None
            )
            
        elif choice == '4':
            providers = manager.get_providers()
            print("\nAvailable providers:")
            for i, p in enumerate(providers):
                status = "✅" if p['is_active'] else "⏸️"
                print(f"{i+1}. {p['provider_name']} {status} (${p['cost_per_image']:.4f}/image)")
            
            provider_idx = int(input("\nSelect provider number: ").strip()) - 1
            if 0 <= provider_idx < len(providers):
                provider_name = providers[provider_idx]['provider_name']
                
                try:
                    manager.activate_provider(provider_name)
                except Exception as e:
                    print(f"\n❌ Error: {str(e)}")
            
        elif choice == '5':
            status = manager.get_queue_status()
            print("\n📸 Queue Status:")
            print("-"*40)
            for k, v in status['queue_status'].items():
                print(f"{k.capitalize():15} {v:10}")
            print(f"\nProducts without images: {status['products_without_images']}")
            
        elif choice == '6':
            print("\n👋 Goodbye!")
            break
        
        else:
            print("\n❌ Invalid option, please try again")
        
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
