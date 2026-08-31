import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getCatalogUrl, toSlug } from '../../utils/slugUtils';
import { usePublicSiteSettings } from '../../hooks/usePublicSiteSettings';
import { CategoryShapePhoto } from '../common/CategoryLinesShowcase';

const FiltersSidebar = ({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  selectedCategoryName,
  selectedBrandName,
  onClearFilters,
  isLoadingCategories,
  isLoadingBrands,
  categoriesError,
  brandsError
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { showcaseShape } = usePublicSiteSettings();

  const selectedBrandIds = useMemo(
    () => new Set(selectedBrands.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)),
    [selectedBrands]
  );
  const selectedCategoryId = Number(selectedCategory) > 0 ? Number(selectedCategory) : null;

  const normalizedCategories = useMemo(() =>
    categories.map(cat => ({
      id: Number(cat.Id || cat.id),
      name: cat.Name || cat.name || cat.Nombre || cat.nombre || 'Sin nombre',
      count: cat.CountActive || 0,
      imageUrl: cat.imageUrl || cat.ImageUrl || '',
      overlayImageUrl: cat.overlayImageUrl || cat.OverlayImageUrl || '',
    })),
    [categories]
  );

  const normalizedBrands = useMemo(() =>
    brands.map(brand => ({
      id: Number(brand.Id || brand.id),
      name: brand.Nombre || brand.nombre || brand.Name || brand.name || 'Sin nombre'
    })),
    [brands]
  );

  const allCategoriesHref = getCatalogUrl({ brandName: selectedBrandName });

  return (
    <>
      {/* Mobile Filters Button */}
      <div className="lg:hidden p-4 bg-white border-b border-border-light">
        <button
          className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <span className="text-sm font-medium">Filtros y Categorías</span>
          <span className="material-symbols-outlined text-sm">{mobileFiltersOpen ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>

      <aside className={`w-full lg:w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">FILTRAR POR</h3>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 tracking-wider transition-colors uppercase"
          >
            RESET
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-bold tracking-widest mb-6 uppercase text-gray-900">Categorías</h3>
          {isLoadingCategories ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : categoriesError ? (
            <p className="text-xs text-red-500">Error al cargar categorías</p>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to={allCategoriesHref}
                className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors text-left w-full no-underline"
              >
                <span className={`w-1 h-5 rounded-full transition-colors ${selectedCategoryId === null ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary/50'}`}></span>
                <span className={`text-sm ${selectedCategoryId === null ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                  Todas las Categorías
                </span>
              </Link>
              {normalizedCategories.map(cat => {
                const href = getCatalogUrl({
                  categoryName: cat.name,
                  brandName: selectedBrandName,
                });
                const isActive = selectedCategoryId === cat.id
                  || (selectedCategoryName && toSlug(selectedCategoryName) === toSlug(cat.name));
                return (
                  <Link
                    key={cat.id}
                    to={href}
                    className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors text-left w-full no-underline"
                  >
                    {cat.imageUrl ? (
                      <span className="w-9 h-9 shrink-0">
                        <CategoryShapePhoto
                          shape={showcaseShape}
                          src={cat.imageUrl}
                          overlaySrc={cat.overlayImageUrl}
                        />
                      </span>
                    ) : (
                      <span className={`w-1 h-5 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary/50'}`}></span>
                    )}
                    <span className={`text-sm ${isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                      {cat.name}
                      {cat.count > 0 && <span className="ml-1 text-gray-500">({cat.count})</span>}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900">Marcas</h3>
            {selectedBrandIds.size > 0 && (
              <span className="text-xs text-blue-600 font-medium">({selectedBrandIds.size})</span>
            )}
          </div>

          {isLoadingBrands ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : brandsError ? (
            <p className="text-xs text-red-500">Error al cargar marcas</p>
          ) : (
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-2">
              {normalizedBrands.map(brand => {
                const isSelected = selectedBrandIds.has(brand.id)
                  || (selectedBrandName && toSlug(selectedBrandName) === toSlug(brand.name));
                const href = getCatalogUrl({
                  categoryName: selectedCategoryName,
                  brandName: isSelected ? '' : brand.name,
                });
                return (
                  <Link
                    key={brand.id}
                    to={href}
                    className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors text-left w-full no-underline"
                  >
                    <span className={`w-4 h-4 flex items-center justify-center border rounded transition-colors ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-sm ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                      {brand.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default FiltersSidebar;
