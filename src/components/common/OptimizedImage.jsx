import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { isValidImageUrl } from '../../utils/imageUtils';

/**
 * Componente de imagen optimizado con:
 * - Lazy loading nativo + IntersectionObserver
 * - Placeholder mientras carga
 * - Manejo de errores con validación de URL
 * - Intersection Observer para cargar solo cuando es visible
 */
const OptimizedImage = memo(({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  errorClassName = '',
  width,
  height,
  loading = 'lazy',
  decoding = 'async',
  priority = false,
  onLoad,
  onError,
  objectFit = 'cover',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!isValidImageUrl(src)); // Pre-validar URL
  const [isInView, setIsInView] = useState(priority || false);
  const imgRef = useRef(null);

  // Efecto para manejar el estado inicial de isInView
  useEffect(() => {
    if (priority || loading !== 'lazy') {
      setIsInView(true);
    }
  }, [priority, loading]);

  // Intersection Observer para lazy loading manual
  useEffect(() => {
    if (isInView || priority || loading !== 'lazy') {
      return;
    }

    const element = imgRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isInView, priority, loading]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Estilos para el contenedor
  const containerStyle = {
    position: 'relative',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
  };

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`flex items-center justify-center bg-gray-100 ${errorClassName} ${className}`}
        style={containerStyle}
        {...props}
      >
        <span className="material-symbols-outlined text-gray-400 text-4xl">broken_image</span>
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative ${className}`}
      style={containerStyle}
      {...props}
    >
      {/* Placeholder / Skeleton */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${placeholderClassName}`}
          style={{ animationDuration: '1.5s' }}
        />
      )}
      
      {/* Imagen real */}
      {isInView && src && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className="absolute inset-0"
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
