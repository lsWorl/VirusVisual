import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {//设置代理解决跨域问题
    proxy: {
      '/api':
      {
        target: "https://c.m.163.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/,'')
      }
    }
  }
})
