import { useQuery } from "@tanstack/react-query";

// TODO: Replace stubbed data with real data source (e.g., Supabase)

export function useHempProducts(plantPartId: number | null, industryId?: number | null, page: number = 1, limit: number = 5) {
  return useQuery({
    queryKey: ['/api/hemp-products', plantPartId, industryId, page, limit],
    enabled: !!plantPartId,
    queryFn: async () => {
      if (!plantPartId) return { products: [], pagination: { total: 0, pages: 0, page: 1, limit } };
      // Stub: return empty products until real data source is connected
      return { products: [], pagination: { total: 0, pages: 0, page: 1, limit } };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useHempProduct(id: number | null) {
  return useQuery({
    queryKey: ['/api/hemp-products/detail', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      // Stub: return null until real data source is connected
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useHempSearch(query: string) {
  return useQuery({
    queryKey: ['/api/hemp-products/search', query],
    enabled: query.length > 2,
    queryFn: async () => {
      if (query.length <= 2) return [];
      // Stub: return empty array until real data source is connected
      return [];
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
