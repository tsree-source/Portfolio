import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the production build can be served from any path
  // (root domain, project sub-path, or opened directly from disk).
  base: './',
  plugins: [react(), tailwindcss()],
})
