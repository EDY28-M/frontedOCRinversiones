import { useState, useEffect, useCallback } from 'react';
import { publicProductsApi } from '../api/publicApi';

/**
 * Estados posibles del hook
 */
const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

/**
 * Hook para obtener productos públicos activos
 * Consume el mismo endpoint que alimenta "Productos Disponibles" del Admin
 * pero sin requerir autenticación.
 *
 * @param {Object} options - Opciones de consulta
 * @param {number} options.page - Página actual (default: 1)
 * @param {number} options.pageSize - Productos por página (default: 16)
 * @param {string} options.q - Término de búsqueda
 * @param {number} options.categoryId - ID de categoría para filtrar
 * @param {string} options.brandIds - IDs de marcas para filtrar (separadas por coma)
 * @returns {Object} { products, total, totalPages, page, status, error, refetch }
 */
export function usePublicProducts({
  page = 1,
  pageSize = 16,
  q = '',
  categoryId = null,
  brandIds = undefined
} = {}) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setStatus(STATUS.LOADING);
    setError(null);

    try {
      const data = await publicProductsApi.getActiveProducts({
        page,
        pageSize,
        q,
        categoryId,
        brandIds,
      });

      setProducts(data.items || []);
      setTotal(data.total || 0);
      setStatus(STATUS.SUCCESS);
    } catch (err) {
      console.error('Error fetching public products:', err);
      setError(err.message || 'Error al cargar productos');
      setStatus(STATUS.ERROR);
    }
  }, [page, pageSize, q, categoryId, brandIds]);

  // Fetch automático cuando cambian los parámetros
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    total,
    totalPages: Math.ceil(total / pageSize),
    page,
    pageSize,
    status,
    isLoading: status === STATUS.LOADING,
    isError: status === STATUS.ERROR,
    isSuccess: status === STATUS.SUCCESS,
    error,
    refetch,
  };
}

/**
 * Hook para obtener categorías públicas
 * @returns {Object} { categories, isLoading, error }
 */
export function usePublicCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await publicProductsApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}

export default usePublicProducts;
