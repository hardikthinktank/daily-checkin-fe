import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
  server: {
    // Dev server is tunneled through ngrok for external access/demoing.
    // Free-tier ngrok URLs rotate on every restart, so allow the whole
    // domain rather than hardcoding today's subdomain.
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev'],
  },
})
