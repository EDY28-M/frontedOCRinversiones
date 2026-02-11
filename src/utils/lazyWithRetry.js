import { lazy } from 'react';

/**
 * Wrapper sobre React.lazy() que detecta errores de carga de chunk
 * (tras un deploy nuevo) y auto-recarga la página una sola vez.
 *
 * Problema: Después de un deploy, los hashes de los archivos JS cambian.
 * Si un usuario tiene la app abierta con el index.html viejo y navega,
 * React intenta cargar un chunk que ya no existe → el servidor devuelve
 * HTML (index.html) → "Unexpected token '<'" → pantalla blanca.
 *
 * Solución: Detectar el error, forzar un reload limpio una sola vez.
 */
export function lazyWithRetry(importFn) {
  return lazy(() =>
    importFn().catch((error) => {
      const errorMsg = error?.message || '';
      const isChunkError =
        errorMsg.includes('Failed to fetch dynamically imported module') ||
        errorMsg.includes('Unexpected token') ||
        errorMsg.includes('Loading chunk') ||
        errorMsg.includes('Loading CSS chunk') ||
        errorMsg.includes('Unable to preload CSS');

      if (isChunkError) {
        // Evitar loop infinito: solo recargar una vez
        const reloadKey = 'chunk-reload-timestamp';
        const lastReload = sessionStorage.getItem(reloadKey);
        const now = Date.now();

        // Si no se recargó en los últimos 10 segundos, recargar
        if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
          sessionStorage.setItem(reloadKey, now.toString());
          window.location.reload();
          // Devolver un componente vacío mientras recarga
          return { default: () => null };
        }
      }

      // Si no es error de chunk o ya se intentó recargar, propagar el error
      throw error;
    })
  );
}
