import { useState, useEffect } from 'react';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';

// Hook para manejar el estado de filtros y productos con paginación SERVER-SIDE
export const useProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const pageSize = 12;

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands]);

  // 1. Cargar productos con filtros del servidor (SERVER-SIDE)
  const {
    products,
    total,
    totalPages,
    isLoading: isLoadingProducts,
    isError,
    error,
    refetch: refetchProducts
  } = usePublicProducts({
    page: currentPage,
    pageSize: pageSize,
    q: searchQuery,
    categoryId: selectedCategory,
    brandIds: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined
  });

  // 2. Cargar datos adicionales (marcas/categorías)
  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  // Funciones de manejo de filtros
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleBrandToggle = (brandId) => {
    if (brandId === 'all') {
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
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands([]);
    setSearchQuery('');
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

    // Datos procesados (ya paginados desde el servidor)
    products,
    total,
    totalPages,
    isLoading: isLoadingProducts,
    isError,
    error,
    refetch: refetchProducts,

    // Funciones
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  };
};