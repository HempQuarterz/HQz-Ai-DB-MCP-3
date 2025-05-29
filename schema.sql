-- Core Tables
CREATE TABLE IF NOT EXISTS public.hemp_plant_archetypes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    cultivation_focus_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plant_parts (
    id SERIAL PRIMARY KEY,
    archetype_id INTEGER NOT NULL REFERENCES public.hemp_plant_archetypes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_plant_parts_archetype_id ON public.plant_parts(archetype_id);

CREATE TABLE IF NOT EXISTS public.industries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.industry_sub_categories (
    id SERIAL PRIMARY KEY,
    industry_id INTEGER NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_industry_sub_categories_industry_id ON public.industry_sub_categories(industry_id);

-- TODO: Add keywords field and update search_vector for uses_products
-- PLANNED ADDITION for uses_products table:
-- keywords TEXT[],
-- PLANNED UPDATE for uses_products.search_vector:
-- search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(array_to_string(keywords, ' '), ''))) STORED,
CREATE TABLE IF NOT EXISTS public.uses_products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE RESTRICT,
    industry_sub_category_id INTEGER REFERENCES public.industry_sub_categories(id) ON DELETE SET NULL,
    benefits_advantages TEXT[],
    commercialization_stage TEXT,
    manufacturing_processes_summary TEXT,
    sustainability_aspects TEXT[],
    historical_context_facts TEXT[],
    technical_specifications JSONB,
    miscellaneous_info JSONB,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_uses_products_plant_part_id ON public.uses_products(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_uses_products_industry_sub_category_id ON public.uses_products(industry_sub_category_id);
CREATE INDEX IF NOT EXISTS uses_products_search_idx ON public.uses_products USING GIN (search_vector);

CREATE TABLE IF NOT EXISTS public.product_images (
    id SERIAL PRIMARY KEY,
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0, -- "order" is a keyword, so quoted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- No updated_at as images are often immutable or replaced
);
CREATE INDEX IF NOT EXISTS idx_product_images_use_product_id ON public.product_images(use_product_id);

CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id SERIAL PRIMARY KEY,
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    vendor_name TEXT NOT NULL,
    product_url TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_use_product_id ON public.affiliate_links(use_product_id);

-- Satellite/Supporting Tables
CREATE TABLE IF NOT EXISTS public.companies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    website TEXT,
    location TEXT,
    primary_activity TEXT,
    specialization TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_companies (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, company_id)
);

CREATE TABLE IF NOT EXISTS public.regulatory_jurisdictions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT,
    parent_jurisdiction_id INTEGER REFERENCES public.regulatory_jurisdictions(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_regulatory_jurisdictions_parent_id ON public.regulatory_jurisdictions(parent_jurisdiction_id);

CREATE TABLE IF NOT EXISTS public.regulations (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER NOT NULL REFERENCES public.regulatory_jurisdictions(id) ON DELETE CASCADE,
    regulation_title TEXT NOT NULL,
    summary TEXT,
    full_text_url TEXT,
    effective_date DATE,
    topic TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- This should be manually updated or via trigger
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -- updated_at is essentially last_updated here
);
CREATE INDEX IF NOT EXISTS idx_regulations_jurisdiction_id ON public.regulations(jurisdiction_id);

CREATE TABLE IF NOT EXISTS public.product_regulations (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    regulation_id INTEGER NOT NULL REFERENCES public.regulations(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, regulation_id)
);

CREATE TABLE IF NOT EXISTS public.market_data_reports (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    region TEXT,
    segment TEXT,
    year INTEGER,
    value DECIMAL,
    cagr DECIMAL,
    source_url TEXT,
    summary TEXT,
    published_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_institutions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    website TEXT,
    focus_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_entries (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    entry_type TEXT NOT NULL, -- e.g., "Paper", "Patent", "Clinical Trial"
    authors_or_assignees TEXT[],
    publication_or_filing_date DATE,
    abstract_summary TEXT NOT NULL,
    journal_or_office TEXT, -- e.g., "Journal of Industrial Hemp", "USPTO"
    doi_or_patent_number TEXT,
    full_text_url TEXT,
    pdf_url TEXT,
    image_url TEXT,
    keywords TEXT[],
    citations INTEGER,
    research_institution_id INTEGER REFERENCES public.research_institutions(id) ON DELETE SET NULL,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(abstract_summary, '') || ' ' || coalesce(array_to_string(authors_or_assignees, ' '), '') || ' ' || coalesce(array_to_string(keywords, ' '), ''))) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_research_entries_institution_id ON public.research_entries(research_institution_id);
CREATE INDEX IF NOT EXISTS research_entries_search_idx ON public.research_entries USING GIN (search_vector);

CREATE TABLE IF NOT EXISTS public.product_research_entries (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    research_entry_id INTEGER NOT NULL REFERENCES public.research_entries(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, research_entry_id)
);

CREATE TABLE IF NOT EXISTS public.historical_events (
    id SERIAL PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_date DATE, -- Consider TEXT if dates are very fuzzy
    description TEXT,
    significance TEXT,
    related_uses_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Example for User-Specific Data (leveraging Supabase Auth)
-- These would typically be created as needed.
-- CREATE TABLE IF NOT EXISTS public.user_bookmarked_products (
--     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     PRIMARY KEY (user_id, use_product_id)
-- );

-- Enable RLS for tables if you plan to use it (recommended for Supabase)
-- Example:
-- ALTER TABLE public.hemp_plant_archetypes ENABLE ROW LEVEL SECURITY;
-- -- (Apply to other tables as needed)

-- Create policies for RLS
-- Example:
-- CREATE POLICY "Public read access for hemp_plant_archetypes"
-- ON public.hemp_plant_archetypes
-- FOR SELECT USING (true);
-- -- (Define more granular policies based on auth roles and user IDs)

-- Example trigger function for updated_at
-- CREATE OR REPLACE FUNCTION public.handle_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- Example trigger for a table
-- CREATE TRIGGER on_public_hemp_plant_archetypes_updated_at
-- BEFORE UPDATE ON public.hemp_plant_archetypes
-- FOR EACH ROW
-- EXECUTE PROCEDURE public.handle_updated_at();
-- (Repeat for other tables needing auto updated_at)