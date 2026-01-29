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
    staleTime: 1000 * 10, // 10 segundos - casi instantáneo
    gcTime: 1000 * 60, // 1 minuto en memoria
    refetchOnWindowFocus: true, // ✅ Refetch al cambiar de tab
    refetchOnMount: false, // No refetch automático (solo cuando se invalida)
    retry: 2,
  });

  return {
    brands: data || [],
    isLoading,
    error: error?.message || null
  };
}

export default usePublicBrands;