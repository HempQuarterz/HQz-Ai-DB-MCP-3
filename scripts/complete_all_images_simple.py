#!/usr/bin/env python3
"""
Simple script to complete image generation using the existing system
"""

import os
import sys
import subprocess

print("🎨 HempQuarterz Image Generation")
print("=" * 50)
print("\nThis will use the standard image generation system.")
print("Currently configured to use placeholder images (FREE).")
print("\nTo use real AI providers, you need to:")
print("1. Deploy the Edge Function with provider implementations")
print("2. Add API keys to Supabase Edge Function secrets")
print("3. Update the provider in your .env file")
print("\n" + "=" * 50)

# Check if we should proceed
response = input("\nProceed with current configuration? (yes/no): ")
if response.lower() != 'yes':
    print("Cancelled.")
    sys.exit(0)

# Run the main image generation script
script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'image_generation', 'hemp_image_generator.py')
if os.path.exists(script_path):
    print(f"\nRunning: python {script_path}")
    subprocess.run([sys.executable, script_path])
else:
    print(f"Error: Could not find {script_path}")
    print("\nAlternatively, run:")
    print("cd image_generation")
    print("python hemp_image_generator.py")