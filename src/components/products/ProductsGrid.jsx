import ProductCard from './ProductCard.jsx';

const ProductsGrid = ({
  products,
  isLoading,
  isFetching = false,
  isError,
  error,
  refetch,
  total,
  onProductClick,
  onPreviewClick,
}) => {
  // Loading inicial (sin datos)
  if (isLoading && products.length === 0) {
    return (
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
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4">error</span>
        <p className="text-gray-700 font-medium mb-2">Error al cargar productos</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded transition-colors text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Estado vacío
  if (!isLoading && !isError && products.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">inventory_2</span>
        <p className="text-gray-700 font-medium mb-2">No hay productos disponibles</p>
        <p className="text-gray-500 text-sm">Intenta con otros filtros de búsqueda</p>
      </div>
    );
  }

  // Grid de productos - con indicador de carga en background
  return (
    <div className="relative">
      {/* Barra de progreso sutil durante fetch en background */}
      {isFetching && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden z-10">
          <div className="h-full bg-blue-500 animate-[loading_1s_ease-in-out_infinite]" 
               style={{ width: '30%', animation: 'loading 1s ease-in-out infinite' }}></div>
        </div>
      )}
      
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onProductClick={onProductClick}
            onPreviewClick={onPreviewClick}
            priority={index < 4} /* Primeros 4 productos cargan inmediatamente */
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsGrid;