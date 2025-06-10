# validate_hemp_data.py
"""
Data validation script to ensure hemp products are properly stored in all tables
Checks for consistency between automation tables and main database tables
"""

import os
from datetime import datetime, timedelta
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class HempDataValidator:
    def __init__(self):
        self.supabase = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
    def check_table_counts(self):
        """Compare record counts between tables"""
        print("\n📊 TABLE RECORD COUNTS")
        print("=" * 50)
        
        # Check automation tables
        auto_products = self.supabase.table('hemp_automation_products').select('*', count='exact').execute()
        auto_companies = self.supabase.table('hemp_automation_companies').select('*', count='exact').execute()
        agent_runs = self.supabase.table('hemp_agent_runs').select('*', count='exact').execute()
        
        print(f"\n🤖 Automation Tables:")
        print(f"   hemp_automation_products: {auto_products.count}")
        print(f"   hemp_automation_companies: {auto_companies.count}")
        print(f"   hemp_agent_runs: {agent_runs.count}")
        
        # Check main tables
        uses_products = self.supabase.table('uses_products').select('*', count='exact').execute()
        companies = self.supabase.table('companies').select('*', count='exact').execute()
        plant_parts = self.supabase.table('plant_parts').select('*', count='exact').execute()
        industries = self.supabase.table('industries').select('*', count='exact').execute()
        industry_subs = self.supabase.table('industry_sub_categories').select('*', count='exact').execute()
        
        print(f"\n📚 Main Database Tables:")
        print(f"   uses_products: {uses_products.count}")
        print(f"   companies: {companies.count}")
        print(f"   plant_parts: {plant_parts.count}")
        print(f"   industries: {industries.count}")
        print(f"   industry_sub_categories: {industry_subs.count}")
        
        return {
            'auto_products': auto_products.count,
            'uses_products': uses_products.count,
            'auto_companies': auto_companies.count,
            'companies': companies.count
        }
    
    def check_recent_entries(self, hours=24):
        """Check entries created in the last N hours"""
        print(f"\n🕐 ENTRIES IN LAST {hours} HOURS")
        print("=" * 50)
        
        cutoff_time = (datetime.now() - timedelta(hours=hours)).isoformat()
        
        # Recent automation products
        recent_auto = self.supabase.table('hemp_automation_products')\
            .select('name, company_id, plant_part, industry, created_at')\
            .gte('created_at', cutoff_time)\
            .order('created_at', desc=True)\
            .execute()
        
        print(f"\n🤖 Recent Automation Products: {len(recent_auto.data)}")
        for product in recent_auto.data[:5]:
            print(f"   - {product['name']} ({product['plant_part']}/{product['industry']})")
        
        # Recent main products
        recent_main = self.supabase.table('uses_products')\
            .select('name, plant_part_id, industry_sub_category_id, created_at')\
            .gte('created_at', cutoff_time)\
            .order('created_at', desc=True)\
            .execute()
        
        print(f"\n📚 Recent Main Products: {len(recent_main.data)}")
        for product in recent_main.data[:5]:
            print(f"   - {product['name']}")
    
    def check_orphaned_records(self):
        """Check for orphaned records"""
        print("\n🔍 CHECKING FOR ORPHANED RECORDS")
        print("=" * 50)
        
        # Check products without valid plant parts
        products_no_part = self.supabase.table('uses_products')\
            .select('id, name, plant_part_id')\
            .is_('plant_part_id', 'null')\
            .execute()
        
        if products_no_part.data:
            print(f"\n⚠️  Products without plant parts: {len(products_no_part.data)}")
            for p in products_no_part.data[:3]:
                print(f"   - {p['name']}")
        else:
            print("\n✅ All products have plant parts")
        
        # Check products without industry categories
        products_no_industry = self.supabase.table('uses_products')\
            .select('id, name, industry_sub_category_id')\
            .is_('industry_sub_category_id', 'null')\
            .execute()
        
        if products_no_industry.data:
            print(f"\n⚠️  Products without industry categories: {len(products_no_industry.data)}")
            for p in products_no_industry.data[:3]:
                print(f"   - {p['name']}")
        else:
            print("✅ All products have industry categories")
        
        # Check products without companies
        all_products = self.supabase.table('uses_products').select('id, name').execute()
        products_with_companies = self.supabase.table('product_companies')\
            .select('use_product_id')\
            .execute()
        
        product_ids_with_companies = {pc['use_product_id'] for pc in products_with_companies.data}
        orphaned_products = [p for p in all_products.data if p['id'] not in product_ids_with_companies]
        
        if orphaned_products:
            print(f"\n⚠️  Products without companies: {len(orphaned_products)}")
            for p in orphaned_products[:3]:
                print(f"   - {p['name']}")
        else:
            print("✅ All products have associated companies")
    
    def check_duplicates(self):
        """Check for duplicate entries"""
        print("\n🔍 CHECKING FOR DUPLICATES")
        print("=" * 50)
        
        # Check automation products
        auto_products = self.supabase.table('hemp_automation_products')\
            .select('name, company_id')\
            .execute()
        
        auto_duplicates = {}
        for p in auto_products.data:
            key = f"{p['name']}_{p['company_id']}"
            auto_duplicates[key] = auto_duplicates.get(key, 0) + 1
        
        auto_dups = {k: v for k, v in auto_duplicates.items() if v > 1}
        if auto_dups:
            print(f"\n⚠️  Duplicates in automation products: {len(auto_dups)}")
            for k, count in list(auto_dups.items())[:3]:
                name = k.split('_')[0]
                print(f"   - {name}: {count} copies")
        else:
            print("\n✅ No duplicates in automation products")
        
        # Check main products
        main_products = self.supabase.table('uses_products')\
            .select('name, plant_part_id')\
            .execute()
        
        main_duplicates = {}
        for p in main_products.data:
            key = f"{p['name']}_{p['plant_part_id']}"
            main_duplicates[key] = main_duplicates.get(key, 0) + 1
        
        main_dups = {k: v for k, v in main_duplicates.items() if v > 1}
        if main_dups:
            print(f"\n⚠️  Duplicates in main products: {len(main_dups)}")
            for k, count in list(main_dups.items())[:3]:
                name = k.split('_')[0]
                print(f"   - {name}: {count} copies")
        else:
            print("✅ No duplicates in main products")
    
    def generate_report(self):
        """Generate a comprehensive validation report"""
        print("\n" + "="*60)
        print("🌿 HEMP DATABASE VALIDATION REPORT")
        print(f"📅 Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        
        # Get counts
        counts = self.check_table_counts()
        
        # Check recent entries
        self.check_recent_entries(24)
        
        # Check orphaned records
        self.check_orphaned_records()
        
        # Check duplicates
        self.check_duplicates()
        
        # Summary
        print("\n" + "="*60)
        print("📊 SUMMARY")
        print("="*60)
        
        if counts['uses_products'] > 0:
            coverage = (counts['uses_products'] / counts['auto_products'] * 100) if counts['auto_products'] > 0 else 0
            print(f"\n📈 Main table coverage: {coverage:.1f}%")
            print(f"   ({counts['uses_products']} of {counts['auto_products']} automation products)")
        
        # Agent activity
        recent_runs = self.supabase.table('hemp_agent_runs')\
            .select('agent_name, products_saved, status')\
            .gte('timestamp', (datetime.now() - timedelta(days=7)).isoformat())\
            .execute()
        
        if recent_runs.data:
            successful_runs = [r for r in recent_runs.data if r['status'] == 'success']
            total_saved = sum(r['products_saved'] for r in successful_runs)
            print(f"\n🤖 Agent Activity (Last 7 days):")
            print(f"   Total runs: {len(recent_runs.data)}")
            print(f"   Successful: {len(successful_runs)}")
            print(f"   Products saved: {total_saved}")
        
        print("\n" + "="*60)


if __name__ == "__main__":
    # Check environment variables
    required_vars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
    missing = [var for var in required_vars if not os.environ.get(var)]
    
    if missing:
        print("❌ Missing environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\n📋 Please update your .env file")
        exit(1)
    
    # Run validation
    validator = HempDataValidator()
    validator.generate_report()
