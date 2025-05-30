-- Core Tables
CREATE TABLE IF NOT EXISTS public.hemp_plant_archetypes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(2048),
    cultivation_focus_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hemp_plant_archetypes_created_at ON public.hemp_plant_archetypes(created_at);

CREATE TABLE IF NOT EXISTS public.plant_parts (
    id SERIAL PRIMARY KEY,
    plant_type_id INTEGER NOT NULL REFERENCES public.plant_types(id) ON DELETE RESTRICT, -- CRITICAL CHANGE: Added plant_type_id
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(2048),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (plant_type_id, name) -- CRITICAL CHANGE: Updated unique constraint
);
-- CREATE INDEX IF NOT EXISTS idx_plant_parts_archetype_id ON public.plant_parts(archetype_id); -- CRITICAL CHANGE: Removed old index
CREATE INDEX IF NOT EXISTS idx_plant_parts_plant_type_id ON public.plant_parts(plant_type_id); -- CRITICAL CHANGE: Added new FK index
CREATE INDEX IF NOT EXISTS idx_plant_parts_name ON public.plant_parts(name);
CREATE INDEX IF NOT EXISTS idx_plant_parts_created_at ON public.plant_parts(created_at);

-- Placeholder for plant_types table
CREATE TABLE IF NOT EXISTS public.plant_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_plant_types_name ON public.plant_types(name); -- Index already covers uniqueness via UNIQUE constraint
CREATE INDEX IF NOT EXISTS idx_plant_types_created_at ON public.plant_types(created_at);

CREATE TABLE IF NOT EXISTS public.industries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_industries_created_at ON public.industries(created_at);

CREATE TABLE IF NOT EXISTS public.industry_sub_categories (
    id SERIAL PRIMARY KEY,
    industry_id INTEGER NOT NULL REFERENCES public.industries(id) ON DELETE RESTRICT, -- Changed from CASCADE
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (industry_id, name) -- Added unique constraint
);
CREATE INDEX IF NOT EXISTS idx_industry_sub_categories_industry_id ON public.industry_sub_categories(industry_id);
CREATE INDEX IF NOT EXISTS idx_industry_sub_categories_name ON public.industry_sub_categories(name);
CREATE INDEX IF NOT EXISTS idx_industry_sub_categories_created_at ON public.industry_sub_categories(created_at);

-- Table for tags for enhanced AI and searchability
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- Changed from TEXT
    description TEXT,
    category VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags(name); -- Index useful even with UNIQUE for FKs
CREATE INDEX IF NOT EXISTS idx_tags_category ON public.tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_created_at ON public.tags(created_at);

