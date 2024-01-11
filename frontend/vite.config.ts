import { defineConfig } from 'vite'
import dns from "dns"
dns.setDefaultResultOrder("ipv4first")
import mkcert from'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), istanbul({
    cypress: true,
    requireEnv: false,
  }), mkcert()],
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
      '@contexts': '/src/contexts',
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
