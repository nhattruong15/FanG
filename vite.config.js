import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/vansao': {
        target: 'https://school.vansao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vansao/, '/openapi/api/v1'),
        secure: true,
      },
    },
  },
})
