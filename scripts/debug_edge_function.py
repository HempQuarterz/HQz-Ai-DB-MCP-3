#!/usr/bin/env python3
"""
Check Edge Function Logs and Debug Image Generation
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
import requests
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

def check_edge_function_health():
    """Check if Edge Function is responding"""
    print("\n🔍 Checking Edge Function Health...")
    print("=" * 50)
    
    edge_function_url = f"{url}/functions/v1/hemp-image-generator"
    
    # Test with a simple health check
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    # Try a minimal request
    payload = {
        "test": True
    }
    
    try:
        response = requests.post(edge_function_url, json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}")  # First 500 chars
        
        if response.status_code == 400:
            print("\n⚠️  Edge Function is working but returned an error (expected for test request)")
        elif response.status_code == 200:
            print("\n✅ Edge Function is responding successfully")
            
    except Exception as e:
        print(f"\n❌ Error connecting to Edge Function: {str(e)}")

def check_recent_generations():
    """Check recent generation attempts"""
    print("\n📊 Recent Generation Attempts")
    print("=" * 50)
    
    try:
        # Get last 10 generation costs
        costs = supabase.table('ai_generation_costs')\
            .select('*')\
            .order('created_at', desc=True)\
            .limit(10)\
            .execute()
            
        if costs.data:
            print(f"\nFound {len(costs.data)} recent generation attempts:")
            for cost in costs.data:
                print(f"\n- Provider: {cost.get('provider_name', 'Unknown')}")
                print(f"  Product ID: {cost.get('product_id', 'N/A')}")
                print(f"  Cost: ${cost.get('cost', 0):.3f}")
                print(f"  Success: {cost.get('success', False)}")
                print(f"  Created: {cost.get('created_at', 'N/A')}")
                if cost.get('error_message'):
                    print(f"  Error: {cost.get('error_message')}")
        else:
            print("\nNo generation attempts found in ai_generation_costs table")
            
    except Exception as e:
        print(f"Error checking generation costs: {str(e)}")

def test_with_debug():
    """Test generation with debug mode"""
    print("\n🐛 Testing with Debug Mode")
    print("=" * 50)
    
    edge_function_url = f"{url}/functions/v1/hemp-image-generator"
    
    payload = {
        "productId": 1,
        "productName": "Hemp Insulation Test",
        "productDescription": "Test product for debugging",
        "forceProvider": "stable_diffusion",
        "debug": True  # Request debug info
    }
    
    headers = {
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json"
    }
    
    print("Sending debug request...")
    
    try:
        response = requests.post(edge_function_url, json=payload, headers=headers)
        print(f"\nStatus: {response.status_code}")
        
        # Pretty print the response
        try:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2)}")
        except:
            print(f"Raw Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {str(e)}")

def check_provider_keys():
    """Check which providers might have keys configured"""
    print("\n🔑 Checking Provider Configuration")
    print("=" * 50)
    
    # Get active providers
    providers = supabase.table('ai_provider_config')\
        .select('*')\
        .eq('is_active', True)\
        .execute()
        
    print("\nActive Providers:")
    for provider in providers.data:
        print(f"- {provider['provider_name']} (${provider['cost_per_image']:.3f}/image)")
        
    print("\n⚠️  Note: API keys must be added to Supabase Edge Function secrets")
    print("Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/settings/functions")
    print("\nRequired secret names:")
    print("- STABILITY_API_KEY (for Stable Diffusion)")
    print("- OPENAI_API_KEY (for DALL-E 3)")
    print("- GOOGLE_API_KEY (for Imagen 3)")
    print("- MIDJOURNEY_API_KEY (for Midjourney)")

def main():
    """Main debug menu"""
    print("\n🔍 HempQuarterz Edge Function Debugger")
    print("=" * 50)
    
    # Run all checks
    check_edge_function_health()
    check_recent_generations()
    check_provider_keys()
    test_with_debug()
    
    print("\n\n📝 Next Steps:")
    print("1. Add your API keys to Supabase Edge Function secrets")
    print("2. Make sure keys are named exactly as shown above")
    print("3. Test again with scripts/test_providers.py")
    print("\nDashboard link: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/settings/functions")

if __name__ == "__main__":
    main()
