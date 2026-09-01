import { memo, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from '../common/OptimizedImage';
import { getAllValidImageUrls } from '../../utils/imageUtils';
import { getProductUrl } from '../../utils/slugUtils';
import { matchingFichaRows } from '../../utils/fichaTecnica';

/**
 * ProductCard
 * - The card is a real <Link> so Googlebot can crawl each product sheet
 * - Previsualizar opens the modal without leaving the catalog
 */
const ProductCard = memo(({ product, onPreviewClick, priority = false, searchQuery = '' }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImagesFailed, setAllImagesFailed] = useState(false);
  const fichaHits = useMemo(
    () => matchingFichaRows(product?.fichaTecnica, searchQuery),
    [product?.fichaTecnica, searchQuery]
  );

  const getDisplayTitle = () => {
    if (!product?.producto) return 'Sin nombre';
    if (!product.codigo) return product.producto;

    try {
      const escapedCode = product.codigo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\s*\\(?${escapedCode}\\)?`, 'gi');
      return product.producto.replace(pattern, '').trim();
    } catch {
      return product.producto;
    }
  };

  const validImageUrls = getAllValidImageUrls(product);
  const imageUrl = validImageUrls[currentImageIndex] || null;
  const productUrl = getProductUrl(product);
  const title = getDisplayTitle();

  const handlePreviewClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPreviewClick) {
      onPreviewClick(product);
    }
  }, [onPreviewClick, product]);

  const handleImageError = useCallback(() => {
    if (currentImageIndex < validImageUrls.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setAllImagesFailed(true);
    }
  }, [currentImageIndex, validImageUrls.length]);

  return (
    <article className="group bg-white rounded-lg border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full">
      <Link to={productUrl} className="flex flex-col h-full text-inherit no-underline">
        <div className="relative w-full pt-[100%] overflow-hidden bg-gray-50">
          <div className="absolute inset-0 flex items-center justify-center p-2">
            {!allImagesFailed && imageUrl ? (
              <OptimizedImage
                src={imageUrl}
                alt={product.producto || title}
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
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow border-t border-gray-50 bg-white">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {product.categoryName || 'Sin categoría'}
          </p>
          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-3 line-clamp-2">
            {title}
          </h3>
          {fichaHits.length > 0 && (
            <dl className="mb-3 space-y-1">
              {fichaHits.map((row, index) => (
                <div key={`${row.label}-${index}`} className="text-[11px] leading-snug text-slate-600 truncate">
                  {row.label ? (
                    <dt className="inline font-semibold uppercase tracking-wide text-slate-500">
                      {row.label}
                    </dt>
                  ) : null}
                  {row.label && row.value ? <span className="text-slate-300"> · </span> : null}
                  {row.value ? <dd className="inline">{row.value}</dd> : null}
                </div>
              ))}
            </dl>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide truncate">
              {product.marcaNombre || 'Sin marca'}
            </span>
            {onPreviewClick && (
              <button
                type="button"
                className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-3 py-2 rounded uppercase tracking-wide transition-colors shadow-sm shrink-0"
                onClick={handlePreviewClick}
              >
                Previsualizar
              </button>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.isActive === nextProps.product.isActive &&
    prevProps.product.isFeatured === nextProps.product.isFeatured &&
    prevProps.product.fichaTecnica === nextProps.product.fichaTecnica &&
    prevProps.onPreviewClick === nextProps.onPreviewClick &&
    prevProps.priority === nextProps.priority &&
    prevProps.searchQuery === nextProps.searchQuery
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
