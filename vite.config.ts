import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(), viteCompression({ ext: "br", algorithm: "brotliCompress", deleteOriginFile: true, threshold: 10})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[hash].js`,
        chunkFileNames: `assets/[hash].js`,
        assetFileNames: `assets/[hash].[ext]`,
        manualChunks: () => 'everything.js',
      },
    }
  }
})
