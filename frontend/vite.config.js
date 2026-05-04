import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Backend runs on http://localhost:8080 (Spring Boot default)
const BACKEND = 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/auth':          { target: BACKEND, changeOrigin: true },
      '/jobs':          { target: BACKEND, changeOrigin: true },
      '/profile':       { target: BACKEND, changeOrigin: true },
      '/applications':  { target: BACKEND, changeOrigin: true },
      '/student':       { target: BACKEND, changeOrigin: true },
      '/employer':      { target: BACKEND, changeOrigin: true },
      '/admin':         { target: BACKEND, changeOrigin: true },
      '/notifications': { target: BACKEND, changeOrigin: true },
      '/dashboard':     { target: BACKEND, changeOrigin: true },
      '/files':         { target: BACKEND, changeOrigin: true },
      '/actuator':      { target: BACKEND, changeOrigin: true },
    }
  }
})
