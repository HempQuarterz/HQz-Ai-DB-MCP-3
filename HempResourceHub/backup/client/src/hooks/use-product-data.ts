import { useQuery } from "@tanstack/react-query";
import { firebase } from "@/lib/firebase";

export function useHempProducts(plantPartId: number | null, industryId?: number | null, page: number = 1, limit: number = 5) {
  return useQuery({
    queryKey: ['/api/hemp-products', plantPartId, industryId, page, limit],
    enabled: !!plantPartId,
    queryFn: async () => {
      if (!plantPartId) return { products: [], pagination: { total: 0, pages: 0, page: 1, limit } };
      return firebase.getHempProductsByPart(plantPartId, industryId || undefined, page, limit);
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
      return firebase.getHempProduct(id);
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
      return firebase.searchHempProducts(query);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
