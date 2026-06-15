import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          firebase: ['firebase/app', 'firebase/auth'],
          charts: ['recharts'],
          maps: ['leaflet', 'react-leaflet'],
          ui: ['framer-motion', 'swiper', 'sweetalert2'],
        },
      },
    },
  },
})
