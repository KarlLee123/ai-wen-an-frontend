// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 所有以 /chat 开头的请求，都代理到后端 8080 端口
      '/chat': {
        target: 'http://localhost:8080', // 你的 Spring Boot 端口
        changeOrigin: true, // 修改请求头中的 Origin 为 target
        rewrite: (path) => path, // 保持路径不变（/chat/xxx → /chat/xxx）
      },
    },
  },
})
