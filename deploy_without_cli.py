#!/usr/bin/env python3
"""
Deploy Edge Function and Set Secrets without Supabase CLI
Uses Supabase Management API
"""

import os
import sys
import requests
from dotenv import load_dotenv
import base64

load_dotenv()

# Configuration
PROJECT_ID = "ktoqznqmlnxrtvubewyz"
FUNCTION_NAME = "hemp-image-generator"

def get_access_token():
    """Get access token for Supabase Management API"""
    print("⚠️  To deploy functions via API, you need a Supabase access token.")
    print("\nTo get one:")
    print("1. Go to: https://app.supabase.com/account/tokens")
    print("2. Click 'Generate new token'")
    print("3. Give it a name (e.g., 'Deploy Script')")
    print("4. Copy the token")
    print("\nPaste your access token here (it won't be shown):")
    
    import getpass
    token = getpass.getpass("Access token: ")
    return token.strip()

def test_edge_function():
    """Test if the edge function is already deployed"""
    url = f"https://{PROJECT_ID}.supabase.co/functions/v1/{FUNCTION_NAME}"
    
    try:
        response = requests.options(url)
        return response.status_code == 200
    except:
        return False

def create_test_script():
    """Create a test script for the edge function"""
    test_script = '''#!/usr/bin/env python3
"""Test the deployed Edge Function"""
import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

def test_function(provider="placeholder"):
    url = f"{os.getenv('SUPABASE_URL')}/functions/v1/hemp-image-generator"
    headers = {
        "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
        "Content-Type": "application/json"
    }
    
    # Test data
    data = {
        "productId": 1,
        "productName": "Premium Hemp Seed Oil",
        "productDescription": "Cold-pressed organic hemp seed oil in amber glass bottle",
        "forceProvider": provider
    }
    
    print(f"\\n🧪 Testing {provider} provider...")
    print(f"URL: {url}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Success!")
            print(f"Image URL: {result.get('imageUrl', 'No URL returned')}")
            print(f"Provider used: {result.get('provider', 'Unknown')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    # Test placeholder first (should always work)
    test_function("placeholder")
    
    # Test DALL-E 3 if you want
    proceed = input("\\nTest DALL-E 3? (yes/no): ").lower()
    if proceed == "yes":
        test_function("dall_e_3")
'''
    
    with open("test_edge_function.py", "w") as f:
        f.write(test_script)
    
    print("✅ Created test_edge_function.py")

def main():
    print("🚀 Edge Function Deployment Helper")
    print("="*50)
    
    # Check if function might already be deployed
    print("\n🔍 Checking if function is already deployed...")
    if test_edge_function():
        print("✅ Function appears to be deployed!")
        print("\nYou can skip deployment and just set the API keys.")
    else:
        print("❓ Cannot confirm if function is deployed (this is normal)")
    
    print("\n" + "="*50)
    print("📋 Manual Deployment Steps:")
    print("="*50)
    
    print("\n1. Deploy the Edge Function:")
    print("   - Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/functions")
    print("   - Click 'New function'")
    print("   - Name it: hemp-image-generator")
    print("   - Copy code from: supabase/functions/hemp-image-generator/index.ts")
    print("   - Click 'Deploy'")
    
    print("\n2. Create Storage Bucket (if not exists):")
    print("   - Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/storage/buckets")
    print("   - Click 'New bucket'")
    print("   - Name: product-images")
    print("   - Make it PUBLIC ✅")
    
    print("\n3. Set Environment Secrets:")
    print("   - Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/settings/vault")
    print("   - Click 'New secret'")
    print("   - Add OPENAI_API_KEY = your-openai-key")
    print("   - (Optional) Add STABILITY_API_KEY = your-stability-key")
    
    print("\n" + "="*50)
    print("🧪 Testing Your Setup:")
    print("="*50)
    
    # Create test script
    create_test_script()
    
    print("\nOnce you've completed the steps above, test with:")
    print("python test_edge_function.py")
    
    print("\n💡 Alternative: Use npx (no installation needed)")
    print("="*50)
    print("npx supabase login")
    print("npx supabase link --project-ref ktoqznqmlnxrtvubewyz")
    print("npx supabase functions deploy hemp-image-generator")
    print(f"npx supabase secrets set OPENAI_API_KEY={os.getenv('OPENAI_API_KEY', 'your-key')}")

if __name__ == "__main__":
    main()