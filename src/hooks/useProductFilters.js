import { useState, useEffect } from 'react';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';

// Hook para manejar el estado de filtros y productos
export const useProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Hook que consume el endpoint público /api/products/public/active
  const {
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch
  } = usePublicProducts({
    page: currentPage,
    pageSize: 16,
    q: debouncedSearch,
    categoryId: selectedCategory,
    brandIds: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
  });

  // Hook para obtener marcas públicas
  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();

  // Hook para obtener categorías públicas
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  // Funciones de manejo de filtros
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage(1);
  };

  const handleBrandToggle = (brandId) => {
    if (brandId === 'all') {
      // Limpiar todas las marcas
      setSelectedBrands([]);
    } else {
      setSelectedBrands(prev => {
        if (prev.includes(brandId)) {
          return prev.filter(id => id !== brandId);
        } else {
          return [...prev, brandId];
        }
      });
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setSearchQuery('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

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

    // Datos
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,

    // Funciones
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  };
};