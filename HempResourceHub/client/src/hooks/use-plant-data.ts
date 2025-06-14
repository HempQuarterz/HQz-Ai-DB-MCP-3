import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client"; // Supabase is the backend for this project

// Function to fetch plant types from Supabase
async function fetchPlantTypes() {
  console.log('Fetching plant types from Supabase...');
  
  const { data, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('*');

  console.log('Plant types response:', { data, error });

  if (error) {
    console.error('Error fetching plant types:', error);
    throw new Error(error.message);
  }
  
  // Map snake_case fields to camelCase for frontend compatibility
  const result = Array.isArray(data)
    ? data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.image_url,
        plantingDensity: item.planting_density,
        characteristics: item.characteristics,
        createdAt: item.created_at,
      }))
    : [];
    
  console.log('Mapped plant types:', result);
  return result;
}

export function usePlantTypes() {
  return useQuery({
    queryKey: ['plant_types_v2'], // Changed key to force cache miss
    queryFn: fetchPlantTypes,
    staleTime: 0, // TEMPORARY: Force fresh data
  });
}

export function usePlantType(id: number | null) {
  return useQuery({
    queryKey: ['plant_type', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('hemp_plant_archetypes')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching plant type:', error);
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantParts(plantTypeId: number | null) {
  return useQuery({
    queryKey: ['plant_parts', plantTypeId],
    enabled: !!plantTypeId,
    queryFn: async () => {
      if (!plantTypeId) return [];
      const { data, error } = await supabase
        .from('plant_parts')
        .select('*')
        .eq('archetype_id', plantTypeId);
      if (error) {
        console.error('Error fetching plant parts:', error);
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllPlantParts() {
  return useQuery({
    queryKey: ['all_plant_parts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plant_parts')
        .select('*')
        .order('name');
      if (error) {
        console.error('Error fetching all plant parts:', error);
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantPart(id: number | null) {
  return useQuery({
    queryKey: ['plant_part', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('plant_parts')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching plant part:', error);
        throw new Error(error.message);
      }
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIndustries() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .order('name');
      if (error) {
        console.error('Error fetching industries:', error);
        throw new Error(error.message);
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      console.log('Fetching stats...');
      
      // Count total products
      const { count: totalProducts, error: productsError } = await supabase
        .from('uses_products')
        .select('*', { count: 'exact', head: true });
      
      console.log('Products count:', { totalProducts, productsError });
      
      if (productsError) {
        console.error('Error counting products:', productsError);
        throw new Error(productsError.message);
      }
      
      // Count industries
      const { count: totalIndustries, error: industriesError } = await supabase
        .from('industries')
        .select('*', { count: 'exact', head: true });
        
      console.log('Industries count:', { totalIndustries, industriesError });
        
      if (industriesError) {
        console.error('Error counting industries:', industriesError);
        throw new Error(industriesError.message);
      }
      
      // Count plant parts
      const { count: totalPlantParts, error: partsError } = await supabase
        .from('plant_parts')
        .select('*', { count: 'exact', head: true });
        
      console.log('Plant parts count:', { totalPlantParts, partsError });
        
      if (partsError) {
        console.error('Error counting plant parts:', partsError);
        throw new Error(partsError.message);
      }
      
      const stats = {
        totalProducts: totalProducts || 0,
        totalIndustries: totalIndustries || 0,
        totalPlantParts: totalPlantParts || 0,
      };
      
      console.log('Final stats:', stats);
      return stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
