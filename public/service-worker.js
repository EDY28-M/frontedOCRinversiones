/**
 * Service Worker para ORC Inversiones
 * Estrategia: Network First para JS/CSS, Cache First para imágenes
 * VERSIÓN 3: Más conservador para evitar errores de MIME type
 */

const CACHE_NAME = 'orc-inversiones-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
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
  /\.hot-update\./,
];

// Assets JS/CSS con hash - NO interceptar, dejar que el navegador maneje
const HASHED_ASSETS = /\/assets\/.*-[a-zA-Z0-9]{8,}\.(js|css)$/;

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

  // ⚠️ NO interceptar assets JS/CSS con hash - el navegador los maneja mejor
  // Esto evita errores de MIME type cuando el servidor devuelve HTML para rutas SPA
  if (HASHED_ASSETS.test(url)) {
    return;
  }
  
  // Solo interceptar navegación y recursos específicos
  if (request.mode === 'navigate') {
    // Navegación: Network First con fallback a index.html
    event.respondWith(navigationStrategy(request));
  } else if (isImageRequest(url)) {
    // Imágenes: Cache First
    event.respondWith(cacheFirstStrategy(request));
  }
  // Para todo lo demás (JS, CSS, etc.) - NO interceptar
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

function isHtmlResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('text/html');
}

function shouldBypassCachedResponse(request, cachedResponse) {
  const url = request.url;
  if ((isStaticAsset(url) || isImageRequest(url)) && isHtmlResponse(cachedResponse)) {
    return true;
  }
  return false;
}

function shouldCacheResponse(request, response) {
  if (!response || !response.ok) return false;
  const url = request.url;
  if ((isStaticAsset(url) || isImageRequest(url)) && isHtmlResponse(response)) {
    return false;
  }
  return true;
}

// Estrategias de caché

/**
 * Navigation Strategy: Network First, fallback a index.html cacheado
 * Ideal para SPA - siempre intenta network primero
 */
async function navigationStrategy(request) {
  try {
    // Siempre intentar network primero para navegación
    const networkResponse = await fetch(request);
    
    // Si es exitoso, cachear solo el index.html
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put('/index.html', networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Si falla la red, servir index.html cacheado (SPA fallback)
    console.log('[SW] Network failed for navigation, serving cached index.html');
    const cache = await caches.open(CACHE_NAME);
    const cachedIndex = await cache.match('/index.html');
    
    if (cachedIndex) {
      return cachedIndex;
    }
    
    // Si no hay caché, devolver error
    throw error;
  }
}

/**
 * Cache First: Busca en caché primero, si no está, fetch y guarda en caché
 * Ideal para assets estáticos e imágenes
 */
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    if (shouldBypassCachedResponse(request, cachedResponse)) {
      return fetchAndCache(request, cache);
    }
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
    
    if (shouldCacheResponse(request, networkResponse)) {
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
      if (shouldCacheResponse(request, networkResponse)) {
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
    
    if (shouldCacheResponse(request, networkResponse)) {
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
  if (event.data === 'skipWaiting' || event.data?.type === 'SKIP_WAITING') {
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
