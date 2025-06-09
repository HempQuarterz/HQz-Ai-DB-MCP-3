# setup_automation_tables.py
"""
Script to create hemp automation tables in Supabase
Run this once to set up the required tables
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# SQL to create automation tables
AUTOMATION_TABLES_SQL = """
-- Hemp Automation Tables Schema
-- These tables are used by the hemp automation agents to track products and companies

-- Create automation companies table if not exists
CREATE TABLE IF NOT EXISTS public.hemp_automation_companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    website TEXT,
    primary_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automation products table if not exists
CREATE TABLE IF NOT EXISTS public.hemp_automation_products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    company_id INTEGER REFERENCES public.hemp_automation_companies(id) ON DELETE CASCADE,
    description TEXT,
    plant_part TEXT,
    industry TEXT,
    benefits TEXT[],
    target_market TEXT,
    price_range TEXT,
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, company_id)
);

-- Create agent runs tracking table if not exists
CREATE TABLE IF NOT EXISTS public.hemp_agent_runs (
    id SERIAL PRIMARY KEY,
    agent_name TEXT NOT NULL,
    products_found INTEGER DEFAULT 0,
    products_saved INTEGER DEFAULT 0,
    companies_saved INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hemp_automation_products_company_id ON public.hemp_automation_products(company_id);
CREATE INDEX IF NOT EXISTS idx_hemp_automation_products_plant_part ON public.hemp_automation_products(plant_part);
CREATE INDEX IF NOT EXISTS idx_hemp_automation_products_industry ON public.hemp_automation_products(industry);
CREATE INDEX IF NOT EXISTS idx_hemp_agent_runs_agent_name ON public.hemp_agent_runs(agent_name);
CREATE INDEX IF NOT EXISTS idx_hemp_agent_runs_timestamp ON public.hemp_agent_runs(timestamp);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_hemp_automation_companies_updated') THEN
        CREATE TRIGGER on_hemp_automation_companies_updated
        BEFORE UPDATE ON public.hemp_automation_companies
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_hemp_automation_products_updated') THEN
        CREATE TRIGGER on_hemp_automation_products_updated
        BEFORE UPDATE ON public.hemp_automation_products
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END
$$;
"""

def setup_tables():
    """Create automation tables in Supabase"""
    # Check environment variables
    if not os.environ.get('SUPABASE_URL') or not os.environ.get('SUPABASE_ANON_KEY'):
        print("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file")
        return
    
    print("🔧 Setting up hemp automation tables...")
    
    try:
        # Connect to Supabase
        supabase = create_client(
            os.environ['SUPABASE_URL'],
            os.environ['SUPABASE_ANON_KEY']
        )
        
        # Note: Supabase Python client doesn't support direct SQL execution
        # You'll need to run this SQL in the Supabase dashboard
        print("\n📋 Please run the following SQL in your Supabase SQL editor:")
        print("   1. Go to: https://supabase.com/dashboard/project/ktoqznqmlnxrtvubewyz/sql/new")
        print("   2. Copy and paste the SQL from schema_automation.sql")
        print("   3. Click 'Run' to execute")
        print("\n✅ Tables will be created with:")
        print("   - hemp_automation_companies")
        print("   - hemp_automation_products")
        print("   - hemp_agent_runs")
        print("   - All necessary indexes and triggers")
        
        # Test connection
        print("\n🔍 Testing Supabase connection...")
        test = supabase.table('hemp_automation_companies').select('*', count='exact').limit(1).execute()
        print("✅ Connection successful!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n📝 Manual setup required:")
        print("   1. Go to your Supabase dashboard")
        print("   2. Navigate to SQL editor")
        print("   3. Run the SQL from schema_automation.sql")

if __name__ == "__main__":
    setup_tables()
    print("\n📖 Next steps:")
    print("   1. Test the enhanced agent: python hemp_agent_enhanced.py seeds-food --limit 2")
    print("   2. Validate data: python validate_hemp_data.py")
    print("   3. The GitHub Actions will now use the enhanced agent automatically")
