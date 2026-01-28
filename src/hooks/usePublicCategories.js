import { useState, useEffect } from 'react';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener categorías públicas activas con conteo de productos
 * @returns {Object} { categories, isLoading, error }
 */
export function usePublicCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await publicProductsApi.getPublicCategories();
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

export default usePublicCategories;