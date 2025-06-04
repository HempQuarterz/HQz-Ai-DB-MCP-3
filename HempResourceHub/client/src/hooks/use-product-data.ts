import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";

export function useHempProducts(
  plantPartId: number | null,
  industryId?: number | null,
  page: number = 1,
  limit: number = 5
) {
  return useQuery({
    queryKey: ['/api/hemp-products', plantPartId, industryId, page, limit],
    enabled: !!plantPartId,
    queryFn: async () => {
      if (!plantPartId) {
        return { products: [], pagination: { total: 0, pages: 0, page: 1, limit } };
      }

      let query = supabase
        .from('hemp_products')
        .select('*', { count: 'exact' })
        .eq('plant_part_id', plantPartId);

      if (industryId) {
        query = query.eq('industry_id', industryId);
      }

      const { data, error, count } = await query
        .order('name')
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error('Error fetching hemp products:', error.message);
        throw error;
      }

      const total = count || 0;
      return {
        products: data || [],
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
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

      const { data, error } = await supabase
        .from('hemp_products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching hemp product:', error.message);
        throw error;
      }

      return data;
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

      try {
        const { data, error } = await supabase
          .from('hemp_products')
          .select('*')
          .textSearch('search_vector', query)
          .order('name');

        if (error) throw error;
        return data || [];
      } catch (e) {
        console.warn('Falling back to ILIKE search for hemp products', e);
        const { data, error } = await supabase
          .from('hemp_products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .order('name');

        if (error) throw error;
        return data || [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
