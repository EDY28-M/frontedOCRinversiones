import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import FiltersSidebar from '../../../components/products/FiltersSidebar.jsx';
import ProductsGrid from '../../../components/products/ProductsGrid.jsx';
import ProductDetailModal from '../../../components/ProductDetailModal';
import MobileMenu from '../../../components/common/MobileMenu';
import { useProductFilters } from '../../../hooks/useProductFilters';
import { useDocumentMeta } from '../../../hooks/useDocumentMeta';

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
    pageSize,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleCategoryChange,
    handleBrandToggle,
    handleClearFilters,
  } = useProductFilters();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useDocumentMeta({
    title: 'Catálogo de Repuestos para Vehículos | ORC Inversiones Perú',
    description: 'Explora nuestro catálogo de repuestos coreanos, chinos y japoneses para vehículos. Filtros, frenos, motores y más. JAC, Foton, Hyundai, Toyota, JMC. Precios competitivos en Ate, Lima.',
    canonicalPath: '/productos',
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-screen flex flex-col bg-surface font-sans text-text-main antialiased overflow-hidden">
      {/* Header fijo */}
      <header className="flex-shrink-0 w-full bg-white border-b border-border-light shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 min-w-fit">
            <div className="text-primary">
              <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
            </div>
            <div>
              <span className="text-2xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
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
              to="/envios-provincias"
              className={({ isActive }) =>
                `text-xs font-semibold transition-colors tracking-wide ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}`
              }
            >
              {({ isActive }) => (
                <span className={`relative nav-link ${isActive ? 'active' : ''}`}>
                  ENVÍOS A PROVINCIAS
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
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Contenedor con scroll - igual que admin */}
      <div className="flex-1 overflow-y-auto flex flex-col">
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
            {/* Header con título y paginador compacto */}
            {/* Header con título y paginador compacto */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catálogo de Repuestos para Vehículos</h1>
              </div>

              {/* Paginador estilo Admin */}
              {!isLoading && total > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-sm text-slate-600 font-mono">
                    Mostrando <span className="font-bold">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold">{Math.min(currentPage * pageSize, total)}</span> de <span className="font-bold">{total}</span> productos
                  </div>

                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">west</span>
                    </button>

                    {/* Lógica de botones de página idéntica al admin */}
                    {(() => {
                      const maxVisiblePages = 5;
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      if (endPage - startPage < maxVisiblePages - 1) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 text-xs">...</span>);
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${currentPage === i
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 text-xs">...</span>);
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-sm">east</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Grid de productos */}
            <ProductsGrid
              products={products}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              error={error}
              refetch={refetch}
              total={total}
              onProductClick={(product) => setSelectedProduct(product)}
            />
          </section>
        </main>

        <footer className="mt-auto flex-shrink-0 bg-primary text-white pt-10 pb-6 border-t-4 border-accent">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-accent">
                    <span className="material-symbols-outlined text-2xl">settings_b_roll</span>
                  </div>
                  <span className="text-xl font-display font-medium uppercase tracking-tighter leading-none block">ORC</span>
                  <p className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Inversiones Perú</p>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  Somos una empresa dedicada a la importación y venta de repuestos para vehículos chinos, japoneses y coreanos, ofreciendo calidad y precios competitivos.
                </p>
                <div className="flex gap-3">
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">IG</span>
                  </a>
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">FB</span>
                  </a>
                  <a className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-white hover:bg-accent hover:text-secondary transition-colors" href="#">
                    <span className="text-[10px] font-bold">TW</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Nuestra Empresa</h4>
                <ul className="space-y-2">
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/nosotros">Sobre Nosotros</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/envios-provincias">Envíos a Provincias</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/productos">Catálogo</Link></li>
                  <li><Link className="text-xs text-gray-200 hover:text-white transition-colors" to="/">Empresa</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Políticas</h4>
                <ul className="space-y-2">
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Envíos y Entregas</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Devoluciones</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Garantía de Piezas</a></li>
                  <li><a className="text-xs text-gray-200 hover:text-white transition-colors" href="#">Términos de Servicio</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider mb-4">Contacto</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-accent text-base mt-0.5">location_on</span>
                    <span className="text-xs text-gray-200">Av. Nicolás Ayllón 4329 - Ate, Lima</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">mail</span>
                    <a className="text-xs text-gray-200 hover:text-white" href="mailto:ventas@orcinversiones.com">ventas@orcinversiones.com</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent text-base">call</span>
                    <span className="text-xs text-gray-200">984 244 498</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-blue-800 pt-6 text-[10px] text-blue-200 uppercase tracking-widest gap-4">
              <p>© {new Date().getFullYear()} ORC Inversiones Perú. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a className="hover:text-white transition-colors" href="#">Facebook</a>
                <a className="hover:text-white transition-colors" href="#">Instagram</a>
                <a className="hover:text-white transition-colors" href="#">WhatsApp</a>
              </div>
            </div>
          </div>
        </footer>
      </div>{/* Cierre del contenedor con scroll */}

      {/* Modal de Detalle del Producto */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isPublic={true}
        />
      )}
    </div>
  );
}
