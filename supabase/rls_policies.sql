-- Enable Row Level Security and Define Policies

-- =============================================
-- Table: public.plant_types
-- =============================================
ALTER TABLE public.plant_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on plant_types"
ON public.plant_types FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access on plant_types"
ON public.plant_types FOR ALL
USING (auth.jwt()->>'user_role' = 'admin')
WITH CHECK (auth.jwt()->>'user_role' = 'admin');

-- =============================================
-- Table: public.hemp_products
-- =============================================
ALTER TABLE public.hemp_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on hemp_products"
ON public.hemp_products FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access on hemp_products"
ON public.hemp_products FOR ALL
USING (auth.jwt()->>'user_role' = 'admin')
WITH CHECK (auth.jwt()->>'user_role' = 'admin');

-- =============================================
-- Table: public.profiles
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = id);

-- Note: For tables not explicitly listed here (e.g., junction tables, other primary entity tables),
-- RLS has not been enabled. They will remain accessible according to standard PostgreSQL permissions
-- until RLS is enabled and policies are defined for them.
-- It's recommended to enable RLS and define policies for all tables that store sensitive or user-specific data.

-- Example for a generic table (if needed for others):
-- ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read access on <table_name>" ON public.<table_name> FOR SELECT USING (true);
-- CREATE POLICY "Allow admin full access on <table_name>" ON public.<table_name> FOR ALL USING (auth.jwt()->>'user_role' = 'admin') WITH CHECK (auth.jwt()->>'user_role' = 'admin');
