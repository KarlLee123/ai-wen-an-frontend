import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/chat': {
        target: 'https://qianwen-ai-production.up.railway.app',
        changeOrigin: true,
        secure: true  // HTTPS 必须加
      }
    }
  }
})
