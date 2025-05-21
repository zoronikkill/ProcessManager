import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Добавляем поддержку JSX в .js файлах
      include: '**/*.{jsx,js}'
    })
  ],
  server: {
    port: 5173,
    host: 'localhost'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
})
