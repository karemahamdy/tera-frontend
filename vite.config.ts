import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    // Use polling to improve file-change detection on some Windows setups
    watch: {
      usePolling: true
    },
    // Explicit HMR settings
    hmr: {
      protocol: 'ws',
      // ensure client connects to local dev server
      host: 'localhost',
      // show overlay for errors
      overlay: true
    }
  },
  build: {
    reportCompressedSize: false
  }
})
