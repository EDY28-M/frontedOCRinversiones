import { useState } from 'react';

const ProductCard = ({ product, onProductClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFirstImageUrl = (producto) => {
    if (producto.imagenPrincipal) return producto.imagenPrincipal;
    if (producto.imagen2) return producto.imagen2;
    if (producto.imagen3) return producto.imagen3;
    if (producto.imagen4) return producto.imagen4;
    return null;
  };

  const imageUrl = getFirstImageUrl(product);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  return (
    <article
      key={product.id}
      onClick={handleClick}
      className={`group bg-white rounded-lg border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full ${onProductClick ? 'cursor-pointer' : ''}`}
    >
      {/* Imagen con aspect-ratio estable */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {!imageError ? (
            <img
              alt={product.producto || 'Producto'}
              className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
              src={imageUrl}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="material-symbols-outlined text-4xl text-gray-300">image</span>
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
          )}
          <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-primary shadow-sm border border-gray-100 transition-colors z-10">
            <span className="material-symbols-outlined text-[18px]">favorite</span>
          </button>
        </div>
      </div>

      {/* Info del producto */}
      <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {product.categoryName || 'Sin categoría'}
        </p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
          {product.producto || 'Sin nombre'}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-base font-bold text-gray-900">
            {product.marcaNombre || 'Sin marca'}
          </span>
          <button className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm">
            Ver Más
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;