-- Table for citations and sources
CREATE TABLE IF NOT EXISTS public.citations (
    id SERIAL PRIMARY KEY,
    source_type VARCHAR(100) NOT NULL,
    title VARCHAR(1000) NOT NULL, -- Changed from TEXT
    author_creator VARCHAR(500), -- Changed from TEXT
    publisher_source_name VARCHAR(500), -- Changed from TEXT
    publication_date DATE,
    access_retrieval_date DATE,
    url_doi VARCHAR(2048), -- Changed from TEXT
    page_numbers VARCHAR(100),
    edition_version VARCHAR(100),
    abstract_summary_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_citations_source_type ON public.citations(source_type);
CREATE INDEX IF NOT EXISTS idx_citations_title ON public.citations(title);
CREATE INDEX IF NOT EXISTS idx_citations_publication_date ON public.citations(publication_date);
CREATE INDEX IF NOT EXISTS idx_citations_created_at ON public.citations(created_at);

-- TODO: Add keywords field and update search_vector for uses_products
-- PLANNED ADDITION for uses_products table:
-- keywords TEXT[],
-- PLANNED UPDATE for uses_products.search_vector:
-- search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(array_to_string(keywords, ' '), ''))) STORED,
CREATE TABLE IF NOT EXISTS public.uses_products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL, -- Changed from TEXT
    description TEXT NOT NULL,
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE RESTRICT,
    industry_sub_category_id INTEGER REFERENCES public.industry_sub_categories(id) ON DELETE SET NULL,
    benefits_advantages TEXT[],
    commercialization_stage VARCHAR(255), -- Changed from TEXT
    manufacturing_processes_summary TEXT,
    sustainability_aspects TEXT[],
    historical_context_facts TEXT[],
    technical_specifications JSONB,
    miscellaneous_info JSONB,
    search_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_uses_products_plant_part_id ON public.uses_products(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_uses_products_industry_sub_category_id ON public.uses_products(industry_sub_category_id);
CREATE INDEX IF NOT EXISTS uses_products_search_idx ON public.uses_products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_uses_products_name ON public.uses_products(name);
CREATE INDEX IF NOT EXISTS idx_uses_products_created_at ON public.uses_products(created_at);

CREATE TABLE IF NOT EXISTS public.product_images (
    id SERIAL PRIMARY KEY,
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    image_url VARCHAR(2048) NOT NULL, -- Changed from TEXT
    caption VARCHAR(1000), -- Changed from TEXT
    alt_text VARCHAR(1000), -- Changed from TEXT
    is_primary BOOLEAN DEFAULT FALSE,
    "order" INTEGER DEFAULT 0, -- "order" is a keyword, so quoted
    created_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
    -- No updated_at as images are often immutable or replaced
);
CREATE INDEX IF NOT EXISTS idx_product_images_use_product_id ON public.product_images(use_product_id);

CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id SERIAL PRIMARY KEY,
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    vendor_name VARCHAR(255) NOT NULL, -- Changed from TEXT
    product_url VARCHAR(2048) NOT NULL, -- Changed from TEXT
    logo_url VARCHAR(2048), -- Changed from TEXT
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_use_product_id ON public.affiliate_links(use_product_id);

-- Minimal placeholder for hemp_products table to satisfy FK constraint
CREATE TABLE IF NOT EXISTS public.hemp_products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- Changed from TEXT
    description TEXT,
    image_url VARCHAR(2048), -- Added image_url
    industry_id INTEGER REFERENCES public.industries(id) ON DELETE SET NULL, -- Added industry_id
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hemp_products_name ON public.hemp_products(name); -- Index useful even with UNIQUE for FKs
CREATE INDEX IF NOT EXISTS idx_hemp_products_industry_id ON public.hemp_products(industry_id); -- Added index for new FK
CREATE INDEX IF NOT EXISTS idx_hemp_products_created_at ON public.hemp_products(created_at);

-- Satellite/Supporting Tables
CREATE TABLE IF NOT EXISTS public.companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Changed from TEXT
    description TEXT,
    website_url VARCHAR(2048), -- Changed from TEXT
    logo_url VARCHAR(2048), -- Changed from TEXT
    contact_email VARCHAR(320), -- Changed from TEXT
    phone_number VARCHAR(50),
    address_street TEXT,
    address_city VARCHAR(255), -- Changed from TEXT
    address_state_province VARCHAR(255), -- Changed from TEXT
    address_postal_code VARCHAR(20),
    address_country VARCHAR(255), -- Changed from TEXT
    year_founded INTEGER,
    company_type VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on companies.name (as per subtask)
CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_company_type ON public.companies(company_type);
CREATE INDEX IF NOT EXISTS idx_companies_address_city ON public.companies(address_city);
CREATE INDEX IF NOT EXISTS idx_companies_address_country ON public.companies(address_country);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON public.companies(created_at);

CREATE TABLE IF NOT EXISTS public.product_companies (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, company_id)
);
CREATE INDEX IF NOT EXISTS idx_pc_use_product_id ON public.product_companies(use_product_id);
CREATE INDEX IF NOT EXISTS idx_pc_company_id ON public.product_companies(company_id);

