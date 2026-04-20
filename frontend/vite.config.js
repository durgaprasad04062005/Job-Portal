import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = env.VITE_API_URL || 'http://localhost:8082'

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: false,   // use next available port if 3000 is taken
      proxy: {
        // Proxy ALL /auth, /jobs, /profile, etc. to the backend
        // This avoids CORS issues entirely
        '/auth': { target: backendUrl, changeOrigin: true },
        '/jobs': { target: backendUrl, changeOrigin: true },
        '/profile': { target: backendUrl, changeOrigin: true },
        '/applications': { target: backendUrl, changeOrigin: true },
        '/student': { target: backendUrl, changeOrigin: true },
        '/employer': { target: backendUrl, changeOrigin: true },
        '/admin': { target: backendUrl, changeOrigin: true },
        '/notifications': { target: backendUrl, changeOrigin: true },
        '/dashboard': { target: backendUrl, changeOrigin: true },
        '/files': { target: backendUrl, changeOrigin: true },
        '/actuator': { target: backendUrl, changeOrigin: true },
      }
    }
  }
})
