import { useState, useEffect } from 'react';
import { productService, categoryService } from '../../../services/productService';

const ProductosDestacados = () => {
  const [productos, setProductos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories()
      ]);
      
      // Ordenar productos: primero los que tienen imagen
      const sortedProducts = productsData.sort((a, b) => {
        const aHasImage = a.imagenes && a.imagenes.length > 0;
        const bHasImage = b.imagenes && b.imagenes.length > 0;
        if (aHasImage && !bHasImage) return -1;
        if (!aHasImage && bHasImage) return 1;
        return 0;
      });
      
      setProductos(sortedProducts);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de productos
  const filteredProducts = productos.filter(producto => {
    // Filtro por categoría
    if (selectedCategory) {
      const productCategory = producto.categoryName || producto.categoria || producto.category?.nombre || producto.category;
      if (productCategory !== selectedCategory) {
        return false;
      }
    }
    
    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchCodigo = producto.codigo?.toString().toLowerCase().includes(term);
      const matchCodigoComer = producto.codigoComer?.toString().toLowerCase().includes(term);
      const matchProducto = producto.producto?.toLowerCase().includes(term);
      const matchMarca = producto.marcaNombre?.toLowerCase().includes(term);
      const matchCategoria = (producto.categoryName || producto.categoria || producto.category?.nombre || producto.category)?.toLowerCase().includes(term);
      
      if (!matchCodigo && !matchCodigoComer && !matchProducto && !matchMarca && !matchCategoria) {
        return false;
      }
    }
    
    return true;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Obtener URL de primera imagen o null
  const getFirstImageUrl = (producto) => {
    if (producto.imagenes && producto.imagenes.length > 0) {
      return producto.imagenes[0].url || producto.imagenes[0].imagenUrl;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando productos...</p>
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
            Productos Destacados
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gestiona los productos destacados que se mostrarán en la página principal
          </p>
        </div>
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
            Mostrando <span className="font-bold">{paginatedProducts.length}</span> de <span className="font-bold">{filteredProducts.length}</span> productos
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
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            {totalPages > 3 && <span className="px-2 text-gray-400 text-xs">...</span>}
            
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
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No se encontraron productos</p>
              <p className="text-slate-400 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((producto) => {
                const imageUrl = getFirstImageUrl(producto);
                
                return (
                  <article key={producto.id} className="group bg-white rounded-lg border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col h-full">
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
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">
                          Ver Más
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductosDestacados;
