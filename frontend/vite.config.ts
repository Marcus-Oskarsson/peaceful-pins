import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from "dns"
dns.setDefaultResultOrder("ipv4first")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@styles': '/src/styles',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@assets': '/src/assets',
      '@services': '/src/services',
      '@types': '/src/types/index',
      '@hooks': '/src/hooks',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
