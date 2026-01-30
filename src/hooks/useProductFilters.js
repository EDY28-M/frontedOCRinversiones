import { useState, useEffect, useMemo } from 'react';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';

// Hook para manejar filtros con paginación híbrida:
// - Sin búsqueda de texto: carga todo y filtra en cliente (categoría/marca instantáneo)
// - Con búsqueda: usa filtrado server-side
export const useProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const pageSize = 12;
  const maxClientItems = 9999;
  const hasTextSearch = searchQuery.trim().length > 0;

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands]);

  // 1. Cargar productos con filtros del servidor (SERVER-SIDE)
  const {
    products: backendProducts,
    total: backendTotal,
    totalPages: backendTotalPages,
    isLoading: isLoadingProducts,
    isError,
    error,
    refetch: refetchProducts
  } = usePublicProducts({
    page: hasTextSearch ? currentPage : 1,
    pageSize: hasTextSearch ? pageSize : maxClientItems,
    q: hasTextSearch ? searchQuery : '',
    categoryId: hasTextSearch ? selectedCategory : null,
    brandIds: hasTextSearch && selectedBrands.length > 0 ? selectedBrands.join(',') : undefined
  });

  // 2. Cargar datos adicionales (marcas/categorías)
  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  // 3. Filtrado client-side (categorías/marcas) cuando no hay búsqueda de texto
  const clientFilteredProducts = useMemo(() => {
    if (hasTextSearch) return backendProducts;

    let filtered = backendProducts;
    const normalizedCategory = selectedCategory != null ? String(selectedCategory) : null;
    const normalizedBrands = new Set(selectedBrands.map(brandId => String(brandId)));

    if (normalizedCategory) {
      filtered = filtered.filter(product => String(product.CategoryId ?? product.categoryId) === normalizedCategory);
    }

    if (normalizedBrands.size > 0) {
      filtered = filtered.filter(product => normalizedBrands.has(String(product.MarcaId ?? product.marcaId)));
    }

    return filtered;
  }, [backendProducts, hasTextSearch, selectedCategory, selectedBrands]);

  const paginatedClientProducts = useMemo(() => {
    if (hasTextSearch) return backendProducts;
    const startIndex = (currentPage - 1) * pageSize;
    return clientFilteredProducts.slice(startIndex, startIndex + pageSize);
  }, [backendProducts, clientFilteredProducts, currentPage, hasTextSearch, pageSize]);

  const total = hasTextSearch ? backendTotal : clientFilteredProducts.length;
  const totalPages = hasTextSearch
    ? backendTotalPages
    : Math.max(1, Math.ceil(total / pageSize));
  const products = hasTextSearch ? backendProducts : paginatedClientProducts;

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
