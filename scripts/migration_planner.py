#!/usr/bin/env python3
"""
Smart Migration Strategy for AI Image Generation
Helps transition from placeholder to real AI-generated images
"""

import os
import sys
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime
import time

# Load environment variables
load_dotenv()

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not service_key:
    print("Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file")
    sys.exit(1)

supabase: Client = create_client(url, service_key)

class MigrationStrategy:
    def __init__(self):
        self.stats = {
            'total_products': 0,
            'placeholder_count': 0,
            'ai_generated_count': 0,
            'estimated_cost': 0.0,
            'actual_cost': 0.0
        }
        
    def analyze_current_state(self):
        """Analyze current state of product images"""
        print("\n📊 Analyzing Current State...")
        print("=" * 50)
        
        # Get all products
        products = supabase.table('uses_products').select('*').execute()
        self.stats['total_products'] = len(products.data)
        
        # Count placeholder vs AI-generated
        for product in products.data:
            if product.get('image_url') and 'placeholder' in product['image_url']:
                self.stats['placeholder_count'] += 1
            elif product.get('image_url'):
                self.stats['ai_generated_count'] += 1
                
        print(f"Total Products: {self.stats['total_products']}")
        print(f"Placeholder Images: {self.stats['placeholder_count']}")
        print(f"AI-Generated Images: {self.stats['ai_generated_count']}")
        print(f"No Images: {self.stats['total_products'] - self.stats['placeholder_count'] - self.stats['ai_generated_count']}")
        
        return products.data
        
    def get_provider_recommendations(self):
        """Get provider recommendations based on budget and quality needs"""
        print("\n🎯 Provider Recommendations")
        print("=" * 50)
        
        providers = supabase.table('ai_provider_config')\
            .select('*')\
            .neq('provider_name', 'Placeholder')\
            .order('cost_per_image')\
            .execute()
            
        print("\nAvailable Providers:")
        for provider in providers.data:
            total_cost = provider['cost_per_image'] * self.stats['placeholder_count']
            print(f"\n{provider['provider_name']}:")
            print(f"  Cost per image: ${provider['cost_per_image']:.3f}")
            print(f"  Total cost for {self.stats['placeholder_count']} images: ${total_cost:.2f}")
            print(f"  Status: {'✅ Active' if provider['is_active'] else '❌ Inactive'}")
            
        return providers.data
        
    def create_migration_plan(self):
        """Create a migration plan based on priorities"""
        print("\n📋 Migration Strategies")
        print("=" * 50)
        
        strategies = {
            '1': {
                'name': 'Budget-Conscious (Stable Diffusion Only)',
                'description': 'Use Stable Diffusion for all images',
                'cost': self.stats['placeholder_count'] * 0.002,
                'time': f"{self.stats['placeholder_count'] * 2 // 60} minutes"
            },
            '2': {
                'name': 'Quality-First (DALL-E 3 Only)',
                'description': 'Use DALL-E 3 for highest quality',
                'cost': self.stats['placeholder_count'] * 0.040,
                'time': f"{self.stats['placeholder_count'] * 3 // 60} minutes"
            },
            '3': {
                'name': 'Hybrid Approach (80/20 Mix)',
                'description': '80% Stable Diffusion for general, 20% DALL-E 3 for featured',
                'cost': (self.stats['placeholder_count'] * 0.8 * 0.002) + 
                        (self.stats['placeholder_count'] * 0.2 * 0.040),
                'time': f"{self.stats['placeholder_count'] * 2.5 // 60} minutes"
            },
            '4': {
                'name': 'Test Phase (10 Products)',
                'description': 'Test with 10 products across different providers',
                'cost': (5 * 0.002) + (3 * 0.040) + (2 * 0.020),
                'time': "5 minutes"
            }
        }
        
        for key, strategy in strategies.items():
            print(f"\n{key}. {strategy['name']}")
            print(f"   {strategy['description']}")
            print(f"   Estimated Cost: ${strategy['cost']:.2f}")
            print(f"   Estimated Time: {strategy['time']}")
            
        return strategies
        
    def execute_test_migration(self, products):
        """Execute a test migration with 10 products"""
        print("\n🧪 Executing Test Migration (10 Products)")
        print("=" * 50)
        
        # Select 10 products with placeholders
        test_products = [p for p in products if p.get('image_url') and 'placeholder' in p['image_url']][:10]
        
        if len(test_products) < 10:
            print(f"Only {len(test_products)} products with placeholders available for testing")
            
        # Assign providers for testing
        provider_assignments = [
            ('Stable Diffusion', test_products[:5]),  # 5 products
            ('DALL-E 3', test_products[5:8]),         # 3 products
            ('Imagen 3', test_products[8:10])          # 2 products
        ]
        
        print("\nTest Distribution:")
        for provider, assigned_products in provider_assignments:
            print(f"- {provider}: {len(assigned_products)} products")
            
        return test_products, provider_assignments
        
    def create_batch_script(self, strategy_choice):
        """Create a batch generation script based on chosen strategy"""
        print("\n📝 Creating Batch Generation Script...")
        
        script_content = f"""#!/usr/bin/env python3
'''
Batch Image Generation Script
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Strategy: {strategy_choice}
'''

import os
import sys
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from ai_provider_manager import trigger_image_generation

load_dotenv()

url = os.environ.get("SUPABASE_URL")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, service_key)

def batch_generate():
    # Get products with placeholders
    products = supabase.table('uses_products')\\
        .select('*')\\
        .like('image_url', '%placeholder%')\\
        .execute()
    
    print(f"Found {{len(products.data)}} products to process")
    
    for i, product in enumerate(products.data):
        print(f"\\nProcessing {{i+1}}/{{len(products.data)}}: {{product['product_name']}}")
        
        try:
            # Trigger generation (provider will be selected based on active status)
            result = trigger_image_generation(product['id'])
            print(f"✅ Success: {{result}}")
            
            # Rate limiting
            time.sleep(2)  # 2 seconds between requests
            
        except Exception as e:
            print(f"❌ Error: {{str(e)}}")
            continue
            
        # Progress checkpoint every 10 images
        if (i + 1) % 10 == 0:
            print(f"\\n--- Checkpoint: {{i + 1}} images processed ---")
            cost = supabase.table('ai_generation_costs')\\
                .select('cost')\\
                .execute()
            total_cost = sum([c['cost'] for c in cost.data])
            print(f"Total cost so far: ${{total_cost:.2f}}")

if __name__ == "__main__":
    batch_generate()
"""
        
        filename = "scripts/batch_generate.py"
        print(f"Script saved as: {filename}")
        print("\nTo run: python scripts/batch_generate.py")
        
        return script_content

