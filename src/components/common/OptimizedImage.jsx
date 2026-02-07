import { memo, useState, useCallback, useEffect, useRef } from 'react';

// Cache global de imágenes ya cargadas para evitar re-descargas
const loadedImages = new Set();

/**
 * Componente de imagen optimizado con:
 * - Lazy loading nativo + IntersectionObserver con rootMargin amplio
 * - Placeholder mientras carga
 * - Manejo de errores con reintentos
 * - Cache de imágenes ya cargadas
 * - fetchpriority para imágenes above-the-fold
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
  // Si la imagen ya se cargó antes, mostrarla inmediatamente
  const alreadyCached = src ? loadedImages.has(src) : false;
  const [isLoaded, setIsLoaded] = useState(alreadyCached);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(alreadyCached);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const MAX_RETRIES = 2;

  // Efecto para manejar el estado inicial de isInView
  useEffect(() => {
    if (priority || loading !== 'lazy') {
      setIsInView(true);
    }
  }, [priority, loading]);

  // Intersection Observer para lazy loading manual
  useEffect(() => {
    // No observar si ya está en vista o es prioridad
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
        rootMargin: '400px', // Precargar 400px antes de ser visible para UX fluida
        threshold: 0.01,
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [isInView, priority, loading]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    if (src) loadedImages.add(src);
    onLoad?.();
  }, [onLoad, src]);

  const handleError = useCallback(() => {
    // Reintentar automáticamente hasta MAX_RETRIES veces
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      return;
    }
    setHasError(true);
    onError?.();
  }, [onError, retryCount, MAX_RETRIES]);

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
      {isInView && (
        <img
          src={retryCount > 0 ? `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}` : src}
          alt={alt}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
          className="absolute inset-0"
          width={width || undefined}
          height={height || undefined}
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
