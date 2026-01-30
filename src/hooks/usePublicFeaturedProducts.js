import { useQuery } from '@tanstack/react-query';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener productos destacados públicos
 * @param {Object} options
 * @param {number} options.page - Página actual (default: 1)
 * @param {number} options.pageSize - Productos por página (default: 9)
 */
export function usePublicFeaturedProducts({ page = 1, pageSize = 9 } = {}) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-featured-products', { page, pageSize }],
    queryFn: () => publicProductsApi.getFeaturedProducts({ page, pageSize }),
    staleTime: 1000 * 60 * 5,   // 5 minutos - mantiene caché al navegar
    gcTime: 1000 * 60 * 10,     // 10 minutos en memoria
    refetchOnWindowFocus: false, // No refetch al cambiar de tab
    refetchOnMount: false,       // No refetch automático (usa caché)
    placeholderData: (previousData) => previousData,
  });

  const products = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    products,
    total,
    totalPages,
    page,
    pageSize,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
  };
}

export default usePublicFeaturedProducts;
