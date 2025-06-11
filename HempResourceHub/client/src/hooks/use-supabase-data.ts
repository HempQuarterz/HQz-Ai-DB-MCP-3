import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../lib/supabase-api';

// Plant Types Hooks
export function usePlantTypes() {
  return useQuery({
    queryKey: ['plantTypes'],
    queryFn: api.getAllPlantTypes
  });
}

export function usePlantType(id: number | null) {
  return useQuery({
    queryKey: ['plantType', id],
    queryFn: () => id ? api.getPlantType(id) : null,
    enabled: !!id
  });
}

export function useCreatePlantType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPlantType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plantTypes'] });
    }
  });
}

// Plant Parts Hooks
export function usePlantParts() {
  return useQuery({
    queryKey: ['plantParts'],
    queryFn: api.getAllPlantParts
  });
}

export function usePlantPartsByType(plantTypeId: number | null) {
  return useQuery({
    queryKey: ['plantParts', 'byType', plantTypeId],
    queryFn: () => plantTypeId ? api.getPlantPartsByType(plantTypeId) : [],
    enabled: !!plantTypeId
  });
}

export function usePlantPart(id: number | null) {
  return useQuery({
    queryKey: ['plantPart', id],
    queryFn: () => id ? api.getPlantPart(id) : null,
    enabled: !!id
  });
}

export function useCreatePlantPart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPlantPart,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['plantParts'] });
      queryClient.invalidateQueries({ queryKey: ['plantParts', 'byType', variables.archetype_id] });
    }
  });
}

// Industries Hooks
export function useIndustries() {
  return useQuery({
    queryKey: ['industries'],
    queryFn: api.getAllIndustries
  });
}

export function useIndustry(id: number | null) {
  return useQuery({
    queryKey: ['industry', id],
    queryFn: () => id ? api.getIndustry(id) : null,
    enabled: !!id
  });
}

export function useCreateIndustry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createIndustry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['industries'] });
    }
  });
}

// Sub Industries Hooks
export function useSubIndustriesByIndustry(industryId: number | null) {
  return useQuery({
    queryKey: ['subIndustries', 'byIndustry', industryId],
    queryFn: () => industryId ? api.getSubIndustriesByIndustry(industryId) : [],
    enabled: !!industryId
  });
}

// Hemp Products Hooks
export function useHempProducts() {
  return useQuery({
    queryKey: ['hempProducts'],
    queryFn: api.getAllHempProducts
  });
}

export function useHempProduct(id: number | null) {
  return useQuery({
    queryKey: ['hempProduct', id],
    queryFn: () => id ? api.getHempProduct(id) : null,
    enabled: !!id
  });
}

export function useHempProductsByPart(
  plantPartId: number | null, 
  industryId?: number | null, 
  page: number = 1, 
  limit: number = 10
) {
  return useQuery({
    queryKey: ['hempProducts', 'byPart', plantPartId, industryId, page, limit],
    queryFn: () => plantPartId 
      ? api.getHempProductsByPart(plantPartId, industryId || undefined, page, limit) 
      : { data: [], total: 0 },
    enabled: !!plantPartId
  });
}

export function useHempProductsByIndustry(industryId: number | null) {
  return useQuery({
    queryKey: ['hempProducts', 'byIndustry', industryId],
    queryFn: () => industryId ? api.getHempProductsByIndustry(industryId) : [],
    enabled: !!industryId
  });
}

export function useHempSearch(query: string) {
  return useQuery({
    queryKey: ['hempSearch', query],
    queryFn: () => query.length > 2 ? api.searchHempProducts(query) : [],
    enabled: query.length > 2
  });
}

export function useCreateHempProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createHempProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hempProducts'] });
      queryClient.invalidateQueries({ queryKey: ['hempProducts', 'byPart', variables.plant_part_id] });
      queryClient.invalidateQueries({ queryKey: ['hempProducts', 'byIndustry', variables.industry_id] });
    }
  });
}

// Research Papers Hooks
export function useResearchPapers() {
  return useQuery({
    queryKey: ['researchPapers'],
    queryFn: api.getAllResearchPapers
  });
}

export function useResearchPaper(id: number | null) {
  return useQuery({
    queryKey: ['researchPaper', id],
    queryFn: () => id ? api.getResearchPaper(id) : null,
    enabled: !!id
  });
}

export function useResearchPapersByPlantType(plantTypeId: number | null) {
  return useQuery({
    queryKey: ['researchPapers', 'byPlantType', plantTypeId],
    queryFn: () => plantTypeId ? api.getResearchPapersByPlantType(plantTypeId) : [],
    enabled: !!plantTypeId
  });
}

export function useResearchPapersByPlantPart(plantPartId: number | null) {
  return useQuery({
    queryKey: ['researchPapers', 'byPlantPart', plantPartId],
    queryFn: () => plantPartId ? api.getResearchPapersByPlantPart(plantPartId) : [],
    enabled: !!plantPartId
  });
}

export function useResearchPapersByIndustry(industryId: number | null) {
  return useQuery({
    queryKey: ['researchPapers', 'byIndustry', industryId],
    queryFn: () => industryId ? api.getResearchPapersByIndustry(industryId) : [],
    enabled: !!industryId
  });
}

export function useSearchResearchPapers(query: string) {
  return useQuery({
    queryKey: ['researchSearch', query],
    queryFn: () => query.length > 2 ? api.searchResearchPapers(query) : [],
    enabled: query.length > 2
  });
}

export function useCreateResearchPaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createResearchPaper,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['researchPapers'] });
      if (variables.archetype_id) {
        queryClient.invalidateQueries({ queryKey: ['researchPapers', 'byPlantType', variables.archetype_id] });
      }
      if (variables.plant_part_id) {
        queryClient.invalidateQueries({ queryKey: ['researchPapers', 'byPlantPart', variables.plant_part_id] });
      }
      if (variables.industry_id) {
        queryClient.invalidateQueries({ queryKey: ['researchPapers', 'byIndustry', variables.industry_id] });
      }
    }
  });
}

// Statistics Hook
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats
  });
}