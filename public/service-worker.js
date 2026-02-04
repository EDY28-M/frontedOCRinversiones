/**
 * Service Worker para ORC Inversiones
 * Estrategia: Cache First, Network Fallback
 * Proporciona soporte offline y carga rápida
 */

const CACHE_NAME = 'orc-inversiones-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/imagenes OC/1.jpeg',
];

// Schemas que nunca deben ser interceptados
const UNSUPPORTED_SCHEMES = [
  'chrome-extension://',
  'chrome://',
  'edge://',
  'brave://',
  'file://',
  'data:',
  'blob:',
  'javascript:',
  'about:',
];

// Assets que nunca deben cachear
const NEVER_CACHE = [
  /\/api\//,
  /\.mp4$/,
  /\.webm$/,
];

/**
 * Verifica si el esquema de la URL es soportado para cache
 */
function isSupportedScheme(url) {
  return UNSUPPORTED_SCHEMES.every(scheme => !url.startsWith(scheme));
}

/**
 * Verifica si una URL es válida para cachear
 */
function isValidForCache(url) {
  // Solo cachear URLs HTTP/HTTPS
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  return true;
}

// Instalación: Precachear assets estáticos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error('[SW] Precache failed:', err);
      })
  );
  
  // Activar inmediatamente
  self.skipWaiting();
});

// Activación: Limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch: Estrategia de caché
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = request.url;
  
  // Ignorar requests no-HTTP/HTTPS (extensiones, etc.)
  if (!isSupportedScheme(url) || !isValidForCache(url)) {
    return;
  }
  
  // No interceptar requests que no deben cachear
  if (shouldNotCache(url)) {
    return;
  }
  
  // Estrategia diferente según el tipo de request
  if (isAPIRequest(url)) {
    // API: Network First, Cache Fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (isImageRequest(url)) {
    // Imágenes: Cache First, Network Fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (isStaticAsset(url)) {
    // Assets estáticos: Cache First
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Default: Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Helpers
function shouldNotCache(url) {
  return NEVER_CACHE.some((pattern) => pattern.test(url));
}

function isAPIRequest(url) {
  return url.includes('/api/');
}

function isImageRequest(url) {
  return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url);
}

function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|eot)$/i.test(url);
}

// Estrategias de caché

/**
 * Cache First: Busca en caché primero, si no está, fetch y guarda en caché
 * Ideal para assets estáticos e imágenes
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Actualizar caché en background (stale-while-revalidate)
    fetchAndCache(request, cache).catch(() => {});
    return cachedResponse;
  }
  
  return fetchAndCache(request, cache);
}

/**
 * Network First: Intenta fetch primero, si falla, usa caché
 * Ideal para API calls
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, falling back to cache');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate: Usa caché inmediatamente, actualiza en background
 * Balance entre velocidad y frescura
 */
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      return cachedResponse;
    });
  
  return cachedResponse || fetchPromise;
}

/**
 * Fetch y guarda en caché
 */
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Fetch failed:', error);
    throw error;
  }
}

// Manejo de mensajes desde la aplicación
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_URLS') {
    const { urls } = event.data.payload;
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urls))
      .then(() => {
        event.ports[0].postMessage({ success: true });
      });
  }
});

// Sincronización en background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered');
    // Aquí se pueden sincronizar datos pendientes
  }
});

// Notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      data: data.url,
    });
  }
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && self.clients) {
    event.waitUntil(
      self.clients.openWindow(event.notification.data)
    );
  }
});
