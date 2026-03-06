<<<<<<< HEAD
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

=======
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
<<<<<<< HEAD
      '/api': {
        target: 'http://175.24.207.152:8080',  // 你的腾讯云 IP:端口（改成当前实际后端地址）
        changeOrigin: true,
        secure: false,  // http 目标用 false
        rewrite: (path) => path.replace(/^\/api/, '')  // /api/chat → /chat
=======
      '/chat': {
        target: 'http://175.24.207.152:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path  // 不改路径，/chat → /chat
>>>>>>> cb38d372b71530beaab1fb4fd1ab990c93a9120a
      }
    }
  }
})
