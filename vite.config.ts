import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/leetcode-5-longest-palindromic-substring/',
  server: {
    port: 63607,
  },
})
