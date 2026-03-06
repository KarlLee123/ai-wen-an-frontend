// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://175.24.207.152:8080',  // 你的腾讯云 IP:端口（改成当前实际后端地址）
        changeOrigin: true,
        secure: false,  // http 目标用 false
        rewrite: (path) => path.replace(/^\/api/, '')  // /api/chat → /chat
      }
    }
  }
})
