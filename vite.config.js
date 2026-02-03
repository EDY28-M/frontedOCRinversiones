import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    // Generar nombres con hash para evitar problemas de caché
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Forzar recarga de assets
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1000,
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
  },
  preview: {
    port: 3000,
    host: true,
  },
})
