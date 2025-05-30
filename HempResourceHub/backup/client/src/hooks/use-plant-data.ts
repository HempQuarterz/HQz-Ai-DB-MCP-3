import { useQuery } from "@tanstack/react-query";
import { firebase } from "@/lib/firebase";

export function usePlantTypes() {
  return useQuery({
    queryKey: ['/api/plant-types'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantType(id: number | null) {
  return useQuery({
    queryKey: ['/api/plant-types', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return firebase.getPlantType(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantParts(plantTypeId: number | null) {
  return useQuery({
    queryKey: ['/api/plant-parts', plantTypeId],
    enabled: !!plantTypeId,
    queryFn: async () => {
      if (!plantTypeId) return [];
      return firebase.getPlantPartsByType(plantTypeId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePlantPart(id: number | null) {
  return useQuery({
    queryKey: ['/api/plant-parts/detail', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      return firebase.getPlantPart(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useIndustries() {
  return useQuery({
    queryKey: ['/api/industries'],
    queryFn: async () => {
      return firebase.getAllIndustries();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      return firebase.getStats();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
