import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 当前仓库使用自定义域名 berrybluegel.me，因此资源从根路径加载。
  base: '/',
  plugins: [react()],
})
