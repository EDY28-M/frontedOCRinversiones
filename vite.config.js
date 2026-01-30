import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Generar nombres con hash para evitar problemas de caché
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Forzar recarga de assets
    assetsInlineLimit: 0,
  },
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces
    port: 5173,
    strictPort: true, // No cambiar de puerto automáticamente
    // Configuración del servidor de desarrollo
    headers: {
      'Cache-Control': 'no-store',
    },
    allowedHosts: [
      'kiara-unascendant-trustingly.ngrok-free.dev',
      '.ngrok-free.dev',
      '.ngrok.io',
      '.ngrok-free.app',
    ],
    // Proxy para redirigir peticiones /api al backend (evita Mixed Content)
    proxy: {
      '/api': {
        target: 'http://localhost:5095',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
