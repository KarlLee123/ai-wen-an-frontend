// vite.config.js （项目根目录，如果没有就新建）
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/chat': {
        target: 'http://175.24.207.152:8080',  // ← 这里改成你的腾讯云实际地址
        // 如果你绑定了域名，用 'https://api.yourdomain.com'（推荐）
        // target: 'https://your-domain.com',  
        changeOrigin: true,
        secure: false,  // 如果 target 是 http，设 false 避免 https 混用问题
        rewrite: (path) => path  // 保持 /chat 不变
      }
    }
  }
})
