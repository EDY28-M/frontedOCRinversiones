import { useState, useEffect, useMemo } from 'react';
import { categoryService } from '../../../services/productService';
import { useAvailableProducts } from '../../../hooks/useProducts';
import ProductDetailModal from '../../../components/ProductDetailModal';

const ProductosDestacados = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Paginación CLIENT-SIDE
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  // ✅ CARGAR TODOS LOS PRODUCTOS UNA SOLA VEZ (sin filtros en backend)
  const {
    data: productsData,
    isLoading,
    isFetching,
    refetch
  } = useAvailableProducts({
    page: 1,
    pageSize: 9999, // Traer TODOS los productos
    q: '', // Sin búsqueda en backend
    categoryId: null, // Sin filtro de categoría en backend
  });

  // Cargar categorías al montar
  useEffect(() => {
    categoryService.getAllCategories()
      .then(setCategories)
      .catch(err => console.error('Error al cargar categorías:', err));
  }, []);

  // Todos los productos del backend
  const allProducts = productsData?.items || [];

  // ✅ FILTRADO CLIENT-SIDE - INSTANTÁNEO
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Filtro por búsqueda (nombre, código, categoría, marca)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(producto => {
        const matchProducto = producto.producto?.toLowerCase().includes(term);
        const matchCodigo = producto.codigo?.toLowerCase().includes(term);
        const matchCategoria = producto.categoryName?.toLowerCase().includes(term);
        const matchMarca = producto.marcaNombre?.toLowerCase().includes(term);
        return matchProducto || matchCodigo || matchCategoria || matchMarca;
      });
    }

    // Filtro por categoría seleccionada
    if (selectedCategory) {
      const cat = categories.find(c => (c.name || c.nombre) === selectedCategory);
      if (cat) {
        filtered = filtered.filter(p => p.categoryId === cat.id);
      }
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, categories]);

  // ✅ PAGINACIÓN CLIENT-SIDE
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const productos = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Obtener URL de primera imagen o null
  const getFirstImageUrl = (producto) => {
    // Luego intentar con campos individuales (orden: imagenPrincipal, imagen2, imagen3, imagen4)
    if (producto.imagenPrincipal) return producto.imagenPrincipal;
    if (producto.imagen2) return producto.imagen2;
    if (producto.imagen3) return producto.imagen3;
    if (producto.imagen4) return producto.imagen4;
    
    return null;
  };

  // Skeleton loader mientras carga inicialmente
  if (isLoading && !productsData) {
    return (
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
              Productos Disponibles
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gestiona los productos que se mostrarán en la página principal
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 shadow-sm animate-pulse">
              <div className="w-full pt-[100%] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 uppercase tracking-wide">
            Productos Disponibles
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona los productos  que se mostrarán en la página principal
          </p>
        </div>
        
        {/* Botón de Refresh */}
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
          disabled={isFetching}
        >
          <span className={`material-symbols-outlined text-[20px] ${isFetching ? 'animate-spin' : ''}`}>
            {isFetching ? 'progress_activity' : 'refresh'}
          </span>
          <span className="font-medium">Actualizar</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            className="bg-white border border-gray-300 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full pl-11 p-3 placeholder-slate-400 transition-all font-mono shadow-sm"
            placeholder="BUSCAR PRODUCTOS..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="bg-white border border-gray-300 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 p-3 cursor-pointer font-mono shadow-sm uppercase tracking-wide min-w-[200px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">TODAS LAS CATEGORÍAS</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.nombre || cat.name || ''}>
              {(cat.nombre || cat.name || 'Sin nombre').toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Contenedor de Productos */}
      <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
        {/* Header interno con paginación */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
        <div className="text-sm text-slate-600 font-mono">
            Mostrando <span className="font-bold">{productos.length}</span> de <span className="font-bold">{total}</span> productos
          </div>
          
          {/* Paginación */}
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">west</span>
            </button>
            
            {/* Páginas */}
            {(() => {
              const maxVisiblePages = 5; // Mostrar máximo 5 números de página
              let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              
              // Ajustar startPage si estamos cerca del final
              if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }
              
              const pages = [];
              
              // Botón primera página si no está visible
              if (startPage > 1) {
                pages.push(
                  <button 
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(<span key="start-ellipsis" className="px-2 text-gray-400 text-xs">...</span>);
                }
              }
              
              // Páginas visibles
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${
                      currentPage === i 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              
              // Botón última página si no está visible
              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="end-ellipsis" className="px-2 text-gray-400 text-xs">...</span>);
                }
                pages.push(
                  <button 
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return pages;
            })()}
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">east</span>
            </button>
          </nav>
        </div>

        {/* Grid de productos */}
        <div className="p-6">
          {productos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No se encontraron productos con imágenes</p>
              <p className="text-slate-400 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => {
                const imageUrl = getFirstImageUrl(producto);
                const hasImage = imageUrl !== null;
                
                return (
                  <article 
                    key={producto.id} 
                    onClick={() => hasImage && setSelectedProduct(producto)}
                    className={`group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full ${
                      hasImage ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {imageUrl && (
                      <div className="relative w-full pt-[100%] overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center p-2 bg-gray-50">
                          <img 
                            alt={producto.producto || 'Producto'} 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            src={imageUrl}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {producto.categoryName || 'Sin categoría'}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3">
                        {producto.producto || 'Sin nombre'}
                      </h3>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                        <span className="text-base font-bold text-gray-900">
                          {producto.marcaNombre || 'Sin marca'}
                        </span>
                        {hasImage && (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">
                            Ver Más
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle del Producto */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductosDestacados;
