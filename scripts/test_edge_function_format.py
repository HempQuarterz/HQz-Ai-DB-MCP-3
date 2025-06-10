#!/usr/bin/env python3
"""
Simple test to generate a single image with proper Edge Function format
"""

import os
import sys
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
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

def test_single_generation():
    """Test generating a single image"""
    print("\n🧪 Testing Single Image Generation")
    print("=" * 50)
    
    # Get a test product
    product = supabase.table('uses_products').select('*').limit(1).execute()
    if not product.data:
        print("No products found!")
        return
        
    test_product = product.data[0]
    print(f"\nTest Product: {test_product['name']}")
    
    edge_function_url = f"{url}/functions/v1/hemp-image-generator"
    
    # Try different payload formats
    payloads = [
        # Format 1: Single product
        {
            "productId": test_product['id'],
            "productName": test_product['name'],
            "productDescription": test_product.get('description', 'Hemp product'),
            "forceProvider": "dall_e_3"
        },
        # Format 2: Batch with single item
        {
            "products": [{
                "id": test_product['id'],
                "name": test_product['name'],
                "description": test_product.get('description', 'Hemp product')
            }],
            "provider": "dall_e_3"
        },
        # Format 3: Items array
        {
            "items": [{
                "productId": test_product['id'],
                "productName": test_product['name'],
                "productDescription": test_product.get('description', 'Hemp product')
            }],
            "forceProvider": "dall_e_3"
        }
    ]
    
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    for i, payload in enumerate(payloads):
        print(f"\n🔍 Testing Format {i+1}:")
        print(f"Payload: {json.dumps(payload, indent=2)[:200]}...")
        
        try:
            response = requests.post(edge_function_url, json=payload, headers=headers)
            print(f"Status: {response.status_code}")
            
            try:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2)[:300]}...")
                
                # Check if we got an actual image URL
                if isinstance(data, dict):
                    if 'imageUrl' in data and data['imageUrl'] and 'placeholder' not in data['imageUrl']:
                        print("\n✅ SUCCESS! Got real image URL!")
                        print(f"Image URL: {data['imageUrl']}")
                        print(f"Cost: ${data.get('cost', 0):.3f}")
                        return True
                    elif 'results' in data and data['results'].get('success', 0) > 0:
                        print("\n✅ Batch format worked!")
                        return True
                        
            except:
                print(f"Raw Response: {response.text[:200]}...")
                
        except Exception as e:
            print(f"Error: {str(e)}")
            
    print("\n❌ All formats failed to generate real images")
    print("\n💡 Possible issues:")
    print("1. API keys not properly set in Supabase")
    print("2. Edge Function code needs updating")
    print("3. Provider configuration issues")

def check_edge_function_code():
    """Try to understand Edge Function expectations"""
    print("\n📝 Edge Function Analysis")
    print("=" * 50)
    
    # Make a minimal request to see error messages
    edge_function_url = f"{url}/functions/v1/hemp-image-generator"
    
    test_payloads = [
        {},  # Empty
        {"test": True},  # Test flag
        {"help": True},  # Help flag
    ]
    
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    for payload in test_payloads:
        print(f"\nTesting with: {payload}")
        try:
            response = requests.post(edge_function_url, json=payload, headers=headers)
            print(f"Response: {response.text[:200]}...")
        except Exception as e:
            print(f"Error: {str(e)}")

def main():
    test_single_generation()
    check_edge_function_code()
    
    print("\n\n🔧 Troubleshooting Steps:")
    print("1. Check Edge Function logs in Supabase Dashboard")
    print("2. Verify API key names are exact:")
    print("   - STABILITY_API_KEY")
    print("   - OPENAI_API_KEY")
    print("   - GOOGLE_API_KEY")
    print("3. Make sure at least one non-placeholder provider is active")
    print("\nDashboard: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/logs/edge-functions")

if __name__ == "__main__":
    main()
