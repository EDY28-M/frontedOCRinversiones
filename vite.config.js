import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { readFileSync } from 'fs'

// Leer versión del package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const appVersion = packageJson.version || '0.0.0'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
  ],
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
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
    host: 'localhost',
    port: 5173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
    },
    allowedHosts: [
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
    // Optimizaciones de HMR
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
    ],
  },
  // Definir variables de entorno para el cliente
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
}))
