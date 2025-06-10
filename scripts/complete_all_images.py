#!/usr/bin/env python3
"""
Complete All Images - Replace placeholders with AI-generated images
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
        
        products = supabase.table('uses_products')\
            .select('*')\
            .like('image_url', '%placeholder%')\
            .execute()
            
        self.stats['placeholders'] = len(products.data)
        
        # Also get total product count
        all_products = supabase.table('uses_products').select('id').execute()
        self.stats['total_products'] = len(all_products.data)
        
        print(f"Found {self.stats['placeholders']} products with placeholder images")
        print(f"Total products: {self.stats['total_products']}")
        
        return products.data
        
    def get_active_providers(self):
        """Get active providers sorted by cost"""
        providers = supabase.table('ai_provider_config')\
            .select('*')\
            .eq('is_active', True)\
            .neq('provider_name', 'placeholder')\
            .order('cost_per_image')\
            .execute()
            
        return providers.data
        
    def generate_image(self, product, provider=None):
        """Generate image for a single product"""
        payload = {
            "productId": product['id'],
            "productName": product['name'],
            "productDescription": product.get('description', 'Hemp product')
        }
        
        if provider:
            payload["forceProvider"] = provider['provider_name']
            
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
                    self.stats['total_cost'] += result.get('cost', 0)
                    return True, result
                else:
                    return False, "Received placeholder image"
            else:
                return False, f"Error {response.status_code}: {response.text}"
                
        except Exception as e:
            return False, str(e)
            
    def run_batch_generation(self, limit=None):
        """Run batch generation for all placeholder images"""
        print("\n🚀 Starting Batch Image Generation")
        print("=" * 50)
        
        # Get products with placeholders
        products = self.get_products_with_placeholders()
        
        if not products:
            print("✅ No placeholder images found! All products have images.")
            return
            
        # Get active providers
        providers = self.get_active_providers()
        
        if not providers:
            print("❌ No active providers found!")
            print("Please activate at least one provider using test_providers.py")
            return
            
        print(f"\n📊 Active Providers (in order of cost):")
        for p in providers:
            print(f"  - {p['provider_name']}: ${p['cost_per_image']:.3f}/image")
            
        # Confirm before proceeding
        primary_provider = providers[0]
        estimated_cost = len(products) * primary_provider['cost_per_image']
        
        print(f"\n💰 Estimated Cost using {primary_provider['provider_name']}: ${estimated_cost:.2f}")
        print(f"   For {len(products)} images")
        
        confirm = input("\nProceed with generation? (yes/no): ").strip().lower()
        if confirm != 'yes':
            print("❌ Cancelled by user")
            return
            
        # Apply limit if specified
        if limit:
            products = products[:limit]
            print(f"\n🎯 Limited to {limit} products for testing")
            
        # Start generation
        print(f"\n🏭 Generating images for {len(products)} products...")
        print("This may take a while. Press Ctrl+C to stop.\n")
        
        start_time = time.time()
        
        try:
            for i, product in enumerate(products):
                self.stats['processed'] += 1
                
                print(f"\n[{i+1}/{len(products)}] Processing: {product['name']}")
                
                # Try primary provider first
                success, result = self.generate_image(product, primary_provider)
                
                if not success and len(providers) > 1:
                    # Try backup provider
                    print(f"  ⚠️  Primary provider failed, trying backup...")
                    success, result = self.generate_image(product, providers[1])
                    
                if success:
                    print(f"  ✅ Success! Cost: ${result.get('cost', 0):.3f}")
                    print(f"  📸 Image URL: {result.get('imageUrl', 'N/A')[:50]}...")
                else:
                    self.stats['failed'] += 1
                    print(f"  ❌ Failed: {result}")
                    
                # Progress update every 10 images
                if (i + 1) % 10 == 0:
                    elapsed = time.time() - start_time
                    rate = (i + 1) / elapsed
                    remaining = (len(products) - i - 1) / rate
                    
                    print(f"\n📊 Progress Report:")
                    print(f"  Processed: {self.stats['processed']}")
                    print(f"  Success: {self.stats['success']}")
                    print(f"  Failed: {self.stats['failed']}")
                    print(f"  Total Cost: ${self.stats['total_cost']:.2f}")
                    print(f"  ETA: {int(remaining/60)} minutes")
                    
                # Rate limiting
                time.sleep(2)  # 2 seconds between requests
                
        except KeyboardInterrupt:
            print("\n\n⚠️  Generation interrupted by user")
            
        # Final report
        elapsed = time.time() - start_time
        print("\n" + "=" * 50)
        print("📊 FINAL REPORT")
        print("=" * 50)
        print(f"Total Products: {self.stats['total_products']}")
        print(f"Placeholders Found: {self.stats['placeholders']}")
        print(f"Processed: {self.stats['processed']}")
        print(f"Successful: {self.stats['success']}")
        print(f"Failed: {self.stats['failed']}")
        print(f"Total Cost: ${self.stats['total_cost']:.2f}")
        print(f"Time Elapsed: {int(elapsed/60)} minutes {int(elapsed%60)} seconds")
        
        if self.stats['success'] > 0:
            print(f"Average Cost per Image: ${self.stats['total_cost']/self.stats['success']:.3f}")
            
        # Check remaining
        remaining = supabase.table('uses_products')\
            .select('id')\
            .like('image_url', '%placeholder%')\
            .execute()
            
        print(f"\nRemaining Placeholders: {len(remaining.data)}")

def main():
    """Main function"""
    print("\n🎨 HempQuarterz Complete Image Generation")
    print("=" * 50)
    
    generator = ImageGenerator()
    
    # Check for command line arguments
    if len(sys.argv) > 1:
        try:
            limit = int(sys.argv[1])
            print(f"📌 Limited mode: Will process {limit} products only")
            generator.run_batch_generation(limit=limit)
        except ValueError:
            print("❌ Invalid limit. Usage: python complete_all_images.py [limit]")
    else:
        # Full batch mode
        generator.run_batch_generation()

if __name__ == "__main__":
    main()
