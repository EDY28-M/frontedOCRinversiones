import ProductCard from './ProductCard.jsx';

const ProductsGrid = ({
  products,
  isLoading,
  isError,
  error,
  refetch,
  total,
  onProductClick
}) => {
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

  // Grid de productos - 4x4 responsive
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
      ))}
    </div>
  );
};

export default ProductsGrid;