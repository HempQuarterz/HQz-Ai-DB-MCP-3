-- Hemp Database Schema for Supabase (Modified to handle existing tables)

-- Create tables if they don't exist
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

-- Skip creating industries table since it already exists
-- CREATE TABLE IF NOT EXISTS public.industries (
--   id SERIAL PRIMARY KEY,
--   name TEXT NOT NULL UNIQUE,
--   description TEXT,
--   icon_name TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.research_papers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
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

-- Create indexes if they don't exist (these will be skipped if they already exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_plant_parts_plant_type_id') THEN
    CREATE INDEX idx_plant_parts_plant_type_id ON public.plant_parts(plant_type_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_sub_industries_industry_id') THEN
    CREATE INDEX idx_sub_industries_industry_id ON public.sub_industries(industry_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_hemp_products_plant_part_id') THEN
    CREATE INDEX idx_hemp_products_plant_part_id ON public.hemp_products(plant_part_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_hemp_products_industry_id') THEN
    CREATE INDEX idx_hemp_products_industry_id ON public.hemp_products(industry_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_hemp_products_sub_industry_id') THEN
    CREATE INDEX idx_hemp_products_sub_industry_id ON public.hemp_products(sub_industry_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_research_papers_plant_type_id') THEN
    CREATE INDEX idx_research_papers_plant_type_id ON public.research_papers(plant_type_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_research_papers_plant_part_id') THEN
    CREATE INDEX idx_research_papers_plant_part_id ON public.research_papers(plant_part_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_research_papers_industry_id') THEN
    CREATE INDEX idx_research_papers_industry_id ON public.research_papers(industry_id);
  END IF;
END $$;