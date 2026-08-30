import { useState, useEffect, useCallback, useTransition, useDeferredValue, useMemo } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { usePublicProducts } from './usePublicProducts.js';
import { usePublicBrands } from './usePublicBrands.js';
import { usePublicCategories } from './usePublicCategories.js';
import { toSlug, getCatalogUrl, CATALOG_PATH } from '../utils/slugUtils.js';

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

function withPreservedQuery(path, searchParams, { dropLegacy = true } = {}) {
  const next = new URLSearchParams(searchParams);
  if (dropLegacy) {
    next.delete('categoria');
    next.delete('marca');
    next.delete('brandIds');
  }
  const qs = next.toString();
  return qs ? `${path}?${qs}` : path;
}

export const useProductFilters = () => {
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();
  const pageSize = 12;

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { brands, isLoading: isLoadingBrands, error: brandsError } = usePublicBrands();
  const { categories, isLoading: isLoadingCategories, error: categoriesError } = usePublicCategories();

  const catSlug = routeParams.categoriaSlug || routeParams.slug || '';
  const marcaSlug = routeParams.marcaSlug || routeParams.leafSlug || '';

  const resolvedCategory = useMemo(() => {
    if (!catSlug || !categories.length) return null;
    return categories.find((c) => toSlug(categoryName(c)) === catSlug) || null;
  }, [catSlug, categories]);

  const resolvedBrand = useMemo(() => {
    if (!brands.length) return null;
    if (marcaSlug) {
      return brands.find((b) => toSlug(brandName(b)) === marcaSlug) || null;
    }
    if (catSlug && !resolvedCategory) {
      return brands.find((b) => toSlug(brandName(b)) === catSlug) || null;
    }
    return null;
  }, [brands, marcaSlug, catSlug, resolvedCategory]);

  const selectedCategory = categoryIdOf(resolvedCategory);
  const selectedCategoryName = resolvedCategory ? categoryName(resolvedCategory) : '';
  const selectedBrandName = resolvedBrand ? brandName(resolvedBrand) : '';

  const selectedBrands = useMemo(() => {
    const fromQuery = parseBrandIds(searchParams.get('marca') || searchParams.get('brandIds'));
    if (fromQuery.length > 1) return fromQuery;
    const one = brandIdOf(resolvedBrand);
    if (one) return [one];
    return fromQuery;
  }, [searchParams, resolvedBrand]);

  const slugsReady = !catSlug || (!isLoadingCategories && !isLoadingBrands);
  const unresolvedSlug = Boolean(
    slugsReady
    && (catSlug || marcaSlug)
    && !resolvedCategory
    && !resolvedBrand
  );

  // Convert legacy ?categoria=ID / ?marca=ID into crawlable slug paths.
  useEffect(() => {
    const catId = toPositiveInt(searchParams.get('categoria'));
    const brandIds = parseBrandIds(searchParams.get('marca') || searchParams.get('brandIds'));
    if (!catId && brandIds.length === 0) return;
    if (catId && !categories.length) return;
    if (brandIds.length > 0 && !brands.length) return;

    const cat = catId ? categories.find((c) => categoryIdOf(c) === catId) : resolvedCategory;
    const singleBrand = brandIds.length === 1
      ? brands.find((b) => brandIdOf(b) === brandIds[0])
      : null;

    const path = getCatalogUrl({
      categoryName: cat ? categoryName(cat) : '',
      brandName: singleBrand ? brandName(singleBrand) : '',
    });

    const next = new URLSearchParams(searchParams);
    next.delete('categoria');
    if (brandIds.length <= 1) {
      next.delete('marca');
      next.delete('brandIds');
    }
    const qs = next.toString();
    const target = qs ? `${path}?${qs}` : path;
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== target) {
      navigate(target, { replace: true });
    }
  }, [categories, brands, searchParams, navigate, resolvedCategory]);

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
    brandIds: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
    enabled: slugsReady && !unresolvedSlug,
  });

  const handleCategoryChange = useCallback((categoryId) => {
    const numericId = toPositiveInt(categoryId);
    const cat = numericId ? categories.find((c) => categoryIdOf(c) === numericId) : null;
    const keepBrand = selectedBrands.length === 1
      ? brands.find((b) => brandIdOf(b) === selectedBrands[0])
      : null;
    const path = getCatalogUrl({
      categoryName: cat ? categoryName(cat) : '',
      brandName: keepBrand ? brandName(keepBrand) : '',
    });
    navigate(withPreservedQuery(path, searchParams));
  }, [categories, brands, selectedBrands, navigate, searchParams]);

  const handleBrandToggle = useCallback((brandId) => {
    const numericId = toPositiveInt(brandId);
    if (!numericId) return;
    const isOnlySelected = selectedBrands.length === 1 && selectedBrands[0] === numericId;
    const brand = isOnlySelected ? null : brands.find((b) => brandIdOf(b) === numericId);
    const path = getCatalogUrl({
      categoryName: selectedCategoryName,
      brandName: brand ? brandName(brand) : '',
    });
    navigate(withPreservedQuery(path, searchParams));
  }, [brands, selectedBrands, selectedCategoryName, navigate, searchParams]);

  const handleClearFilters = useCallback(() => {
    startTransition(() => {
      setSearchQuery('');
      setCurrentPage(1);
      navigate(CATALOG_PATH);
    });
  }, [navigate]);

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedCategory,
    selectedBrands,
    selectedCategoryName,
    selectedBrandName,
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
    unresolvedSlug,
  };
};
