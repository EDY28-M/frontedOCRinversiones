import { useQuery } from '@tanstack/react-query';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener categorías públicas activas con conteo de productos
 * Usa React Query para sincronización automática con invalidación de caché
 * @returns {Object} { categories, isLoading, error }
 */
export function usePublicCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => publicProductsApi.getPublicCategories(),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 2,
  });

  return {
    categories: data || [],
    isLoading,
    error: error?.message || null
  };
}

export default usePublicCategories;