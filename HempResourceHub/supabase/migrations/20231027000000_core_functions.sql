-- Function to retrieve plant parts associated with a specific plant type.
-- Parameters:
--   p_plant_type_id: The ID of the plant type (references public.plant_types.id)
-- Returns:
--   A table containing id, name, description, and image_url of the matching plant parts.

CREATE OR REPLACE FUNCTION public.get_plant_parts_by_plant_type(p_plant_type_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    pp.id,
    pp.name,
    pp.description,
    pp.image_url
FROM
    public.plant_parts pp
WHERE
    pp.plant_type_id = p_plant_type_id;
$$;

-- Function to retrieve hemp products associated with a specific plant part.
-- Parameters:
--   p_plant_part_id: The ID of the plant part (references public.plant_parts.id)
-- Returns:
--   A table containing id, name, description, and image_url of the matching hemp products.

CREATE OR REPLACE FUNCTION public.get_products_by_plant_part(p_plant_part_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    hp.id,
    hp.name,
    hp.description,
    hp.image_url
FROM
    public.hemp_products hp
JOIN
    public.product_plant_parts ppp ON hp.id = ppp.hemp_product_id
WHERE
    ppp.plant_part_id = p_plant_part_id;
$$;

-- Function to retrieve hemp products by industry and optionally by sub-industry.
-- Parameters:
--   p_industry_id: The ID of the industry (references public.industries.id).
--   p_sub_industry_id: Optional. The ID of the sub-industry (references public.industry_sub_categories.id).
-- Returns:
--   A table containing id, name, description, and image_url of the matching hemp products.

CREATE OR REPLACE FUNCTION public.get_products_by_industry(
    p_industry_id INTEGER,
    p_sub_industry_id INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    hp.id,
    hp.name,
    hp.description,
    hp.image_url
FROM
    public.hemp_products hp
WHERE
    hp.industry_id = p_industry_id
AND (
    p_sub_industry_id IS NULL OR
    hp.id IN (
        SELECT psi.hemp_product_id
        FROM public.product_sub_industries psi
        WHERE psi.sub_industry_id = p_sub_industry_id
    )
);
$$;

-- Function to retrieve companies associated with a specific hemp product.
-- Parameters:
--   p_product_id: The ID of the hemp product (references public.hemp_products.id).
-- Returns:
--   A table containing id, name, website_url, logo_url, and company_type of the matching companies.

CREATE OR REPLACE FUNCTION public.get_companies_by_product(p_product_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    website_url VARCHAR(2048),
    logo_url VARCHAR(2048),
    company_type VARCHAR(255)
)
LANGUAGE sql STABLE
AS $$
SELECT
    c.id,
    c.name,
    c.website_url,
    c.logo_url,
    c.company_type
FROM
    public.companies c
JOIN
    public.company_products cp ON c.id = cp.company_id
WHERE
    cp.hemp_product_id = p_product_id;
$$;

-- Function to retrieve research papers associated with a specific hemp product.
-- Parameters:
--   p_product_id: The ID of the hemp product (references public.hemp_products.id).
-- Returns:
--   A table containing id, title, authors, publication_date, abstract, doi, and url of the matching research papers.

CREATE OR REPLACE FUNCTION public.get_research_by_product(p_product_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(1000),
    authors VARCHAR(1000),
    publication_date DATE,
    abstract TEXT,
    doi VARCHAR(255),
    url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    rp.id,
    rp.title,
    rp.authors,
    rp.publication_date,
    rp.abstract,
    rp.doi,
    rp.url
FROM
    public.research_papers rp
JOIN
    public.research_paper_products rpp ON rp.id = rpp.research_paper_id
WHERE
    rpp.hemp_product_id = p_product_id;
$$;

-- Function to retrieve research papers associated with a specific plant part.
-- Parameters:
--   p_plant_part_id: The ID of the plant part (references public.plant_parts.id).
-- Returns:
--   A table containing id, title, authors, publication_date, abstract, doi, and url of the matching research papers.

CREATE OR REPLACE FUNCTION public.get_research_by_plant_part(p_plant_part_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(1000),
    authors VARCHAR(1000),
    publication_date DATE,
    abstract TEXT,
    doi VARCHAR(255),
    url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    rp.id,
    rp.title,
    rp.authors,
    rp.publication_date,
    rp.abstract,
    rp.doi,
    rp.url
FROM
    public.research_papers rp
JOIN
    public.research_paper_plant_parts rppp ON rp.id = rppp.research_paper_id
WHERE
    rppp.plant_part_id = p_plant_part_id;
$$;

-- Function to retrieve research papers associated with a specific plant type.
-- Parameters:
--   p_plant_type_id: The ID of the plant type (references public.plant_types.id).
-- Returns:
--   A table containing id, title, authors, publication_date, abstract, doi, and url of the matching research papers.

CREATE OR REPLACE FUNCTION public.get_research_by_plant_type(p_plant_type_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(1000),
    authors VARCHAR(1000),
    publication_date DATE,
    abstract TEXT,
    doi VARCHAR(255),
    url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    rp.id,
    rp.title,
    rp.authors,
    rp.publication_date,
    rp.abstract,
    rp.doi,
    rp.url
FROM
    public.research_papers rp
JOIN
    public.research_paper_plant_types rppt ON rp.id = rppt.research_paper_id
WHERE
    rppt.plant_type_id = p_plant_type_id;
$$;

-- Function to retrieve research papers associated with a specific industry.
-- Parameters:
--   p_industry_id: The ID of the industry (references public.industries.id).
-- Returns:
--   A table containing id, title, authors, publication_date, abstract, doi, and url of the matching research papers.

CREATE OR REPLACE FUNCTION public.get_research_by_industry(p_industry_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    title VARCHAR(1000),
    authors VARCHAR(1000),
    publication_date DATE,
    abstract TEXT,
    doi VARCHAR(255),
    url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    rp.id,
    rp.title,
    rp.authors,
    rp.publication_date,
    rp.abstract,
    rp.doi,
    rp.url
FROM
    public.research_papers rp
JOIN
    public.research_paper_industries rpi ON rp.id = rpi.research_paper_id
WHERE
    rpi.industry_id = p_industry_id;
$$;

-- Function to retrieve hemp products associated with a specific use case (from uses_products table).
-- Parameters:
--   p_use_case_id: The ID of the use case (references public.uses_products.id).
-- Returns:
--   A table containing id, name, description, and image_url of the matching hemp products.

CREATE OR REPLACE FUNCTION public.get_products_by_use_case(p_use_case_id BIGINT)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(2048)
)
LANGUAGE sql STABLE
AS $$
SELECT
    hp.id,
    hp.name,
    hp.description,
    hp.image_url
FROM
    public.hemp_products hp
JOIN
    public.product_use_cases puc ON hp.id = puc.hemp_product_id
WHERE
    puc.use_case_id = p_use_case_id;
$$;

-- Function to retrieve use cases (from uses_products table) associated with a specific hemp product.
-- Parameters:
--   p_product_id: The ID of the hemp product (references public.hemp_products.id).
-- Returns:
--   A table containing id, name, and description of the matching use cases.

CREATE OR REPLACE FUNCTION public.get_use_cases_by_product(p_product_id INTEGER)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR(500),
    description TEXT
)
LANGUAGE sql STABLE
AS $$
SELECT
    up.id,
    up.name,
    up.description
FROM
    public.uses_products up
JOIN
    public.product_use_cases puc ON up.id = puc.use_case_id
WHERE
    puc.hemp_product_id = p_product_id;
$$;

-- Function to retrieve use cases (from uses_products table) associated with a specific plant part.
-- This involves finding products linked to the plant part, then use cases linked to those products.
-- Parameters:
--   p_plant_part_id: The ID of the plant part (references public.plant_parts.id).
-- Returns:
--   A table containing id, name, and description of the distinct matching use cases.

CREATE OR REPLACE FUNCTION public.get_use_cases_by_plant_part(p_plant_part_id INTEGER)
RETURNS TABLE (
    id BIGINT,
    name VARCHAR(500),
    description TEXT
)
LANGUAGE sql STABLE
AS $$
SELECT DISTINCT
    up.id,
    up.name,
    up.description
FROM
    public.uses_products up
JOIN
    public.product_use_cases puc ON up.id = puc.use_case_id
WHERE
    puc.hemp_product_id IN (
        SELECT ppp.hemp_product_id
        FROM public.product_plant_parts ppp
        WHERE ppp.plant_part_id = p_plant_part_id
    );
$$;
