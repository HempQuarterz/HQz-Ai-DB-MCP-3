"""
Migration Script: Transfer products from hemp_automation_products to uses_products
This script consolidates the discovered products into the main table
"""

import os
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://ktoqznqmlnxrtvubewyz.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def migrate_automation_products():
    """Migrate products from hemp_automation_products to uses_products"""
    print("Starting migration of automation products...")
    
    # Get all automation products
    automation_products = supabase.table("hemp_automation_products").select("*").execute()
    print(f"Found {len(automation_products.data)} products in automation table")
    
    # Get plant parts and industries mappings
    plant_parts = supabase.table("plant_parts").select("*").execute().data
    industries = supabase.table("industries").select("*").execute().data
    sub_categories = supabase.table("industry_sub_categories").select("*").execute().data
    
    # Create lookup dictionaries
    plant_part_map = {}
    for pp in plant_parts:
        # Map various names to IDs
        plant_part_map[pp['name'].lower()] = pp['id']
        if 'seed' in pp['name'].lower():
            plant_part_map['seeds'] = pp['id']
        if 'fiber' in pp['name'].lower() or 'bast' in pp['name'].lower():
            plant_part_map['fiber'] = pp['id']
        if 'hurd' in pp['name'].lower() or 'shiv' in pp['name'].lower():
            plant_part_map['hurds'] = pp['id']
        if 'flower' in pp['name'].lower():
            plant_part_map['flower'] = pp['id']
        if 'leaves' in pp['name'].lower():
            plant_part_map['leaves'] = pp['id']
        if 'root' in pp['name'].lower():
            plant_part_map['roots'] = pp['id']
        
    industry_map = {}
    for ind in industries:
        industry_map[ind['name'].lower()] = ind['id']
        # Add variations
        if 'food' in ind['name'].lower():
            industry_map['food_beverage'] = ind['id']
        if 'textile' in ind['name'].lower():
            industry_map['textiles'] = ind['id']
        if 'cosmetic' in ind['name'].lower():
            industry_map['cosmetics'] = ind['id']
        if 'wellness' in ind['name'].lower() or 'pharma' in ind['name'].lower():
            industry_map['medicine'] = ind['id']
            industry_map['wellness'] = ind['id']
        if 'construction' in ind['name'].lower():
            industry_map['construction'] = ind['id']
            industry_map['hempcrete'] = ind['id']
    
    # Process each automation product
    migrated = 0
    skipped = 0
    errors = 0
    
    for auto_product in automation_products.data:
        try:
            # Check if already exists in uses_products
            existing = supabase.table("uses_products").select("id").eq(
                "name", auto_product['name']
            ).execute()
            
            if existing.data:
                print(f"Skipping {auto_product['name']} - already exists")
                skipped += 1
                continue
            
            # Map plant part
            plant_part_id = None
            if auto_product.get('plant_part'):
                plant_part_lower = auto_product['plant_part'].lower()
                plant_part_id = plant_part_map.get(plant_part_lower)
                
                if not plant_part_id:
                    # Try to find partial match
                    for key, pid in plant_part_map.items():
                        if key in plant_part_lower or plant_part_lower in key:
                            plant_part_id = pid
                            break
            
            if not plant_part_id:
                print(f"Warning: No plant part match for '{auto_product.get('plant_part')}' in {auto_product['name']}")
                # Default to Hemp Seed if no match
                plant_part_id = plant_part_map.get('hemp seed', 1)
            
            # Map industry
            industry_id = None
            sub_category_id = None
            
            if auto_product.get('industry'):
                industry_lower = auto_product['industry'].lower()
                
                # First try to find matching sub-category
                for sub_cat in sub_categories:
                    if industry_lower in sub_cat['name'].lower() or sub_cat['name'].lower() in industry_lower:
                        sub_category_id = sub_cat['id']
                        break
                
                # If no sub-category, find industry
                if not sub_category_id:
                    for ind_name, ind_id in industry_map.items():
                        if ind_name in industry_lower or industry_lower in ind_name:
                            industry_id = ind_id
                            break
            
            # Prepare the uses_products entry
            new_product = {
                'name': auto_product['name'],
                'description': auto_product.get('description', ''),
                'plant_part_id': plant_part_id,
                'industry_sub_category_id': sub_category_id,
                'benefits_advantages': auto_product.get('benefits', []),
                'sustainability_aspects': [
                    'Sustainable hemp-based product',
                    'Renewable resource',
                    'Eco-friendly alternative'
                ],
                'keywords': [
                    'hemp',
                    auto_product.get('plant_part', '').lower(),
                    auto_product.get('industry', '').lower(),
                    'sustainable'
                ],
                'data_sources': [{
                    'type': 'automation_agent',
                    'date': auto_product.get('created_at', datetime.now().isoformat())
                }],
                'data_completeness_score': 60,  # Base score for migrated products
                'last_enriched_date': datetime.now().isoformat()
            }
            
            # Add technical specifications if available
            if auto_product.get('price_range') or auto_product.get('availability'):
                new_product['technical_specifications'] = {
                    'price_range': auto_product.get('price_range'),
                    'availability': auto_product.get('availability'),
                    'target_market': auto_product.get('target_market')
                }
            
            # Insert the product
            result = supabase.table("uses_products").insert(new_product).execute()
            print(f"✓ Migrated: {auto_product['name']}")
            migrated += 1
            
        except Exception as e:
            print(f"✗ Error migrating {auto_product['name']}: {e}")
            errors += 1
    
    print(f"\nMigration Summary:")
    print(f"✅ Successfully migrated: {migrated} products")
    print(f"⚠️  Skipped (already exist): {skipped} products")
    print(f"❌ Errors: {errors}")
    
    return {
        'migrated': migrated,
        'skipped': skipped,
        'errors': errors
    }

def cleanup_duplicates():
    """Remove duplicate products based on name"""
    print("\nChecking for duplicates...")
    
    # Get all products
    all_products = supabase.table("uses_products").select("*").order("created_at").execute()
    
    # Group by name
    product_groups = {}
    for product in all_products.data:
        name = product['name'].lower().strip()
        if name not in product_groups:
            product_groups[name] = []
        product_groups[name].append(product)
    
    # Find duplicates
    duplicates_removed = 0
    for name, products in product_groups.items():
        if len(products) > 1:
            print(f"Found {len(products)} instances of '{products[0]['name']}'")
            # Keep the most complete one (highest data_completeness_score)
            products.sort(key=lambda p: p.get('data_completeness_score', 0), reverse=True)
            
            # Delete the rest
            for duplicate in products[1:]:
                try:
                    supabase.table("uses_products").delete().eq("id", duplicate['id']).execute()
                    duplicates_removed += 1
                except Exception as e:
                    print(f"Error removing duplicate: {e}")
    
    print(f"Removed {duplicates_removed} duplicate products")
    return duplicates_removed

def main():
    """Main execution"""
    print("🌿 Hemp Products Migration Script 🌿\n")
    
    # Run migration
    migration_results = migrate_automation_products()
    
    # Clean duplicates
    duplicates_removed = cleanup_duplicates()
    
    # Get final count
    final_count = supabase.table("uses_products").select("id", count="exact").execute()
    
    print(f"\n📊 Final Statistics:")
    print(f"Total products in database: {final_count.count}")
    print(f"Products migrated: {migration_results['migrated']}")
    print(f"Duplicates removed: {duplicates_removed}")

if __name__ == "__main__":
    main()
