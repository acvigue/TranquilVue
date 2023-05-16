import { fileURLToPath, URL } from 'node:url'
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), nodePolyfills({
    protocolImports: true,
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
