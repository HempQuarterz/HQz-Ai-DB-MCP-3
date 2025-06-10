#!/usr/bin/env python3
"""
Script to verify GitHub Actions secrets are properly configured
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_secrets():
    """Check if required secrets are set"""
    secrets = {
        'SUPABASE_URL': os.environ.get('SUPABASE_URL'),
        'SUPABASE_ANON_KEY': os.environ.get('SUPABASE_ANON_KEY'),
        'OPENAI_API_KEY': os.environ.get('OPENAI_API_KEY'),
        'STABILITY_API_KEY': os.environ.get('STABILITY_API_KEY'),
        'GOOGLE_API_KEY': os.environ.get('GOOGLE_API_KEY'),
        'GOOGLE_SEARCH_ENGINE_ID': os.environ.get('GOOGLE_SEARCH_ENGINE_ID')
    }
    
    print("🔐 GitHub Actions Secrets Configuration Check")
    print("=" * 50)
    print("\nRequired Secrets for Hemp Automation:")
    print("-" * 50)
    
    required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'OPENAI_API_KEY']
    optional = ['STABILITY_API_KEY', 'GOOGLE_API_KEY', 'GOOGLE_SEARCH_ENGINE_ID']
    
    all_good = True
    
    # Check required secrets
    print("\n✅ REQUIRED:")
    for secret in required:
        if secrets[secret]:
            print(f"  ✓ {secret}: Set (starts with: {secrets[secret][:20]}...)")
        else:
            print(f"  ✗ {secret}: NOT SET ❌")
            all_good = False
    
    # Check optional secrets
    print("\n📋 OPTIONAL:")
    for secret in optional:
        if secrets[secret]:
            print(f"  ✓ {secret}: Set")
        else:
            print(f"  - {secret}: Not set (optional)")
    
    print("\n" + "=" * 50)
    
    if all_good:
        print("✅ All required secrets are configured!")
        print("\nYour GitHub Actions should run successfully.")
    else:
        print("❌ Some required secrets are missing!")
        print("\nTo add secrets to GitHub:")
        print("1. Go to your repository on GitHub")
        print("2. Click Settings > Secrets and variables > Actions")
        print("3. Click 'New repository secret'")
        print("4. Add each missing secret with its value")
    
    # Show expected values from .env
    print("\n📄 Expected values from your .env file:")
    print(f"SUPABASE_URL should be: https://ktoqznqmlnxrtvubewyz.supabase.co")
    print(f"SUPABASE_ANON_KEY should start with: eyJhbGciOiJIUzI1NiIsInR5cCI...")
    
    return all_good

if __name__ == "__main__":
    check_secrets()