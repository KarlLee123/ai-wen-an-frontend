// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/chat': {
        target: 'http://175.24.207.152:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path  // 不改路径，/chat → /chat
      }
    }
  }
})
