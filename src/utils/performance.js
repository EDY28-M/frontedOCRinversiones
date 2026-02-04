/**
 * Utilidades de performance para la aplicación
 * Métricas, profiling y optimizaciones
 */

// Nombres de métricas Web Vitals
const WEB_VITALS = {
  LCP: 'largest-contentful-paint',      // Largest Contentful Paint
  FID: 'first-input-delay',             // First Input Delay
  CLS: 'layout-shift',                   // Cumulative Layout Shift
  FCP: 'first-contentful-paint',        // First Contentful Paint
  TTFB: 'navigation',                    // Time to First Byte
  INP: 'interaction',                    // Interaction to Next Paint
};

/**
 * Mide una métrica Web Vital
 */
export function measureWebVital(metricName, onReport) {
  if (!('PerformanceObserver' in window)) return;

  const entryType = WEB_VITALS[metricName];
  if (!entryType) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const value = entry.processingStart 
          ? entry.processingStart - entry.startTime 
          : entry.startTime;
        
        onReport({
          name: entry.name || metricName,
          value,
          rating: getRating(metricName, value),
          entry,
        });
      });
    });

    observer.observe({ entryTypes: [entryType] });
    return () => observer.disconnect();
  } catch (e) {
    console.warn(`[Performance] No se pudo medir ${metricName}:`, e);
  }
}

/**
 * Obtiene la clasificación de una métrica
 */
function getRating(metricName, value) {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
    INP: { good: 200, poor: 500 },
  };

  const threshold = thresholds[metricName];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Reporta todas las métricas Web Vitals
 */
export function reportWebVitals(onReport) {
  Object.keys(WEB_VITALS).forEach((metric) => {
    measureWebVital(metric, onReport);
  });
}

/**
 * Mide el tiempo de ejecución de una función
 */
export function measureExecutionTime(name, fn, ...args) {
  if (import.meta.env.PROD) return fn(...args);

  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  
  console.log(`[Performance] ${name} tomó ${(end - start).toFixed(2)}ms`);
  
  return result;
}

/**
 * Mide el tiempo de una operación asíncrona
 */
export async function measureAsyncExecutionTime(name, fn, ...args) {
  if (import.meta.env.PROD) return fn(...args);

  const start = performance.now();
  const result = await fn(...args);
  const end = performance.now();
  
  console.log(`[Performance] ${name} tomó ${(end - start).toFixed(2)}ms`);
  
  return result;
}

/**
 * Debounce para funciones de alto costo
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle para funciones de alto costo
 */
export function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * RAF throttle para animaciones
 */
export function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Mide el tamaño del bundle
 */
export function measureBundleSize() {
  if (!performance.getEntriesByType) return null;

  const resources = performance.getEntriesByType('resource');
  const jsResources = resources.filter((r) => r.name.endsWith('.js'));
  const cssResources = resources.filter((r) => r.name.endsWith('.css'));
  
  const totalJS = jsResources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
  const totalCSS = cssResources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
  
  return {
    jsFiles: jsResources.length,
    cssFiles: cssResources.length,
    totalJS: formatBytes(totalJS),
    totalCSS: formatBytes(totalCSS),
    total: formatBytes(totalJS + totalCSS),
  };
}

/**
 * Formatea bytes a unidades legibles
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Precarga un componente o recurso
 */
export function prefetchResource(url, as = 'script') {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Precarga con prioridad alta (para recursos críticos)
 */
export function preloadResource(url, as = 'script', type = null) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  if (type) link.type = type;
  document.head.appendChild(link);
}

/**
 * Verifica si el navegador soporta una característica
 */
export function supportsFeature(feature) {
  const features = {
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
    mutationObserver: 'MutationObserver' in window,
    webp: document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
    serviceWorker: 'serviceWorker' in navigator,
    webShare: 'share' in navigator,
    clipboard: 'clipboard' in navigator,
    networkInformation: 'connection' in navigator,
    deviceMemory: 'deviceMemory' in navigator,
    hardwareConcurrency: 'hardwareConcurrency' in navigator,
  };
  
  return features[feature] || false;
}

/**
 * Obtiene información del dispositivo
 */
export function getDeviceInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    memory: navigator.deviceMemory || 'unknown',
    cores: navigator.hardwareConcurrency || 'unknown',
    connection: connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    } : null,
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    language: navigator.language,
  };
}

/**
 * Optimiza imágenes automáticamente según capacidades del dispositivo
 */
export function getOptimalImageFormat() {
  if (supportsFeature('webp')) return 'webp';
  return 'jpeg';
}

/**
 * Determina si se debe cargar contenido pesado
 */
export function shouldLoadHeavyContent() {
  const info = getDeviceInfo();
  
  // No cargar en conexiones lentas o con saveData
  if (info.connection?.saveData) return false;
  if (info.connection?.effectiveType === '2g') return false;
  
  // No cargar en dispositivos con poca memoria
  if (info.memory && info.memory < 4) return false;
  
  return true;
}

/**
 * Lazy loader para intersection observer
 */
export function createLazyLoader(callback, options = {}) {
  if (!supportsFeature('intersectionObserver')) {
    // Fallback: cargar inmediatamente
    callback();
    return { observe: () => {}, unobserve: () => {} };
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: options.rootMargin || '50px',
    threshold: options.threshold || 0.01,
  });

  return {
    observe: (element) => observer.observe(element),
    unobserve: (element) => observer.unobserve(element),
    disconnect: () => observer.disconnect(),
  };
}
