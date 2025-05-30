import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client"; // Supabase is the backend for this project

// Function to fetch hemp plant archetypes from Supabase
async function fetchHempPlantArchetypes() {
  const { data, error } = await supabase
    .from('hemp_plant_archetypes')
    .select('*');

  if (error) {
    console.error('Error fetching hemp plant archetypes:', error);
    throw new Error(error.message);
  }
  // Map snake_case fields to camelCase for frontend compatibility
  return Array.isArray(data)
    ? data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        imageUrl: item.image_url,
        cultivationFocusNotes: item.cultivation_focus_notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }))
    : [];
}

export function usePlantTypes() { // Consider renaming to useHempPlantArchetypes later
  return useQuery({
    queryKey: ['hemp_plant_archetypes'], // Updated queryKey
    queryFn: fetchHempPlantArchetypes,    // Added queryFn
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantType(id: number | null) {
  return useQuery({
    queryKey: ['hemp_plant_archetype', id],
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
        .eq('plant_type_id', plantTypeId);
      if (error) {
        console.error('Error fetching plant parts:', error);
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
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .single();
      if (error) {
        console.error('Error fetching stats:', error);
        throw new Error(error.message);
      }
      return data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
