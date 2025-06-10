#!/usr/bin/env python3
"""
Set Supabase Edge Function Secrets via Management API
Alternative to using Supabase CLI
"""

import os
import sys
import requests
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

def set_edge_function_secrets():
    """Set secrets for Edge Functions using Supabase Management API"""
    
    print("\n🔐 Supabase Edge Function Secret Manager")
    print("=" * 50)
    
    # You'll need to get an access token from Supabase Dashboard
    print("\nTo use this script, you need a Supabase access token.")
    print("\nHow to get it:")
    print("1. Go to: https://supabase.com/dashboard/account/tokens")
    print("2. Create a new access token")
    print("3. Copy the token (you won't see it again!)")
    
    access_token = input("\nPaste your Supabase access token: ").strip()
    
    if not access_token:
        print("❌ No token provided. Using dashboard is easier!")
        print("\nGo to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz")
        print("Navigate to: Edge Functions → hemp-image-generator → Secrets")
        return
    
    # Project details
    project_ref = "ktoqznqmlnxrtvubewyz"
    
    # API endpoint
    api_url = f"https://api.supabase.com/v1/projects/{project_ref}/secrets"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Secrets to set
    secrets = {}
    
    print("\n📝 Enter your API keys (or press Enter to skip):\n")
    
    # Stability AI
    stability_key = input("Stability AI API Key: ").strip()
    if stability_key:
        secrets["STABILITY_API_KEY"] = stability_key
    
    # OpenAI (try to get from .env first)
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    if openai_key:
        print(f"OpenAI API Key (from .env): {openai_key[:10]}...")
        use_env = input("Use this key? (y/n): ").lower() == 'y'
        if not use_env:
            openai_key = input("Enter new OpenAI API Key: ").strip()
    else:
        openai_key = input("OpenAI API Key: ").strip()
    
    if openai_key:
        secrets["OPENAI_API_KEY"] = openai_key
    
    # Google (Imagen)
    google_key = input("Google Cloud API Key (for Imagen): ").strip()
    if google_key:
        secrets["GOOGLE_API_KEY"] = google_key
    
    if not secrets:
        print("\n❌ No secrets to set!")
        return
    
    print(f"\n🚀 Setting {len(secrets)} secrets...")
    
    try:
        response = requests.patch(
            api_url,
            headers=headers,
            json={"secrets": secrets}
        )
        
        if response.status_code == 200:
            print("\n✅ Secrets set successfully!")
            print("\nYour Edge Function now has access to:")
            for key in secrets.keys():
                print(f"  - {key}")
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("\nTry using the dashboard instead:")
        print("https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz")

def main():
    print("\n" + "="*60)
    print("🚨 EASIER ALTERNATIVE: Use Supabase Dashboard!")
    print("="*60)
    print("\nDirect link to your Edge Function secrets:")
    print("https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/functions/hemp-image-generator")
    print("\nWould you like to:")
    print("1. Use this script (requires access token)")
    print("2. Open dashboard in browser (recommended)")
    
    choice = input("\nChoice (1 or 2): ").strip()
    
    if choice == "2":
        print("\n✅ Good choice! Opening dashboard instructions...")
        print("\n1. Go to the link above")
        print("2. Find 'Environment Variables' or 'Secrets' section")
        print("3. Add these secrets:")
        print("   - STABILITY_API_KEY")
        print("   - OPENAI_API_KEY")
        print("   - GOOGLE_API_KEY (optional)")
        print("\n4. Save changes")
        print("\nThen run: python scripts/test_providers.py")
    else:
        set_edge_function_secrets()

if __name__ == "__main__":
    main()
