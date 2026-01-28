import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import FiltersSidebar from '../../../components/products/FiltersSidebar.jsx';
import ProductsGrid from '../../../components/products/ProductsGrid.jsx';
import { useProductFilters } from '../../../hooks/useProductFilters';

/**
 * Página pública de Productos
 * Consume el mismo endpoint que usa "Productos Disponibles" del Admin
 * Solo muestra productos activos con imágenes (IsActive=true + al menos 1 imagen)
 */
export default function Productos() {
  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedCategory,
    selectedBrands,
    categories,
    brands,
    isLoadingCategories,
    isLoadingBrands,
    categoriesError,
    brandsError,
    products,
    total,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  } = useProductFilters();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="productos-wrapper bg-surface font-sans text-text-main antialiased">
      <div className="relative flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-fit">
              <div className="text-primary">
                <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
              </div>
              <div>
                <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
                }
                end
              >
                {({ isActive }) => (
                  <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                    INICIO
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/productos"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
                }
              >
                {({ isActive }) => (
                  <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                    CATÁLOGO
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/servicios"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
                }
              >
                {({ isActive }) => (
                  <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                    SERVICIOS
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/nosotros"
                className={({ isActive }) =>
                  `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
                }
              >
                {({ isActive }) => (
                  <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                    EMPRESA
                  </span>
                )}
              </NavLink>
            </nav>
            <div className="flex-1 max-w-sm hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded bg-gray-50 text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Buscar refacción..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 min-w-fit">
              <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-white"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded transition-colors group">
                <span className="material-symbols-outlined text-[22px]">person</span>
              </button>
              <button
                className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row">
          <FiltersSidebar
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrands={selectedBrands}
            onCategoryChange={handleCategoryChange}
            onBrandToggle={handleBrandToggle}
            onClearFilters={handleClearFilters}
            isLoadingCategories={isLoadingCategories}
            isLoadingBrands={isLoadingBrands}
            categoriesError={categoriesError}
            brandsError={brandsError}
          />

          <section className="flex-1 p-6 lg:p-10 bg-white">
            {/* Header con título y contador */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Componentes Destacados</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {total} productos disponibles
                </p>
              </div>
              {/* Botón refresh */}
              <button
                onClick={refetch}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors text-sm font-medium disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
                  {isLoading ? 'progress_activity' : 'refresh'}
                </span>
                Actualizar
              </button>
            </div>

            {/* Grid de productos */}
            <ProductsGrid
              products={products}
              isLoading={isLoading}
              isError={isError}
              error={error}
              refetch={refetch}
              total={total}
            />

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center pb-8">
                <nav className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <span className="material-symbols-outlined text-sm">west</span>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          currentPage === pageNum
                            ? 'bg-primary text-white text-xs font-bold shadow-md shadow-blue-200'
                            : 'border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-xs font-medium'
                        } transition-colors`}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2 text-gray-400 text-xs">...</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-700 hover:border-primary hover:text-primary text-xs font-medium"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={isLoading}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <span className="material-symbols-outlined text-sm">east</span>
                  </button>
                </nav>
              </div>
            )}
          </section>
        </main>

        <footer className="bg-primary text-white pt-16 pb-8 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
                  </div>
                  <h1 className="text-2xl font-display font-medium uppercase tracking-tighter leading-none">ORC</h1>
                  <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  Líderes en refacciones de alto rendimiento para entusiastas del motor. Calidad garantizada en cada pieza.
                </p>
                <div className="flex gap-4">
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">IG</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">FB</span>
                  </a>
                  <a className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-xs font-bold">TW</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Nuestra Empresa</h4>
                <ul className="space-y-4">
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="text-sm text-gray-200 hover:text-white transition-colors" to="/contacto">Carreras</Link></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Blog Automotriz</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Socios Comerciales</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Políticas</h4>
                <ul className="space-y-4">
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Envíos y Entregas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Devoluciones</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Garantía de Piezas</a></li>
                  <li><a className="text-sm text-gray-200 hover:text-white transition-colors" href="#">Términos de Servicio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-6">Contacto</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-accent text-lg mt-0.5">location_on</span>
                    <span className="text-sm text-gray-200">Av. Revolución 1234, CDMX, México</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">mail</span>
                    <a className="text-sm text-gray-200 hover:text-white" href="mailto:ventas@estructurapro.com">ventas@estructurapro.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent text-lg">call</span>
                    <span className="text-sm text-gray-200">+52 55 1234 5678</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-8 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© 2024 ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a className="hover:text-white transition-colors" href="#">Facebook</a>
                <a className="hover:text-white transition-colors" href="#">Instagram</a>
                <a className="hover:text-white transition-colors" href="#">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}