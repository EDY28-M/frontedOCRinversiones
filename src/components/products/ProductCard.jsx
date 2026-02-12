import { memo, useState, useCallback } from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { getFirstValidImageUrl, getAllValidImageUrls } from '../../utils/imageUtils';

/**
 * ProductCard optimizado con:
 * - React.memo para evitar re-renders innecesarios
 * - useCallback para handlers memoizados
 * - OptimizedImage para carga eficiente de imágenes
 * - Validación de URLs de imagen con fallback automático
 * - Comparación profunda de props
 */
const ProductCard = memo(({ product, onProductClick, priority = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImagesFailed, setAllImagesFailed] = useState(false);

  // Helper to remove code from title (always public view here)
  const getDisplayTitle = () => {
    if (!product?.producto) return 'Sin nombre';
    if (!product.codigo) return product.producto;

    try {
      // Escape special chars
      const escapedCode = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\s*\\(?${escapedCode}\\)?`, 'gi');
      return product.producto.replace(pattern, '').trim();
    } catch (e) {
      return product.producto;
    }
  };

  // Obtener todas las URLs válidas (pre-validadas por formato)
  const validImageUrls = getAllValidImageUrls(product);
  const imageUrl = validImageUrls[currentImageIndex] || null;

  // Memoizar handler de click
  const handleClick = useCallback(() => {
    if (onProductClick) {
      onProductClick(product);
    }
  }, [onProductClick, product]);

  // Handler de error de imagen: intenta la siguiente imagen válida
  const handleImageError = useCallback(() => {
    if (currentImageIndex < validImageUrls.length - 1) {
      // Intentar con la siguiente imagen válida
      setCurrentImageIndex(prev => prev + 1);
    } else {
      // Todas las imágenes fallaron
      setAllImagesFailed(true);
    }
  }, [currentImageIndex, validImageUrls.length]);

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
          {!allImagesFailed && imageUrl ? (
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
          {getDisplayTitle()}
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
