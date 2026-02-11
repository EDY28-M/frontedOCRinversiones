import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { readFileSync, copyFileSync } from 'fs'

// Leer versión del package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion = packageJson.version || '0.0.0'

// Plugin para copiar index.html como 404.html para Cloudflare Pages SPA routing
const copy404Plugin = () => ({
  name: 'copy-404',
  closeBundle() {
    try {
      copyFileSync('dist/index.html', 'dist/404.html');
      console.log('✓ Copied index.html to 404.html for SPA routing');
    } catch (err) {
      console.warn('Could not copy 404.html:', err.message);
    }
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Base URL - rutas absolutas para evitar problemas de MIME type
  base: '/',
  plugins: [
    react({
      // Optimizaciones de Babel para React
      babel: {
        plugins: [
          // Optimización para styled-components si se usa en el futuro
          // ['babel-plugin-styled-components', { displayName: mode === 'development' }]
        ],
      },
    }),
    // Análisis de bundle solo en modo análisis
    mode === 'analyze' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
    // Copiar 404.html para SPA routing en Cloudflare Pages
    copy404Plugin(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    manifest: true,
    minify: 'esbuild',
    // Target moderno para menos polyfills
    target: 'es2020',
    // Optimizaciones de CSS
    cssMinify: true,
    cssCodeSplit: true,
    // Configuración avanzada de chunks
    rollupOptions: {
      output: {
        // Estrategia de code splitting manual
        manualChunks: {
          // React y React DOM en chunk separado
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // React Query en chunk separado
          'query-vendor': ['@tanstack/react-query'],
          // Utilidades
          'utils': ['axios'],
        },
        // Nombres de archivos con hash para caché eficiente
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organizar assets por tipo
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    // Inline assets pequeños para reducir requests HTTP
    assetsInlineLimit: 4096, // 4KB
    // Límite de advertencia para chunks
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales
    reportCompressedSize: false, // Más rápido
    emptyOutDir: true,
  },
  resolve: {
    // Evitar múltiples copias de React (previene "Invalid hook call")
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    // Pre-bundle de dependencias para desarrollo más rápido
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
    ],
    // Excluir dependencias problemáticas si las hay
    exclude: [],
  },
  esbuild: {
    // Eliminar console.log y debugger en producción
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Pure annotations para tree shaking
    pure: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
  },
  server: {
    host: true, // Escuchar en todas las interfaces (0.0.0.0) para HMR correcto
    port: 5173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    allowedHosts: [
      'localhost',
      'kiara-unascendant-trustingly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok-free.app',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5095',
        changeOrigin: true,
        secure: false,
      },
    },
    // HMR auto-detecta el host desde la URL del navegador
    hmr: {
      overlay: true,
    },
    // Pre-bundle en caliente para desarrollo más rápido
    warmup: {
      clientFiles: ['./src/main.jsx', './src/App.jsx'],
    },
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: [
      'frontedocrinversiones.onrender.com',
      '.onrender.com',
      'orcinversionesperu.com',
      'www.orcinversionesperu.com',
      'frontedocrinversiones.orcinversionespe.workers.dev',
    ],
  },
  // Definir variables de entorno para el cliente
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
}))
