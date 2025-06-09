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
