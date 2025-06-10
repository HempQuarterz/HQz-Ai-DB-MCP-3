#!/usr/bin/env python3
"""
Enhanced Complete All Images - Works with real AI providers
No dependency on ai_provider_config table
"""

import os
import sys
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
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

# Provider configurations
PROVIDERS = {
    'placeholder': {'name': 'Placeholder', 'cost': 0.00},
    'stable_diffusion': {'name': 'Stable Diffusion', 'cost': 0.002},
    'dall_e_3': {'name': 'DALL-E 3', 'cost': 0.040},
}

class ImageGenerator:
    def __init__(self):
        self.stats = {
            'total_products': 0,
            'placeholders': 0,
            'processed': 0,
            'success': 0,
            'failed': 0,
            'total_cost': 0.0
        }
        self.edge_function_url = f"{url}/functions/v1/hemp-image-generator"
        
    def get_products_with_placeholders(self):
        """Get all products that still have placeholder images"""
        print("\n🔍 Finding products with placeholder images...")
        
        # Get products with placeholder images or null images
        products = supabase.table('uses_products')\
            .select('*')\
            .or_('image_url.like.%placeholder%,image_url.is.null')\
            .execute()
            
        self.stats['placeholders'] = len(products.data)
        
        # Also get total product count
        all_products = supabase.table('uses_products').select('id').execute()
        self.stats['total_products'] = len(all_products.data)
        
        print(f"Found {self.stats['placeholders']} products with placeholder/missing images")
        print(f"Total products: {self.stats['total_products']}")
        
        return products.data
        
    def generate_image(self, product, provider_name='placeholder'):
        """Generate image for a single product"""
        payload = {
            "productId": product['id'],
            "productName": product['name'],
            "productDescription": product.get('description', 'Hemp product'),
            "forceProvider": provider_name
        }
            
        headers = {
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(
                self.edge_function_url, 
                json=payload, 
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Check if we got a real image (not placeholder)
                if result.get('imageUrl') and 'placeholder' not in result.get('imageUrl', ''):
                    self.stats['success'] += 1
                    self.stats['total_cost'] += PROVIDERS[provider_name]['cost']
                    return True, result.get('imageUrl')
                else:
                    return False, "Received placeholder image"
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                return False, error_msg
                
        except requests.exceptions.Timeout:
            return False, "Request timeout"
        except Exception as e:
            return False, str(e)
            
    def run_batch(self, products, provider_name='placeholder', limit=None):
        """Process a batch of products"""
        products_to_process = products[:limit] if limit else products
        
        print(f"\n🏭 Generating images for {len(products_to_process)} products...")
        print(f"This may take a while. Press Ctrl+C to stop.\n")
        
        start_time = time.time()
        
        try:
            for i, product in enumerate(products_to_process):
                self.stats['processed'] += 1
                
                print(f"\n[{i+1}/{len(products_to_process)}] Processing: {product['name']}")
                
                success, result = self.generate_image(product, provider_name)
                
                if success:
                    print(f"  ✅ Success! Image URL: {result[:50]}...")
                else:
                    print(f"  ❌ Failed: {result}")
                    self.stats['failed'] += 1
                
                # Small delay to avoid rate limiting
                if provider_name != 'placeholder':
                    time.sleep(1)
                    
        except KeyboardInterrupt:
            print("\n\n⚠️  Generation interrupted by user")
            
        elapsed = int(time.time() - start_time)
        minutes = elapsed // 60
        seconds = elapsed % 60
        
        print(f"\n{'='*50}")
        print("📊 FINAL REPORT")
        print(f"{'='*50}")
        print(f"Total Products: {self.stats['total_products']}")
        print(f"Placeholders Found: {self.stats['placeholders']}")
        print(f"Processed: {self.stats['processed']}")
        print(f"Successful: {self.stats['success']}")
        print(f"Failed: {self.stats['failed']}")
        print(f"Total Cost: ${self.stats['total_cost']:.2f}")
        print(f"Time Elapsed: {minutes} minutes {seconds} seconds")
        
        remaining = self.stats['placeholders'] - self.stats['success']
        print(f"\nRemaining Placeholders: {remaining}")

def main():
    print("\n🎨 HempQuarterz Complete Image Generation (Enhanced)")
    print("="*50)
    
    generator = ImageGenerator()
    
    print("\n🚀 Starting Batch Image Generation")
    print("="*50)
    
    # Get products
    products = generator.get_products_with_placeholders()
    
    if not products:
        print("\n✅ All products already have images!")
        return
        
    # Show provider options
    print("\n📊 Available Providers:")
    for key, provider in PROVIDERS.items():
        cost_total = provider['cost'] * len(products)
        print(f"  {key}: ${provider['cost']:.3f}/image (Total: ${cost_total:.2f})")
    
    # Get provider choice
    print("\nWhich provider to use?")
    print("1. placeholder (FREE)")
    print("2. stable_diffusion ($0.30 total)")
    print("3. dall_e_3 ($5.96 total)")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    provider_map = {
        '1': 'placeholder',
        '2': 'stable_diffusion',
        '3': 'dall_e_3'
    }
    
    provider_name = provider_map.get(choice, 'placeholder')
    provider = PROVIDERS[provider_name]
    
    # Confirm
    cost_estimate = provider['cost'] * len(products)
    print(f"\n💰 Estimated Cost using {provider['name']}: ${cost_estimate:.2f}")
    print(f"   For {len(products)} images")
    
    # Limit option for testing
    limit_input = input("\nProcess all or limit? Enter number to limit (or press Enter for all): ").strip()
    limit = int(limit_input) if limit_input.isdigit() else None
    
    proceed = input("\nProceed with generation? (yes/no): ").strip().lower()
    
    if proceed == 'yes':
        generator.run_batch(products, provider_name, limit)
    else:
        print("\nCancelled.")

if __name__ == "__main__":
    main()