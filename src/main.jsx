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

// Medir Core Web Vitals (LCP, FID, CLS) y métricas de paint
if (import.meta.env.PROD && 'performance' in window) {
  window.addEventListener('load', () => {
    try {
      // Observer para Largest Contentful Paint (LCP) y First Input Delay (FID)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`[Web Vitals] ${entry.entryType} - ${entry.name}: ${entry.startTime}ms`);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });
    } catch {
      // Fallback para navegadores sin soporte completo
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
