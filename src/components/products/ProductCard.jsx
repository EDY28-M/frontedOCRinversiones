import { memo, useState, useCallback } from 'react';
import OptimizedImage from '../common/OptimizedImage';

/**
 * ProductCard optimizado con:
 * - React.memo para evitar re-renders innecesarios
 * - useCallback para handlers memoizados
 * - OptimizedImage para carga eficiente de imágenes
 * - Comparación profunda de props
 */
const ProductCard = memo(({ product, onProductClick, priority = false }) => {
  const [imageError, setImageError] = useState(false);

  // Memoizar función para obtener URL de imagen
  const getFirstImageUrl = useCallback((producto) => {
    if (producto.imagenPrincipal) return producto.imagenPrincipal;
    if (producto.imagen2) return producto.imagen2;
    if (producto.imagen3) return producto.imagen3;
    if (producto.imagen4) return producto.imagen4;
    return null;
  }, []);

  const imageUrl = getFirstImageUrl(product);

  // Memoizar handler de click
  const handleClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick, product]);

  // Memoizar handler de error de imagen
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <article
      onClick={handleClick}
      className={`group bg-white rounded-lg border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full ${onProductClick ? 'cursor-pointer' : ''}`}
      // Atributos de accesibilidad
      role={onProductClick ? 'button' : undefined}
      tabIndex={onProductClick ? 0 : undefined}
      onKeyDown={onProductClick ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      {/* Imagen con aspect-ratio estable usando OptimizedImage */}
      <div className="relative w-full pt-[100%] overflow-hidden bg-gray-50">
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {!imageError && imageUrl ? (
            <OptimizedImage
              src={imageUrl}
              alt={product.producto || 'Producto'}
              className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              objectFit="contain"
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
              onError={handleImageError}
              placeholderClassName="bg-gray-200"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <span className="material-symbols-outlined text-4xl">image</span>
              <span className="text-xs mt-2 text-gray-400">Sin imagen</span>
            </div>
          )}
          <button 
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white text-gray-300 hover:text-primary shadow-sm border border-gray-100 transition-colors z-10"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implementar favoritos
            }}
            aria-label="Agregar a favoritos"
          >
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
          <button 
            className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            Ver Más
          </button>
        </div>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // Comparación personalizada de props para evitar re-renders
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.isActive === nextProps.product.isActive &&
    prevProps.product.isFeatured === nextProps.product.isFeatured &&
    prevProps.onProductClick === nextProps.onProductClick &&
    prevProps.priority === nextProps.priority
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
