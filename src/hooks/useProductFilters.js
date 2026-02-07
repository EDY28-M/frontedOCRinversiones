import { useState, useEffect, useCallback, useTransition, useDeferredValue } from 'react';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';

// Hook para manejar filtros con paginación 100% server-side
// Optimizado con useTransition para UI responsiva
export const useProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]); // Array de números
  const pageSize = 12;

  // useTransition para cambios de filtro no urgentes
  const [isPending, startTransition] = useTransition();

  // Debounce de búsqueda con useDeferredValue
  const deferredSearchQuery = useDeferredValue(searchQuery);

  // Resetear página cuando cambian los filtros (con transición)
  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1);
    });
  }, [deferredSearchQuery, selectedCategory, selectedBrands]);

  // Cargar productos con filtros del servidor (100% SERVER-SIDE)
  const {
    products,
    total,
    totalPages,
    isLoading: isLoadingProducts,
    isFetching,
    isError,
    error,
    refetch: refetchProducts
  } = usePublicProducts({
    page: currentPage,
    pageSize: pageSize,
    q: deferredSearchQuery.trim() || '',
    categoryId: selectedCategory,
    brandIds: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined
  });

  // Cargar datos adicionales (marcas/categorías)
  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  // Handler robusto para categorías (toggle) - con transición
  const handleCategoryChange = useCallback((categoryId) => {
    const numericId = categoryId !== null ? Number(categoryId) : null;
    startTransition(() => {
      setSelectedCategory(prev => prev === numericId ? null : numericId);
    });
  }, []);

  // Handler robusto para marcas (multi-select toggle) - con transición
  const handleBrandToggle = useCallback((brandId) => {
    const numericId = Number(brandId);
    if (isNaN(numericId) || numericId <= 0) return;
    
    startTransition(() => {
      setSelectedBrands(prev => {
        const exists = prev.includes(numericId);
        if (exists) {
          return prev.filter(id => id !== numericId);
        } else {
          return [...prev, numericId];
        }
      });
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSelectedCategory(null);
      setSelectedBrands([]);
      setSearchQuery('');
      setCurrentPage(1);
    });
  }, []);

  return {
    // Estados
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedCategory,
    selectedBrands,
    categories,
    brands,
    isLoadingBrands,
    isLoadingCategories,
    brandsError,
    categoriesError,

    // Datos procesados (ya paginados desde el servidor)
    products,
    total,
    totalPages,
    pageSize,
    isLoading: isLoadingProducts,
    isFetching: isFetching || isPending, // Incluye transiciones pendientes
    isError,
    error,
    refetch: refetchProducts,

    // Funciones
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  };
};
