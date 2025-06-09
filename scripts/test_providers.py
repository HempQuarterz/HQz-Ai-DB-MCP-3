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
    product = supabase.table('uses_products').select('*').eq('id', test_product_id).single().execute()
    
    if not product.data:
        print(f"Error: Product {test_product_id} not found")
        return False
    
    product_data = product.data
    print(f"\nTest Product: {product_data['product_name']}")
    print(f"Description: {product_data['description'][:100]}...")
    
    # Prepare test request
    edge_function_url = f"{url}/functions/v1/hemp-image-generator"
    
    payload = {
        "productId": test_product_id,
        "productName": product_data['product_name'],
        "productDescription": product_data['description'],
        "forceProvider": provider_name.lower().replace(' ', '_')
    }
    
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    print(f"\nSending request to Edge Function...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
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
                error_data = response.json()
                if 'API key' in error_data.get('error', ''):
                    print("\n⚠️  Missing API Key!")
                    print(f"Please add the API key for {provider_name} to Supabase secrets")
                    
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {str(e)}")
        return False

def check_provider_status():
    """Check the status of all providers"""
    
    print("\n📊 Provider Status Check")
    print("=" * 70)
    
    providers = supabase.table('ai_provider_config').select('*').order('priority').execute()
    
    for provider in providers.data:
        status = "✅ Active" if provider['is_active'] else "❌ Inactive"
        print(f"\n{provider['provider_name']}:")
        print(f"  Status: {status}")
        print(f"  Cost per image: ${provider['cost_per_image']:.3f}")
        print(f"  Priority: {provider['priority']}")
        print(f"  Total generated: {provider['total_generated']}")

def main():
    """Main test menu"""
    
    print("\n🎨 HempQuarterz AI Provider Testing Tool")
    print("=" * 50)
    
    # First check provider status
    check_provider_status()
    
    while True:
        print("\n\nSelect a provider to test:")
        print("1. Stable Diffusion ($0.002/image)")
        print("2. DALL-E 3 ($0.040/image)")
        print("3. Imagen 3 ($0.020/image)")
        print("4. Midjourney ($0.015/image)")
        print("5. Test All Active Providers")
        print("6. Check Provider Status")
        print("0. Exit")
        
        choice = input("\nEnter choice (0-6): ").strip()
        
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
            active_providers = supabase.table('ai_provider_config')\
                .select('provider_name')\
                .eq('is_active', True)\
                .execute()
                
            for provider in active_providers.data:
                if provider['provider_name'] != 'Placeholder':
                    test_provider(provider['provider_name'])
                    
        elif choice == '6':
            check_provider_status()
            
        else:
            print("Invalid choice. Please try again.")
            
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()
