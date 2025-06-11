import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import * as api from '../lib/image-generation-api';

// Dashboard Stats Hook
export function useImageGenerationStats() {
  return useQuery({
    queryKey: ['imageGenerationStats'],
    queryFn: api.getImageGenerationStats,
    refetchInterval: 30000 // Refresh every 30 seconds
  });
}

// Queue Management Hooks
export function useImageGenerationQueue(status?: string, limit: number = 50) {
  return useQuery({
    queryKey: ['imageGenerationQueue', status, limit],
    queryFn: () => api.getImageGenerationQueue(status, limit),
    refetchInterval: 10000 // Refresh every 10 seconds
  });
}

// Provider Stats Hook
export function useProviderStats() {
  return useQuery({
    queryKey: ['providerStats'],
    queryFn: api.getProviderStats,
    refetchInterval: 60000 // Refresh every minute
  });
}

// Products Needing Attention Hook
export function useProductsNeedingAttention(limit: number = 50) {
  return useQuery({
    queryKey: ['productsNeedingAttention', limit],
    queryFn: () => api.getProductsNeedingAttention(limit)
  });
}

// Image Comparisons Hook
export function useImageComparisons(productId?: number) {
  return useQuery({
    queryKey: ['imageComparisons', productId],
    queryFn: () => api.getImageComparisons(productId),
    enabled: productId !== undefined
  });
}

// Product Images Hook
export function useProductImages(productId: number | null) {
  return useQuery({
    queryKey: ['productImages', productId],
    queryFn: () => productId ? api.getProductImages(productId) : [],
    enabled: !!productId
  });
}

// Mutation Hooks
export function useRetryFailedGeneration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.retryFailedGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageGenerationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['imageGenerationStats'] });
    }
  });
}

export function useCancelQueueItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.cancelQueueItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imageGenerationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['imageGenerationStats'] });
    }
  });
}

export function useRegenerateProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, provider }: { productId: number; provider: string }) => 
      api.regenerateProductImage(productId, provider),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['imageGenerationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['productsNeedingAttention'] });
      queryClient.invalidateQueries({ queryKey: ['productImages', variables.productId] });
    }
  });
}

export function useSetActiveImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) => 
      api.setActiveImage(productId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productImages', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['hempProduct', variables.productId] });
    }
  });
}

// Real-time subscription hooks
export function useQueueUpdates(onUpdate: (payload: any) => void) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const subscription = api.subscribeToQueueUpdates((payload) => {
      onUpdate(payload);
      // Invalidate relevant queries when queue updates
      queryClient.invalidateQueries({ queryKey: ['imageGenerationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['imageGenerationStats'] });
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [onUpdate, queryClient]);
}

export function useProductImageUpdates(productId: number | null, onUpdate: (payload: any) => void) {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!productId) return;
    
    const subscription = api.subscribeToImageGenerations(productId, (payload) => {
      onUpdate(payload);
      // Invalidate product images query when new images are generated
      queryClient.invalidateQueries({ queryKey: ['productImages', productId] });
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [productId, onUpdate, queryClient]);
}