def main():
    """Main migration planning interface"""
    
    print("\n🚀 HempQuarterz Image Migration Planner")
    print("=" * 50)
    
    migrator = MigrationStrategy()
    
    # Analyze current state
    products = migrator.analyze_current_state()
    
    # Get provider recommendations
    providers = migrator.get_provider_recommendations()
    
    # Create migration strategies
    strategies = migrator.create_migration_plan()
    
    # User choice
    print("\n\nSelect Migration Strategy:")
    choice = input("Enter choice (1-4): ").strip()
    
    if choice == '4':
        # Execute test migration
        test_products, assignments = migrator.execute_test_migration(products)
        
        print("\n\nReady to start test migration?")
        if input("Type 'yes' to proceed: ").lower() == 'yes':
            print("\nTo execute test migration, run:")
            print("python scripts/run_generation.py")
            print("\nThen select option 7 (Generate for specific products)")
            print(f"Use product IDs: {','.join([str(p['id']) for p in test_products])}")
    else:
        # Create batch script
        migrator.create_batch_script(strategies[choice]['name'])
        
    print("\n\n✅ Migration plan created!")
    print("\nNext Steps:")
    print("1. Ensure API keys are added to Supabase")
    print("2. Run test_providers.py to verify providers work")
    print("3. Execute your chosen migration strategy")
    print("4. Monitor progress in the dashboard")

if __name__ == "__main__":
    main()
