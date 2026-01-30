import { useQuery } from '@tanstack/react-query';
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
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['public-products', { page, pageSize, q, categoryId, brandIds }],
    queryFn: () => publicProductsApi.getActiveProducts({ page, pageSize, q, categoryId, brandIds }),
    staleTime: 1000 * 60 * 5,   // 5 minutos - mantiene caché al navegar entre páginas
    gcTime: 1000 * 60 * 10,     // 10 minutos en memoria
    refetchOnWindowFocus: false, // No refetch automático al cambiar de tab
    refetchOnMount: false,       // No refetch cuando el componente se monta (usa caché)
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
    isSuccess: !isLoading && !isError,
    error: error?.message || null,
    refetch,
  };
}

export default usePublicProducts;
