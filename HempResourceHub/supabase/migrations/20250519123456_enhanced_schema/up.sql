-- Enhanced Hemp Database Schema with Full-Text Search 
-- Combines schemas from Replit-UI and AiHQzMCP with additional features

-- Create base tables (keep the structure from Replit-UI)
CREATE TABLE IF NOT EXISTS public.plant_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  planting_density TEXT,
  characteristics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plant_parts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  plant_type_id INTEGER NOT NULL REFERENCES public.plant_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sub_industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry_id INTEGER NOT NULL REFERENCES public.industries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hemp_products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  plant_part_id INTEGER NOT NULL REFERENCES public.plant_parts(id),
  industry_id INTEGER NOT NULL REFERENCES public.industries(id),
  sub_industry_id INTEGER REFERENCES public.sub_industries(id),
  properties JSONB,
  facts JSONB,
  sustainability_impact TEXT,
  affiliate_links JSONB,
  related_product_ids JSONB,
  -- Add array fields from AiHQzMCP schema
  benefits TEXT[],
  uses TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  -- Change authors to TEXT array (from AiHQzMCP)
  authors TEXT[],
  abstract TEXT NOT NULL,
  publication_date DATE,
  journal TEXT,
  doi TEXT,
  url TEXT,
  pdf_url TEXT,
  image_url TEXT,
  plant_type_id INTEGER REFERENCES public.plant_types(id),
  plant_part_id INTEGER REFERENCES public.plant_parts(id),
  industry_id INTEGER REFERENCES public.industries(id),
  keywords TEXT[],
  citations INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_plant_parts_plant_type_id ON public.plant_parts(plant_type_id);
CREATE INDEX IF NOT EXISTS idx_sub_industries_industry_id ON public.sub_industries(industry_id);
CREATE INDEX IF NOT EXISTS idx_hemp_products_plant_part_id ON public.hemp_products(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_hemp_products_industry_id ON public.hemp_products(industry_id);
CREATE INDEX IF NOT EXISTS idx_hemp_products_sub_industry_id ON public.hemp_products(sub_industry_id);
CREATE INDEX IF NOT EXISTS idx_research_papers_plant_type_id ON public.research_papers(plant_type_id);
CREATE INDEX IF NOT EXISTS idx_research_papers_plant_part_id ON public.research_papers(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_research_papers_industry_id ON public.research_papers(industry_id);

-- Add full text search capabilities from AiHQzMCP
-- Hemp products search vector
ALTER TABLE public.hemp_products ADD COLUMN IF NOT EXISTS search_vector tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))) STORED;

CREATE INDEX IF NOT EXISTS hemp_products_search_idx ON public.hemp_products USING GIN (search_vector);

-- Research papers search vector
ALTER TABLE public.research_papers ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(abstract, '') || ' ' || 
    coalesce(array_to_string(authors, ' '), '') || ' ' ||
    coalesce(array_to_string(keywords, ' '), '')
  )) STORED;

CREATE INDEX IF NOT EXISTS research_papers_search_idx ON public.research_papers USING GIN (search_vector);