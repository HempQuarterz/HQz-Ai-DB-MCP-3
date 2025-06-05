import supabase from './supabase';
import type { 
  PlantType, 
  PlantPart, 
  Industry, 
  SubIndustry, 
  HempProduct, 
  ResearchPaper 
} from '@shared/schema';

// Plant Types
export const getPlantTypes = async (): Promise<PlantType[]> => {
  const { data, error } = await supabase.from('plant_types').select('*');
  if (error) throw error;
  return data || [];
};

export const getPlantType = async (id: number): Promise<PlantType | null> => {
  const { data, error } = await supabase.from('plant_types').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createPlantType = async (plantType: Omit<PlantType, 'id' | 'createdAt'>): Promise<PlantType> => {
  const { data, error } = await supabase.from('plant_types').insert([plantType]).select().single();
  if (error) throw error;
  return data;
};

// Plant Parts
export const getPlantParts = async (): Promise<PlantPart[]> => {
  const { data, error } = await supabase.from('plant_parts').select('*');
  if (error) throw error;
  return data || [];
};

export const getPlantPartsByType = async (plantTypeId: number): Promise<PlantPart[]> => {
  const { data, error } = await supabase.from('plant_parts').select('*').eq('plant_type_id', plantTypeId);
  if (error) throw error;
  return data || [];
};

export const getPlantPart = async (id: number): Promise<PlantPart | null> => {
  const { data, error } = await supabase.from('plant_parts').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createPlantPart = async (plantPart: Omit<PlantPart, 'id' | 'createdAt'>): Promise<PlantPart> => {
  const { data, error } = await supabase.from('plant_parts').insert([plantPart]).select().single();
  if (error) throw error;
  return data;
};

// Industries
export const getIndustries = async (): Promise<Industry[]> => {
  const { data, error } = await supabase.from('industries').select('*');
  if (error) throw error;
  return data || [];
};

export const getIndustry = async (id: number): Promise<Industry | null> => {
  const { data, error } = await supabase.from('industries').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createIndustry = async (industry: Omit<Industry, 'id' | 'createdAt'>): Promise<Industry> => {
  const { data, error } = await supabase.from('industries').insert([industry]).select().single();
  if (error) throw error;
  return data;
};

// Sub Industries
export const getSubIndustries = async (): Promise<SubIndustry[]> => {
  const { data, error } = await supabase.from('sub_industries').select('*');
  if (error) throw error;
  return data || [];
};

export const getSubIndustriesByIndustry = async (industryId: number): Promise<SubIndustry[]> => {
  const { data, error } = await supabase.from('sub_industries').select('*').eq('industry_id', industryId);
  if (error) throw error;
  return data || [];
};

export const getSubIndustry = async (id: number): Promise<SubIndustry | null> => {
  const { data, error } = await supabase.from('sub_industries').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createSubIndustry = async (subIndustry: Omit<SubIndustry, 'id' | 'createdAt'>): Promise<SubIndustry> => {
  const { data, error } = await supabase.from('sub_industries').insert([subIndustry]).select().single();
  if (error) throw error;
  return data;
};

// Hemp Products
export const getHempProducts = async (): Promise<HempProduct[]> => {
  const { data, error } = await supabase.from('hemp_products').select('*');
  if (error) throw error;
  return data || [];
};

export const getHempProductsByPart = async (plantPartId: number): Promise<HempProduct[]> => {
  const { data, error } = await supabase.from('hemp_products').select('*').eq('plant_part_id', plantPartId);
  if (error) throw error;
  return data || [];
};

export const getHempProductsByIndustry = async (industryId: number): Promise<HempProduct[]> => {
  const { data, error } = await supabase.from('hemp_products').select('*').eq('industry_id', industryId);
  if (error) throw error;
  return data || [];
};

export const getHempProduct = async (id: number): Promise<HempProduct | null> => {
  const { data, error } = await supabase.from('hemp_products').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const createHempProduct = async (product: Omit<HempProduct, 'id' | 'createdAt'>): Promise<HempProduct> => {
  const { data, error } = await supabase.from('hemp_products').insert([product]).select().single();
  if (error) throw error;
  return data;
};

export const searchHempProducts = async (query: string): Promise<HempProduct[]> => {
  const { data, error } = await supabase
    .from('hemp_products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  if (error) throw error;
  return data || [];
};

// Research Papers
export const getResearchPapers = async (): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase.from('research_papers').select('*');
  if (error) throw error;
  return data || [];
};

export const getResearchPaper = async (id: number): Promise<ResearchPaper | null> => {
  const { data, error } = await supabase.from('research_papers').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
};

export const getResearchPapersByPlantType = async (plantTypeId: number): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase.from('research_papers').select('*').eq('plant_type_id', plantTypeId);
  if (error) throw error;
  return data || [];
};

export const getResearchPapersByPlantPart = async (plantPartId: number): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase.from('research_papers').select('*').eq('plant_part_id', plantPartId);
  if (error) throw error;
  return data || [];
};

export const getResearchPapersByIndustry = async (industryId: number): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase.from('research_papers').select('*').eq('industry_id', industryId);
  if (error) throw error;
  return data || [];
};

export const createResearchPaper = async (paper: Omit<ResearchPaper, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchPaper> => {
  const { data, error } = await supabase.from('research_papers').insert([paper]).select().single();
  if (error) throw error;
  return data;
};

export const searchResearchPapers = async (query: string): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase
    .from('research_papers')
    .select('*')
    .or(`title.ilike.%${query}%,abstract.ilike.%${query}%,authors.ilike.%${query}%`);
  if (error) throw error;
  return data || [];
};

// Statistics
export const getStats = async () => {
  const productsCount = await supabase.from('hemp_products').select('*', { count: 'exact', head: true });
  const industriesCount = await supabase.from('industries').select('*', { count: 'exact', head: true });
  const plantTypesCount = await supabase.from('plant_types').select('*', { count: 'exact', head: true });
  
  return {
    totalProducts: productsCount.count || 0,
    totalIndustries: industriesCount.count || 0,
    totalPlantTypes: plantTypesCount.count || 0
  };
};