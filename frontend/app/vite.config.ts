import fukictPlugin from '@fukict/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [fukictPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        // 保留 /api 前缀，因为后端路由是 /api/workspaces
      },
    },
  },
})
