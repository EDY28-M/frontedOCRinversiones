import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener productos públicos activos con React Query
 * Consume el mismo endpoint que alimenta "Productos Disponibles" del Admin
 * pero sin requerir autenticación.
 *
 * @param {Object} options - Opciones de consulta
 * @param {number} options.page - Página actual (default: 1)
 * @param {number} options.pageSize - Productos por página (default: 16)
 * @param {string} options.q - Término de búsqueda
 * @param {number} options.categoryId - ID de categoría para filtrar
 * @param {string} options.brandIds - IDs de marcas para filtrar (separadas por coma)
 * @returns {Object} { products, total, totalPages, page, isLoading, isError, error, refetch }
 */
export function usePublicProducts({
  page = 1,
  pageSize = 16,
  q = '',
  categoryId = null,
  brandIds = undefined
} = {}) {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['public-products', { page, pageSize, q, categoryId, brandIds }],
    queryFn: () => publicProductsApi.getActiveProducts({ page, pageSize, q, categoryId, brandIds }),
    staleTime: 1000 * 5,         // 5 segundos
    gcTime: 1000 * 60 * 5,      // 5 minutos en memoria
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData, // v5: mantiene datos anteriores mientras carga
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
    isLoading: isLoading && !data,
    isFetching,
    isError,
    isSuccess: !isLoading && !isError,
    error: error?.message || null,
    refetch,
  };
}

export default usePublicProducts;
