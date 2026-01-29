import { useState, useEffect, useMemo } from 'react';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';

// Hook para manejar el estado de filtros y productos con paginación CLIENT-SIDE
export const useProductFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const pageSize = 12;

  // 1. Cargar TODOS los productos activos una sola vez
  const {
    products: allProducts,
    isLoading: isLoadingProducts,
    isError,
    error,
    refetch: refetchProducts
  } = usePublicProducts({
    page: 1,
    pageSize: 9999, // Obtener todos
    q: '',
    categoryId: null,
    brandIds: undefined
  });

  // 2. Filtrado local (Memoizado para performance)
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    let result = [...allProducts];

    // Filtro por Búsqueda
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.producto?.toLowerCase().includes(term) ||
        p.codigo?.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.marcaNombre?.toLowerCase().includes(term)
      );
    }

    // Filtro por Categoría
    if (selectedCategory) {
      // Necesitamos asegurar que categoryId sea numérico si viene como string
      const categoryIdNum = Number(selectedCategory);
      result = result.filter(p => p.categoryId === categoryIdNum);
    }

    // Filtro por Marcas
    if (selectedBrands.length > 0) {
      // Convertir a números para comparación segura
      const brandIdsNum = selectedBrands.map(id => Number(id));
      result = result.filter(p => brandIdsNum.includes(p.marcaId));
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, selectedBrands]);

  // 3. Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrands]);

  // 4. Paginación de los resultados filtrados
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Slice para la página actual
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Cargar datos adicionales (marcas/categorías)
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

    // Datos procesados
    products: paginatedProducts, // Solo los de la página actual
    total,
    totalPages,
    isLoading: isLoadingProducts, // Solo carga inicial
    isError,
    error,
    refetch: refetchProducts,

    // Funciones
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  };
};