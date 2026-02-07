// Exportaciones centralizadas de utilidades
// Facilita imports y permite tree shaking

// Formateo
export * from './formatters';

// Permisos
export * from './permissions';

// Imágenes - validación y utilidades
export * from './imageUtils';

// Service Worker
export {
  register,
  unregister,
  updateServiceWorker,
  isOffline,
  addConnectionListener,
  precacheUrls,
} from './serviceWorker';

// Performance
export * from './performance';
