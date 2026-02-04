import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { register } from './utils/serviceWorker.js';

// Registrar Service Worker para PWA
// Esto habilita caché offline y mejora el rendimiento
register({
  onSuccess: (registration) => {
    console.log('✅ Service Worker registrado:', registration);
  },
  onUpdate: (registration) => {
    console.log('🔄 Nueva versión disponible:', registration);
  },
});

// Medir performance de la app
if (import.meta.env.PROD && 'performance' in window) {
  window.addEventListener('load', () => {
    // Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Enviar métricas a analytics si es necesario
        console.log(`[Web Vitals] ${entry.name}: ${entry.value}`);
      }
    });
    
    try {
      observer.observe({ entryTypes: ['web-vitals'] });
    } catch {
      // Fallback para navegadores sin soporte
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        console.log(`[Performance] ${entry.name}: ${entry.startTime}ms`);
      });
    }
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
