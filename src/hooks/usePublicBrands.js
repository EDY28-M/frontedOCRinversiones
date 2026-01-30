import { useQuery } from '@tanstack/react-query';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener marcas públicas activas
 * Usa React Query para sincronización automática con invalidación de caché
 * @returns {Object} { brands, isLoading, error }
 */
export function usePublicBrands() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-brands'],
    queryFn: () => publicProductsApi.getBrands(),
    staleTime: 1000 * 60 * 5, // 5 minutos - mantiene caché al navegar
    gcTime: 1000 * 60 * 10,   // 10 minutos en memoria
    refetchOnWindowFocus: false, // No refetch al cambiar de tab
    refetchOnMount: false,       // No refetch automático (usa caché)
    retry: 2,
  });

  return {
    brands: data || [],
    isLoading,
    error: error?.message || null
  };
}

export default usePublicBrands;