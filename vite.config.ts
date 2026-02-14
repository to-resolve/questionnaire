import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // '/api': 'http://localhost:3000',
      // '/api': 'http://localhost:8080',
      '/api': {
        target: 'http://localhost:8080', // 后端服务器地址
        changeOrigin: true, // 开启跨域（关键！必须设为true）
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径（可选）
        // 示例：前端请求 /api/user → 转发到 http://localhost:8080/user
      },
      '/upload': 'http://localhost:3000',
    },
  },
})
