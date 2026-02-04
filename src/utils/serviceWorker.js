/**
 * Utilidades para el Service Worker
 * Maneja registro, actualizaciones y comunicación con el SW
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    )
);

/**
 * Registra el service worker
 */
export function register(config) {
  if ('serviceWorker' in navigator) {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

    if (isLocalhost) {
      // En localhost, verificar que el SW existe antes de registrar
      checkValidServiceWorker(swUrl, config);
    } else {
      // En producción, registrar directamente
      registerValidSW(swUrl, config);
    }
  }
}

/**
 * Desregistra el service worker
 */
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Error unregistering service worker:', error);
      });
  }
}

/**
 * Registra el SW válido
 */
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('SW registered:', registration);

      // Manejar actualizaciones
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nuevo contenido disponible
              console.log('New content is available; please refresh.');
              
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              
              // Mostrar notificación al usuario
              showUpdateNotification(registration);
            } else {
              // Contenido cacheado por primera vez
              console.log('Content is cached for offline use.');
              
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

/**
 * Verifica que el SW sea válido en localhost
 */
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No se encontró el SW, probablemente en modo desarrollo
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // SW encontrado, proceder con registro
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

/**
 * Muestra notificación de actualización disponible
 */
function showUpdateNotification(registration) {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = 'sw-update-notification';
  notification.innerHTML = `
    <div class="sw-update-content">
      <span>🎉 Nueva versión disponible</span>
      <button id="sw-update-btn">Actualizar</button>
      <button id="sw-dismiss-btn">Más tarde</button>
    </div>
  `;
  
  // Estilos inline para asegurar visibilidad
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0056b3;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Manejar clicks
  document.getElementById('sw-update-btn').addEventListener('click', () => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  });
  
  document.getElementById('sw-dismiss-btn').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remover después de 10 segundos
  setTimeout(() => {
    notification.remove();
  }, 10000);
}

/**
 * Fuerza la actualización del service worker
 */
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

/**
 * Verifica si la app está en modo offline
 */
export function isOffline() {
  return !navigator.onLine;
}

/**
 * Agrega listener para cambios de estado de conexión
 */
export function addConnectionListener(callbacks) {
  const { onOnline, onOffline } = callbacks;
  
  window.addEventListener('online', () => {
    console.log('App is online');
    onOnline?.();
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline');
    onOffline?.();
  });
}

/**
 * Precachea URLs específicas
 */
export function precacheUrls(urls) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve(true);
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        {
          type: 'CACHE_URLS',
          payload: { urls },
        },
        [channel.port2]
      );
    });
  }
  return Promise.resolve(false);
}
