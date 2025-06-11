-- Add indexes for better query performance

-- Plant parts indexes
CREATE INDEX IF NOT EXISTS idx_plant_parts_archetype ON plant_parts(archetype_id);
CREATE INDEX IF NOT EXISTS idx_plant_parts_name ON plant_parts(name);

-- Uses products indexes
CREATE INDEX IF NOT EXISTS idx_uses_products_plant_part ON uses_products(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_uses_products_industry ON uses_products(industry_id);
CREATE INDEX IF NOT EXISTS idx_uses_products_sub_industry ON uses_products(sub_industry_id);
CREATE INDEX IF NOT EXISTS idx_uses_products_name ON uses_products(name);
CREATE INDEX IF NOT EXISTS idx_uses_products_sustainability ON uses_products(sustainability_score);

-- Industry sub categories indexes
CREATE INDEX IF NOT EXISTS idx_industry_sub_categories_industry ON industry_sub_categories(industry_id);

-- Research entries indexes (if table exists)
CREATE INDEX IF NOT EXISTS idx_research_entries_archetype ON research_entries(archetype_id);
CREATE INDEX IF NOT EXISTS idx_research_entries_plant_part ON research_entries(plant_part_id);
CREATE INDEX IF NOT EXISTS idx_research_entries_industry ON research_entries(industry_id);

-- Full text search indexes (GIN indexes for better text search)
CREATE INDEX IF NOT EXISTS idx_uses_products_search ON uses_products USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_uses_products_name_trgm ON uses_products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_uses_products_description_trgm ON uses_products USING gin(description gin_trgm_ops);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_uses_products_industry_sustainability ON uses_products(industry_id, sustainability_score DESC);
CREATE INDEX IF NOT EXISTS idx_uses_products_plant_part_name ON uses_products(plant_part_id, name);