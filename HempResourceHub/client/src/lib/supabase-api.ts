import supabase from './supabase-client';
import type { PlantType, PlantPart, Industry, SubIndustry, HempProduct, ResearchPaper, PaginatedResponse } from '../types/schema';

// Plant Types API
export async function getAllPlantTypes(): Promise<PlantType[]> {
  const { data, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getPlantType(id: number): Promise<PlantType | null> {
  const { data, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function createPlantType(plantType: Omit<PlantType, 'id' | 'created_at'>): Promise<PlantType> {
  const { data, error } = await supabase
    .from('hemp_plant_archetypes')
    .insert(plantType)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Plant Parts API
export async function getAllPlantParts(): Promise<PlantPart[]> {
  const { data, error } = await supabase
    .from('plant_parts')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getPlantPartsByType(plantTypeId: number): Promise<PlantPart[]> {
  const { data, error } = await supabase
    .from('plant_parts')
    .select('*')
    .eq('plant_type_id', plantTypeId)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getPlantPart(id: number): Promise<PlantPart | null> {
  const { data, error } = await supabase
    .from('plant_parts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function createPlantPart(plantPart: Omit<PlantPart, 'id' | 'created_at'>): Promise<PlantPart> {
  const { data, error } = await supabase
    .from('plant_parts')
    .insert(plantPart)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Industries API
export async function getAllIndustries(): Promise<Industry[]> {
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getIndustry(id: number): Promise<Industry | null> {
  const { data, error } = await supabase
    .from('industries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function createIndustry(industry: Omit<Industry, 'id' | 'created_at'>): Promise<Industry> {
  const { data, error } = await supabase
    .from('industries')
    .insert(industry)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Sub Industries API
export async function getSubIndustriesByIndustry(industryId: number): Promise<SubIndustry[]> {
  const { data, error } = await supabase
    .from('industry_sub_categories')
    .select('*')
    .eq('industry_id', industryId)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

// Hemp Products API
export async function getAllHempProducts(): Promise<HempProduct[]> {
  const { data, error } = await supabase
    .from('uses_products')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function getHempProduct(id: number): Promise<HempProduct | null> {
  const { data, error } = await supabase
    .from('uses_products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function getHempProductsByPart(
  plantPartId: number, 
  industryId?: number, 
  page: number = 1, 
  limit: number = 10
): Promise<PaginatedResponse<HempProduct>> {
  let query = supabase
    .from('uses_products')
    .select('*', { count: 'exact' })
    .eq('plant_part_id', plantPartId);
  
  if (industryId) {
    query = query.eq('industry_sub_category_id', industryId);
  }
  
  const { data, error, count } = await query
    .order('name')
    .range((page - 1) * limit, page * limit - 1);
  
  if (error) throw error;
  
  return {
    data: data || [],
    total: count || 0
  };
}

export async function getHempProductsByIndustry(industryId: number): Promise<HempProduct[]> {
  const { data, error } = await supabase
    .from('uses_products')
    .select('*')
    .eq('industry_sub_category_id', industryId)
    .order('name');
  
  if (error) throw error;
  return data || [];
}

// Enhanced search using full-text search capabilities
export async function searchHempProducts(query: string): Promise<HempProduct[]> {
  // Use the full-text search if the search_vector column exists
  try {
    const { data, error } = await supabase
      .from('uses_products')
      .select('*')
      .textSearch('search_vector', query)
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    // Fallback to ilike search if full-text search fails
    console.warn('Falling back to ILIKE search for hemp products', e);
    const { data, error } = await supabase
      .from('uses_products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
}

export async function createHempProduct(product: Omit<HempProduct, 'id' | 'created_at'>): Promise<HempProduct> {
  const { data, error } = await supabase
    .from('uses_products')
    .insert(product)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Research Papers API
export async function getAllResearchPapers(): Promise<ResearchPaper[]> {
  const { data, error } = await supabase
    .from('research_entries')
    .select('*')
    .order('title');
  
  if (error) throw error;
  return data || [];
}

export async function getResearchPaper(id: number): Promise<ResearchPaper | null> {
  const { data, error } = await supabase
    .from('research_entries')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw error;
  }
  return data;
}

export async function getResearchPapersByPlantType(plantTypeId: number): Promise<ResearchPaper[]> {
  const { data, error } = await supabase
    .from('research_entries')
    .select('*')
    .eq('plant_type_id', plantTypeId)
    .order('title');
  
  if (error) throw error;
  return data || [];
}

export async function getResearchPapersByPlantPart(plantPartId: number): Promise<ResearchPaper[]> {
  const { data, error } = await supabase
    .from('research_entries')
    .select('*')
    .eq('plant_part_id', plantPartId)
    .order('title');
  
  if (error) throw error;
  return data || [];
}

export async function getResearchPapersByIndustry(industryId: number): Promise<ResearchPaper[]> {
  const { data, error } = await supabase
    .from('research_entries')
    .select('*')
    .eq('industry_id', industryId)
    .order('title');
  
  if (error) throw error;
  return data || [];
}

// Enhanced search for research papers using full-text search
export async function searchResearchPapers(query: string): Promise<ResearchPaper[]> {
  // Use full-text search if search_vector column exists
  try {
    const { data, error } = await supabase
      .from('research_entries')
      .select('*')
      .textSearch('search_vector', query)
      .order('title');
    
    if (error) throw error;
    return data || [];
  } catch (e) {
    // Fallback to ilike search if full-text search fails
    console.warn('Falling back to ILIKE search for research papers', e);
    const { data, error } = await supabase
      .from('research_entries')
      .select('*')
      .or(`title.ilike.%${query}%,abstract_summary.ilike.%${query}%`)
      .order('title');
    
    if (error) throw error;
    return data || [];
  }
}

export async function createResearchPaper(paper: Omit<ResearchPaper, 'id' | 'created_at' | 'updated_at'>): Promise<ResearchPaper> {
  const { data, error } = await supabase
    .from('research_entries')
    .insert(paper)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Statistics API
export async function getStats() {
  const plantTypesPromise = supabase
    .from('hemp_plant_archetypes')
    .select('*', { count: 'exact', head: true });

  const plantPartsPromise = supabase
    .from('plant_parts')
    .select('*', { count: 'exact', head: true });

  const industriesPromise = supabase
    .from('industries')
    .select('*', { count: 'exact', head: true });

  const productsPromise = supabase
    .from('uses_products')
    .select('*', { count: 'exact', head: true });

  const researchPromise = supabase
    .from('research_entries')
    .select('*', { count: 'exact', head: true });

  const [
    plantTypesResult,
    plantPartsResult,
    industriesResult,
    productsResult,
    researchResult
  ] = await Promise.all([
    plantTypesPromise,
    plantPartsPromise,
    industriesPromise,
    productsPromise,
    researchPromise
  ]);

  // Handle potential errors
  const errors = [];
  if (plantTypesResult.error) errors.push(plantTypesResult.error);
  if (plantPartsResult.error) errors.push(plantPartsResult.error);
  if (industriesResult.error) errors.push(industriesResult.error);
  if (productsResult.error) errors.push(productsResult.error);
  if (researchResult.error) errors.push(researchResult.error);

  if (errors.length > 0) {
    console.error('Error fetching stats:', errors);
    throw new Error('Failed to fetch statistics');
  }

  return {
    plantTypes: plantTypesResult.count || 0,
    plantParts: plantPartsResult.count || 0,
    industries: industriesResult.count || 0,
    products: productsResult.count || 0,
    research: researchResult.count || 0
  };
}