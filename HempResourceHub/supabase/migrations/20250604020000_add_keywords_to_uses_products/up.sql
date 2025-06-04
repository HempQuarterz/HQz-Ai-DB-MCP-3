ALTER TABLE public.uses_products
    ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Recreate search_vector to include keywords
DROP INDEX IF EXISTS uses_products_search_idx;
ALTER TABLE public.uses_products DROP COLUMN IF EXISTS search_vector;
ALTER TABLE public.uses_products
    ADD COLUMN search_vector TSVECTOR GENERATED ALWAYS AS (
        to_tsvector('english',
            coalesce(name, '') || ' ' ||
            coalesce(description, '') || ' ' ||
            coalesce(array_to_string(keywords, ' '), '')
        )
    ) STORED;

CREATE INDEX uses_products_search_idx ON public.uses_products USING GIN (search_vector);
