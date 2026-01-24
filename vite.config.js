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
    // Configuración del servidor de desarrollo
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
