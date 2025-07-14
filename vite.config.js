import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available at runtime
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://127.0.0.1:8000'),
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  publicDir: 'public',
  preview: {
    allowedHosts: ['www.clarifi.nl']
  }
})
