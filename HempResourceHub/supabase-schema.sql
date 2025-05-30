-- Hemp Database Schema for Supabase

-- Create tables
CREATE TABLE public.plant_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  planting_density TEXT,
  characteristics TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.plant_parts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  plant_type_id INTEGER NOT NULL REFERENCES public.plant_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.sub_industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry_id INTEGER NOT NULL REFERENCES public.industries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.hemp_products (
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

CREATE TABLE public.research_papers (
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

CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for improved performance
CREATE INDEX idx_plant_parts_plant_type_id ON public.plant_parts(plant_type_id);
CREATE INDEX idx_sub_industries_industry_id ON public.sub_industries(industry_id);
CREATE INDEX idx_hemp_products_plant_part_id ON public.hemp_products(plant_part_id);
CREATE INDEX idx_hemp_products_industry_id ON public.hemp_products(industry_id);
CREATE INDEX idx_hemp_products_sub_industry_id ON public.hemp_products(sub_industry_id);
CREATE INDEX idx_research_papers_plant_type_id ON public.research_papers(plant_type_id);
CREATE INDEX idx_research_papers_plant_part_id ON public.research_papers(plant_part_id);
CREATE INDEX idx_research_papers_industry_id ON public.research_papers(industry_id);

-- Enable Row Level Security (RLS) - uncomment this section if needed
-- ALTER TABLE public.plant_types ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.plant_parts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sub_industries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.hemp_products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access - uncomment this section if needed
-- CREATE POLICY "Allow public read access" ON public.plant_types FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON public.plant_parts FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON public.industries FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON public.sub_industries FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON public.hemp_products FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON public.research_papers FOR SELECT USING (true);

-- Sample data for testing - uncomment to add sample data
-- INSERT INTO public.plant_types (name, description) VALUES 
-- ('Fiber Hemp', 'Hemp grown primarily for fiber production with minimal THC content.'),
-- ('Seed Hemp', 'Hemp varieties optimized for seed production.'),
-- ('CBD Hemp', 'Hemp cultivated for high CBD content with low THC.');

-- INSERT INTO public.industries (name, description, icon_name) VALUES 
-- ('Construction', 'Building materials and construction applications', 'building'),
-- ('Textiles', 'Fabric and clothing applications', 'scissors'),
-- ('Food', 'Edible hemp products and ingredients', 'utensils');