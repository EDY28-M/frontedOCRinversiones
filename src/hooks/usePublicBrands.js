import { useState, useEffect } from 'react';
import { publicProductsApi } from '../api/publicApi';

/**
 * Hook para obtener marcas públicas activas
 * @returns {Object} { brands, isLoading, error }
 */
export function usePublicBrands() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await publicProductsApi.getBrands();
        setBrands(data);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, isLoading, error };
}

export default usePublicBrands;