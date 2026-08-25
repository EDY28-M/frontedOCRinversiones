import { useState, useEffect, useCallback, useTransition, useDeferredValue, useMemo } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';
import { toSlug } from '../utils/slugUtils.js';

function toPositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function parseBrandIds(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(toPositiveInt)
    .filter(Boolean);
}

function categoryName(cat) {
  return cat?.Name || cat?.name || cat?.Nombre || cat?.nombre || '';
}

function brandName(brand) {
  return brand?.Nombre || brand?.nombre || brand?.Name || brand?.name || '';
}

function categoryIdOf(cat) {
  return toPositiveInt(cat?.Id ?? cat?.id);
}

function brandIdOf(brand) {
  return toPositiveInt(brand?.Id ?? brand?.id);
}

export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams();
  const pageSize = 12;

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const selectedCategory = toPositiveInt(searchParams.get('categoria'));
  const selectedBrands = useMemo(
    () => parseBrandIds(searchParams.get('marca') || searchParams.get('brandIds')),
    [searchParams]
  );

  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  const patchParams = useCallback((mutator) => {
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        mutator(next);
        return next;
      }, { replace: true });
      setCurrentPage(1);
    });
  }, [setSearchParams]);

  // Apply /repuestos/:slug or /repuestos/:categoriaSlug/:marcaSlug when the URL has no query filters.
  useEffect(() => {
    const hasQueryFilter = searchParams.get('categoria') || searchParams.get('marca') || searchParams.get('brandIds');
    if (hasQueryFilter) return;

    const catSlug = routeParams.categoriaSlug || routeParams.slug;
    const marcaFromRoute = routeParams.marcaSlug;
    if (!catSlug && !marcaFromRoute) return;

    const next = new URLSearchParams(searchParams);
    let changed = false;

    if (catSlug && categories.length) {
      const cat = categories.find((c) => toSlug(categoryName(c)) === catSlug);
      const id = cat ? categoryIdOf(cat) : null;
      if (id && !next.get('categoria')) {
        next.set('categoria', String(id));
        changed = true;
      } else if (!id && brands.length && !next.get('marca')) {
        const brand = brands.find((b) => toSlug(brandName(b)) === catSlug);
        const brandId = brand ? brandIdOf(brand) : null;
        if (brandId) {
          next.set('marca', String(brandId));
          changed = true;
        }
      }
    }

    if (marcaFromRoute && brands.length && !next.get('marca')) {
      const brand = brands.find((b) => toSlug(brandName(b)) === marcaFromRoute);
      const brandId = brand ? brandIdOf(brand) : null;
      if (brandId) {
        next.set('marca', String(brandId));
        changed = true;
      }
    }

    if (changed) {
      setSearchParams(next, { replace: true });
    }
  }, [categories, brands, routeParams.slug, routeParams.categoriaSlug, routeParams.marcaSlug, searchParams, setSearchParams]);

  useEffect(() => {
    startTransition(() => {
      setCurrentPage(1);
    });
  }, [deferredSearchQuery, selectedCategory, selectedBrands]);

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

  const handleCategoryChange = useCallback((categoryId) => {
    const numericId = toPositiveInt(categoryId);
    patchParams((next) => {
      if (!numericId || selectedCategory === numericId) {
        next.delete('categoria');
      } else {
        next.set('categoria', String(numericId));
      }
    });
  }, [patchParams, selectedCategory]);

  const handleBrandToggle = useCallback((brandId) => {
    const numericId = toPositiveInt(brandId);
    if (!numericId) return;
    patchParams((next) => {
      const current = parseBrandIds(next.get('marca') || next.get('brandIds'));
      const exists = current.includes(numericId);
      const updated = exists ? current.filter((id) => id !== numericId) : [...current, numericId];
      next.delete('brandIds');
      if (updated.length === 0) next.delete('marca');
      else next.set('marca', updated.join(','));
    });
  }, [patchParams]);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSearchQuery('');
      setCurrentPage(1);
      setSearchParams({}, { replace: true });
    });
  }, [setSearchParams]);

  return {
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
    products,
    total,
    totalPages,
    pageSize,
    isLoading: isLoadingProducts,
    isFetching: isFetching || isPending,
    isError,
    error,
    refetch: refetchProducts,
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  };
};
