import { useState } from 'react';

const FiltersSidebar = ({
  categories,
  brands,
  selectedCategory,
  selectedBrands,
  onCategoryChange,
  onBrandToggle,
  onClearFilters,
  isLoadingCategories,
  isLoadingBrands,
  categoriesError,
  brandsError
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleBrandToggle = (brandId) => {
    onBrandToggle(brandId);
  };

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

      {/* Sidebar - Categorías y marcas dinámicas del backend */}
      <aside className={`w-full lg:w-64 flex-shrink-0 border-r border-gray-200 bg-white p-6 lg:min-h-[calc(100vh-80px)] ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>

        {/* Header de Filtros con Reset */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400">FILTRAR POR</h3>
          <button
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
              {/* Opción "Todas" */}
              <label
                className={`group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors`}
                onClick={() => onCategoryChange(null)}
              >
                <span className={`w-1 h-5 rounded-full transition-colors ${selectedCategory === null ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary/50'
                  }`}></span>
                <span className={`text-sm ${selectedCategory === null ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'
                  }`}>Todas las Categorías</span>
              </label>
              {/* Categorías del backend */}
              {categories.map(cat => (
                <label
                  key={cat.id || cat.Id}
                  className={`group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors`}
                  onClick={() => onCategoryChange(cat.id || cat.Id)}
                >
                  <span className={`w-1 h-5 rounded-full transition-colors ${selectedCategory === (cat.id || cat.Id) ? 'bg-primary' : 'bg-gray-300 group-hover:bg-primary/50'
                    }`}></span>
                  <span className={`text-sm ${selectedCategory === (cat.id || cat.Id) ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'
                    }`}>
                    {cat.Name || cat.name || cat.Nombre || cat.nombre}
                    {cat.CountActive > 0 && <span className="ml-1 text-gray-500">({cat.CountActive})</span>}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Filtros de marcas */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900">Marcas</h3>
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
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2">
              {brands.map(brand => (
                <label
                  key={brand.id || brand.Id}
                  className={`group flex items-center gap-3 py-2 px-2 -mx-2 rounded hover:bg-gray-50 cursor-pointer transition-colors`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id || brand.Id)}
                    onChange={() => handleBrandToggle(brand.id || brand.Id)}
                    className="sr-only peer"
                  />
                  <span className="w-4 h-4 flex items-center justify-center border border-gray-300 rounded peer-hover:border-gray-400 peer-checked:bg-primary peer-checked:border-primary transition-colors">
                    <svg className="w-3 h-3 text-white peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className={`text-sm ${selectedBrands.includes(brand.id || brand.Id) ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'
                    }`}>
                    {brand.Nombre || brand.nombre || brand.Name || brand.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default FiltersSidebar;