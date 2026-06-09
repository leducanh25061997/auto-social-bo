import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Đọc biến môi trường (.env*) để cấu hình proxy dev.
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_API_PROXY_TARGET ?? 'http://localhost:3000'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Path alias `@` -> ./src (đồng bộ với tsconfig)
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      // Forward '/api/*' sang backend để tránh CORS khi dev.
      // Khớp với VITE_API_BASE_URL='/api/v1'.
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
