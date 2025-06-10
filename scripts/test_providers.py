#!/usr/bin/env python3
"""
Test AI Image Generation Providers
Tests individual providers to ensure they're properly configured
"""

import os
import sys
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import json

# Load environment variables
load_dotenv()

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not service_key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file")
    sys.exit(1)

supabase: Client = create_client(url, service_key)

def test_provider(provider_name: str, test_product_id: int = 1):
    """Test a specific provider with a sample product"""
    
    print(f"\n{'='*50}")
    print(f"Testing {provider_name} Provider")
    print(f"{'='*50}")
    
    # Get product details
    try:
        product = supabase.table('uses_products').select('*').eq('id', test_product_id).single().execute()
        
        if not product.data:
            print(f"Error: Product {test_product_id} not found")
            # Try to get first product
            first_product = supabase.table('uses_products').select('*').limit(1).execute()
            if first_product.data:
                print(f"Using first available product instead (ID: {first_product.data[0]['id']})")
                product = first_product
                product_data = product.data[0]
            else:
                print("No products found in database!")
                return False
        else:
            product_data = product.data
        
        # Debug: Show available fields
        print(f"\nAvailable fields: {list(product_data.keys())}")
        
        # Handle different possible field names
        name_field = None
        for field in ['product_name', 'name', 'title', 'product']:
            if field in product_data:
                name_field = field
                break
        
        if not name_field:
            print(f"Warning: No name field found. Using ID {product_data.get('id', 'Unknown')}")
            product_name = f"Product {product_data.get('id', 'Unknown')}"
        else:
            product_name = product_data[name_field]
            
        # Handle description field
        desc_field = None
        for field in ['description', 'desc', 'details', 'product_description']:
            if field in product_data:
                desc_field = field
                break
                
        product_description = product_data.get(desc_field, "No description available") if desc_field else "No description available"
        
        print(f"\nTest Product: {product_name}")
        print(f"Description: {product_description[:100]}...")
        
        # Prepare test request
        edge_function_url = f"{url}/functions/v1/hemp-image-generator"
        
        payload = {
            "productId": product_data.get('id', test_product_id),
            "productName": product_name,
            "productDescription": product_description,
            "forceProvider": provider_name.lower().replace(' ', '_')
        }
        
        headers = {
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json"
        }
        
        print(f"\nSending request to Edge Function...")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        # Make request to Edge Function
        response = requests.post(edge_function_url, json=payload, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n✅ Success!")
            print(f"Image URL: {result.get('imageUrl', 'N/A')}")
            print(f"Cost: ${result.get('cost', 0):.3f}")
            print(f"Generation ID: {result.get('generationId', 'N/A')}")
            
            # Check if image was actually generated
            if 'placeholder' in result.get('imageUrl', ''):
                print("\n⚠️  Warning: Received placeholder image")
                print("This likely means the provider is not properly configured")
                return False
            
            return True
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 400:
                try:
                    error_data = response.json()
                    if 'API key' in error_data.get('error', ''):
                        print("\n⚠️  Missing API Key!")
                        print(f"Please add the API key for {provider_name} to Supabase secrets")
                except:
                    pass
                    
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")
        # Try to show table structure
        print("\nAttempting to show table structure...")
        try:
            sample = supabase.table('uses_products').select('*').limit(1).execute()
            if sample.data:
                print(f"Table columns: {list(sample.data[0].keys())}")
        except:
            pass
        return False

def check_provider_status():
    """Check the status of all providers"""
    
    print("\n📊 Provider Status Check")
    print("=" * 70)
    
    try:
        # Try without ordering first
        providers = supabase.table('ai_provider_config').select('*').execute()
        
        # Sort by cost_per_image for display
        providers.data.sort(key=lambda x: x.get('cost_per_image', 0))
        
        for provider in providers.data:
            status = "✅ Active" if provider.get('is_active', False) else "❌ Inactive"
            print(f"\n{provider['provider_name']}:")
            print(f"  Status: {status}")
            print(f"  Cost per image: ${provider.get('cost_per_image', 0):.3f}")
            if 'total_generated' in provider:
                print(f"  Total generated: {provider['total_generated']}")
                
    except Exception as e:
        print(f"Error checking provider status: {str(e)}")
        print("\nTrying alternative query...")
        
        # Try a simpler query
        try:
            providers = supabase.table('ai_provider_config').select('provider_name,is_active,cost_per_image').execute()
            for provider in providers.data:
                print(f"\n{provider['provider_name']}: {'Active' if provider.get('is_active') else 'Inactive'} - ${provider.get('cost_per_image', 0):.3f}/image")
        except Exception as e2:
            print(f"Error: {str(e2)}")

def activate_provider_menu():
    """Menu to activate providers"""
    print("\n🔧 Provider Activation")
    print("=" * 50)
    
    providers = supabase.table('ai_provider_config').select('*').execute()
    
    print("\nSelect provider to activate:")
    for i, provider in enumerate(providers.data):
        if provider['provider_name'] != 'placeholder':
            status = "✅" if provider.get('is_active') else "❌"
            print(f"{i+1}. {status} {provider['provider_name']} (${provider.get('cost_per_image', 0):.3f}/image)")
    
    choice = input("\nEnter number (or 0 to cancel): ").strip()
    
    try:
        idx = int(choice) - 1
        if 0 <= idx < len(providers.data):
            provider = providers.data[idx]
            # Toggle activation
            new_status = not provider.get('is_active', False)
            
            result = supabase.table('ai_provider_config')\
                .update({'is_active': new_status})\
                .eq('id', provider['id'])\
                .execute()
                
            print(f"\n{'✅ Activated' if new_status else '❌ Deactivated'} {provider['provider_name']}")
            
            if new_status and provider['provider_name'] != 'placeholder':
                print(f"\n⚠️  Remember to add the API key to Supabase secrets!")
                print(f"Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/functions/hemp-image-generator")
    except:
        print("Invalid choice")

def main():
    """Main test menu"""
    
    print("\n🎨 HempQuarterz AI Provider Testing Tool")
    print("=" * 50)
    
    # First check provider status
    check_provider_status()
    
    while True:
        print("\n\nSelect an option:")
        print("1. Test Stable Diffusion ($0.002/image)")
        print("2. Test DALL-E 3 ($0.040/image)")
        print("3. Test Imagen 3 ($0.020/image)")
        print("4. Test Midjourney ($0.015/image)")
        print("5. Test All Active Providers")
        print("6. Check Provider Status")
        print("7. Activate/Deactivate Providers")
        print("0. Exit")
        
        choice = input("\nEnter choice (0-7): ").strip()
        
        if choice == '0':
            print("\nGoodbye!")
            break
            
        elif choice == '1':
            test_provider("Stable Diffusion")
            
        elif choice == '2':
            test_provider("DALL-E 3")
            
        elif choice == '3':
            test_provider("Imagen 3")
            
        elif choice == '4':
            test_provider("Midjourney")
            
        elif choice == '5':
            # Test all active providers
            try:
                active_providers = supabase.table('ai_provider_config')\
                    .select('provider_name')\
                    .eq('is_active', True)\
                    .execute()
                    
                for provider in active_providers.data:
                    if provider['provider_name'] != 'placeholder':
                        test_provider(provider['provider_name'])
            except Exception as e:
                print(f"Error getting active providers: {str(e)}")
                    
        elif choice == '6':
            check_provider_status()
            
        elif choice == '7':
            activate_provider_menu()
            
        else:
            print("Invalid choice. Please try again.")
            
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
