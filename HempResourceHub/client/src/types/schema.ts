// Database schema type definitions

export type User = {
  id: number;
  username: string;
  password: string;
  created_at: string;
};

export type PlantType = {
  id: number;
  name: string;
  description: string;
  image_url?: string | null;
  planting_density?: string | null;
  characteristics?: string | null;
  created_at: string;
};

export type PlantPart = {
  id: number;
  name: string;
  description: string;
  image_url?: string | null;
  archetype_id: number;
  created_at: string;
};

export type Industry = {
  id: number;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  created_at: string;
};

export type SubIndustry = {
  id: number;
  name: string;
  description?: string | null;
  industry_id: number;
  created_at: string;
};

export type HempProduct = {
  id: number;
  name: string;
  description: string;
  image_url?: string | null;
  plant_part_id: number;
  industry_id: number;
  sub_industry_id?: number | null;
  properties?: Record<string, any> | null;
  facts?: Record<string, any> | null;
  sustainability_impact?: string | null;
  affiliate_links?: Record<string, any> | null;
  related_product_ids?: number[] | null;
  // Added array fields from AiHQzMCP
  benefits?: string[] | null;
  uses?: string[] | null;
  created_at: string;
};

export type ResearchPaper = {
  id: number;
  title: string;
  // Changed from string to string[] to match new schema
  authors: string[];
  abstract: string;
  publication_date?: string | null;
  journal?: string | null;
  doi?: string | null;
  url?: string | null;
  pdf_url?: string | null;
  image_url?: string | null;
  plant_type_id?: number | null;
  plant_part_id?: number | null;
  industry_id?: number | null;
  keywords?: string[] | null;
  citations?: number | null;
  created_at: string;
  updated_at: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
};