-- New company_products table as per subtask
CREATE TABLE IF NOT EXISTS public.company_products (
    company_id INTEGER NOT NULL,
    hemp_product_id INTEGER NOT NULL, -- Assuming hemp_products table exists (e.g., public.hemp_products)
    relationship_type VARCHAR(255),
    PRIMARY KEY (company_id, hemp_product_id),
    CONSTRAINT fk_company
        FOREIGN KEY(company_id)
        REFERENCES public.companies(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_hemp_product
        FOREIGN KEY(hemp_product_id)
        REFERENCES public.hemp_products(id) -- Assuming public.hemp_products table exists
        ON DELETE CASCADE
);

-- Indexes on foreign key columns for company_products (as per subtask)
CREATE INDEX IF NOT EXISTS idx_company_products_company_id ON public.company_products(company_id);
CREATE INDEX IF NOT EXISTS idx_company_products_hemp_product_id ON public.company_products(hemp_product_id);

-- Junction table for hemp_products and plant_parts
CREATE TABLE IF NOT EXISTS public.product_plant_parts (
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE CASCADE,
    PRIMARY KEY (hemp_product_id, plant_part_id)
);
CREATE INDEX IF NOT EXISTS idx_product_plant_parts_hemp_product_id ON public.product_plant_parts(hemp_product_id);
CREATE INDEX IF NOT EXISTS idx_product_plant_parts_plant_part_id ON public.product_plant_parts(plant_part_id);

-- Junction table for hemp_products and industry_sub_categories
CREATE TABLE IF NOT EXISTS public.product_sub_industries (
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    sub_industry_id INTEGER NOT NULL REFERENCES public.industry_sub_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (hemp_product_id, sub_industry_id)
);
CREATE INDEX IF NOT EXISTS idx_psi_hemp_product_id ON public.product_sub_industries(hemp_product_id);
CREATE INDEX IF NOT EXISTS idx_psi_sub_industry_id ON public.product_sub_industries(sub_industry_id);

-- Junction table for hemp_products and uses_products (use_cases)
CREATE TABLE IF NOT EXISTS public.product_use_cases (
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    use_case_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    PRIMARY KEY (hemp_product_id, use_case_id)
);
CREATE INDEX IF NOT EXISTS idx_puc_hemp_product_id ON public.product_use_cases(hemp_product_id);
CREATE INDEX IF NOT EXISTS idx_puc_use_case_id ON public.product_use_cases(use_case_id);

CREATE TABLE IF NOT EXISTS public.regulatory_jurisdictions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Changed from TEXT
    region VARCHAR(255), -- Changed from TEXT
    parent_jurisdiction_id INTEGER REFERENCES public.regulatory_jurisdictions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_regulatory_jurisdictions_parent_id ON public.regulatory_jurisdictions(parent_jurisdiction_id);

CREATE TABLE IF NOT EXISTS public.regulations (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER NOT NULL REFERENCES public.regulatory_jurisdictions(id) ON DELETE CASCADE,
    regulation_title VARCHAR(1000) NOT NULL, -- Changed from TEXT
    summary TEXT,
    full_text_url VARCHAR(2048), -- Changed from TEXT
    effective_date DATE,
    topic VARCHAR(255), -- Changed from TEXT
    last_updated TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    created_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
    -- updated_at is essentially last_updated here
);
CREATE INDEX IF NOT EXISTS idx_regulations_jurisdiction_id ON public.regulations(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_regulations_created_at ON public.regulations(created_at);

CREATE TABLE IF NOT EXISTS public.product_regulations (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    regulation_id INTEGER NOT NULL REFERENCES public.regulations(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, regulation_id)
);
CREATE INDEX IF NOT EXISTS idx_pr_use_product_id ON public.product_regulations(use_product_id);
CREATE INDEX IF NOT EXISTS idx_pr_regulation_id ON public.product_regulations(regulation_id);

CREATE TABLE IF NOT EXISTS public.market_data_reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL, -- Changed from TEXT
    region VARCHAR(255), -- Changed from TEXT
    segment VARCHAR(255), -- Changed from TEXT
    year INTEGER,
    value DECIMAL,
    cagr DECIMAL,
    source_url VARCHAR(2048), -- Changed from TEXT
    summary TEXT,
    published_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_market_data_reports_created_at ON public.market_data_reports(created_at);

CREATE TABLE IF NOT EXISTS public.research_institutions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Changed from TEXT
    location VARCHAR(500), -- Changed from TEXT
    website VARCHAR(2048), -- Changed from TEXT
    focus_areas TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_research_institutions_created_at ON public.research_institutions(created_at);

-- Renamed and updated from research_entries
CREATE TABLE IF NOT EXISTS public.research_papers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(1000) NOT NULL, -- Changed from TEXT
    authors VARCHAR(1000), -- Changed from TEXT
    publication_date DATE,
    abstract TEXT NOT NULL,
    doi VARCHAR(255) UNIQUE,
    url VARCHAR(2048), -- Changed from TEXT
    keywords VARCHAR(1000), -- Changed from TEXT
    -- Retaining other useful columns from research_entries not explicitly forbidden:
    entry_type VARCHAR(100), -- Changed from TEXT
    journal_or_office VARCHAR(255), -- Changed from TEXT
    pdf_url VARCHAR(2048), -- Changed from TEXT
    image_url VARCHAR(2048), -- Changed from TEXT
    citations INTEGER,
    research_institution_id INTEGER REFERENCES public.research_institutions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Renamed index and new indexes for research_papers
CREATE INDEX IF NOT EXISTS idx_research_papers_institution_id ON public.research_papers(research_institution_id);
CREATE INDEX IF NOT EXISTS idx_research_papers_title ON public.research_papers(title);
CREATE INDEX IF NOT EXISTS idx_research_papers_doi ON public.research_papers(doi);
CREATE INDEX IF NOT EXISTS idx_research_papers_publication_date ON public.research_papers(publication_date);
CREATE INDEX IF NOT EXISTS idx_research_papers_created_at ON public.research_papers(created_at);
-- Old research_entries_search_idx (GIN on search_vector) is removed.

-- Junction table product_research_entries needs to be updated to product_research_papers
CREATE TABLE IF NOT EXISTS public.product_research_papers (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, research_paper_id)
);
CREATE INDEX IF NOT EXISTS idx_prp_use_product_id ON public.product_research_papers(use_product_id);
CREATE INDEX IF NOT EXISTS idx_prp_research_paper_id ON public.product_research_papers(research_paper_id);

-- Junction table for research_papers and plant_types
CREATE TABLE IF NOT EXISTS public.research_paper_plant_types (
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    plant_type_id INTEGER NOT NULL REFERENCES public.plant_types(id) ON DELETE CASCADE,
    PRIMARY KEY (research_paper_id, plant_type_id)
);
CREATE INDEX IF NOT EXISTS idx_rp_plant_types_paper_id ON public.research_paper_plant_types(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_rp_plant_types_plant_type_id ON public.research_paper_plant_types(plant_type_id);

-- Junction table for research_papers and plant_parts
CREATE TABLE IF NOT EXISTS public.research_paper_plant_parts (
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE CASCADE,
    PRIMARY KEY (research_paper_id, plant_part_id)
);
CREATE INDEX IF NOT EXISTS idx_rp_plant_parts_paper_id ON public.research_paper_plant_parts(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_rp_plant_parts_plant_part_id ON public.research_paper_plant_parts(plant_part_id);

-- Junction table for research_papers and industries
CREATE TABLE IF NOT EXISTS public.research_paper_industries (
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    industry_id INTEGER NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    PRIMARY KEY (research_paper_id, industry_id)
);
CREATE INDEX IF NOT EXISTS idx_rp_industries_paper_id ON public.research_paper_industries(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_rp_industries_industry_id ON public.research_paper_industries(industry_id);

-- Junction table for research_papers and hemp_products
CREATE TABLE IF NOT EXISTS public.research_paper_products (
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    PRIMARY KEY (research_paper_id, hemp_product_id)
);
CREATE INDEX IF NOT EXISTS idx_rp_products_paper_id ON public.research_paper_products(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_rp_products_hemp_product_id ON public.research_paper_products(hemp_product_id);

CREATE TABLE IF NOT EXISTS public.historical_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(500) NOT NULL, -- Changed from TEXT
    event_date DATE,
    description TEXT,
    significance TEXT,
    related_uses_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(), -- Changed from TIMESTAMP WITH TIME ZONE
    updated_at TIMESTAMPTZ DEFAULT NOW() -- Changed from TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_historical_events_created_at ON public.historical_events(created_at);

-- TAGGING JUNCTION TABLES --

-- Junction table for hemp_products and tags
CREATE TABLE IF NOT EXISTS public.product_tags (
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (hemp_product_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_product_tags_hemp_product_id ON public.product_tags(hemp_product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_tag_id ON public.product_tags(tag_id);

-- Junction table for plant_parts and tags
CREATE TABLE IF NOT EXISTS public.plant_part_tags (
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (plant_part_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_plant_part_tags_plant_part_id ON public.plant_part_tags(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_plant_part_tags_tag_id ON public.plant_part_tags(tag_id);

-- Junction table for companies and tags
CREATE TABLE IF NOT EXISTS public.company_tags (
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_company_tags_company_id ON public.company_tags(company_id);
CREATE INDEX IF NOT EXISTS idx_company_tags_tag_id ON public.company_tags(tag_id);

-- Junction table for research_papers and tags
CREATE TABLE IF NOT EXISTS public.research_paper_tags (
    research_paper_id INTEGER NOT NULL REFERENCES public.research_papers(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (research_paper_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_research_paper_tags_research_paper_id ON public.research_paper_tags(research_paper_id);
CREATE INDEX IF NOT EXISTS idx_research_paper_tags_tag_id ON public.research_paper_tags(tag_id);

-- Junction table for uses_products (use_cases) and tags
CREATE TABLE IF NOT EXISTS public.use_product_tags (
    use_product_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE, -- Changed from use_case_id, references uses_products.id (BIGINT)
    tag_id INTEGER NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (use_product_id, tag_id)
);
CREATE INDEX IF NOT EXISTS idx_use_product_tags_use_product_id ON public.use_product_tags(use_product_id);
CREATE INDEX IF NOT EXISTS idx_use_product_tags_tag_id ON public.use_product_tags(tag_id);

-- CITATION JUNCTION TABLES --

-- Junction table for hemp_products and citations
CREATE TABLE IF NOT EXISTS public.product_citations (
    hemp_product_id INTEGER NOT NULL REFERENCES public.hemp_products(id) ON DELETE CASCADE,
    citation_id INTEGER NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
    PRIMARY KEY (hemp_product_id, citation_id)
);
CREATE INDEX IF NOT EXISTS idx_product_citations_hemp_product_id ON public.product_citations(hemp_product_id);
CREATE INDEX IF NOT EXISTS idx_product_citations_citation_id ON public.product_citations(citation_id);

-- Junction table for plant_parts and citations
CREATE TABLE IF NOT EXISTS public.plant_part_citations (
    plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id) ON DELETE CASCADE,
    citation_id INTEGER NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
    PRIMARY KEY (plant_part_id, citation_id)
);
CREATE INDEX IF NOT EXISTS idx_plant_part_citations_plant_part_id ON public.plant_part_citations(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_plant_part_citations_citation_id ON public.plant_part_citations(citation_id);

-- Junction table for companies and citations
CREATE TABLE IF NOT EXISTS public.company_citations (
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    citation_id INTEGER NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
    PRIMARY KEY (company_id, citation_id)
);
CREATE INDEX IF NOT EXISTS idx_company_citations_company_id ON public.company_citations(company_id);
CREATE INDEX IF NOT EXISTS idx_company_citations_citation_id ON public.company_citations(citation_id);

-- Junction table for uses_products (use_cases) and citations
CREATE TABLE IF NOT EXISTS public.use_case_citations (
    use_case_id BIGINT NOT NULL REFERENCES public.uses_products(id) ON DELETE CASCADE,
    citation_id INTEGER NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
    PRIMARY KEY (use_case_id, citation_id)
);
CREATE INDEX IF NOT EXISTS idx_use_case_citations_use_case_id ON public.use_case_citations(use_case_id);
CREATE INDEX IF NOT EXISTS idx_use_case_citations_citation_id ON public.use_case_citations(citation_id);

-- Junction table for industries and citations
CREATE TABLE IF NOT EXISTS public.industry_citations (
    industry_id INTEGER NOT NULL REFERENCES public.industries(id) ON DELETE CASCADE,
    citation_id INTEGER NOT NULL REFERENCES public.citations(id) ON DELETE CASCADE,
    PRIMARY KEY (industry_id, citation_id)
);
CREATE INDEX IF NOT EXISTS idx_industry_citations_industry_id ON public.industry_citations(industry_id);
CREATE INDEX IF NOT EXISTS idx_industry_citations_citation_id ON public.industry_citations(citation_id);

-- Profiles table linked to Supabase auth.users
-- Stores public user data and any additional profile-specific fields.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username VARCHAR(255) UNIQUE, -- For a unique, user-chosen username if desired
  -- Add any other profile-specific fields you might envision here in the future
  -- e.g., avatar_url TEXT, bio TEXT
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- It's good practice to ensure the updated_at column is automatically updated.
-- This can be done with a trigger function if not handled at the application level.
-- Example trigger (can be uncommented and adapted if needed):
-- CREATE OR REPLACE FUNCTION public.handle_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = NOW();
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER on_public_profiles_updated_at
-- BEFORE UPDATE ON public.profiles
-- FOR EACH ROW
-- EXECUTE PROCEDURE public.handle_updated_at();

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