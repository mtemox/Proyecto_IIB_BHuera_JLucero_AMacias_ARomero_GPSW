import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Define las diferentes "páginas" o puntos de entrada de tu extensión
        popup: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.js'),
        content_script: resolve(__dirname, 'src/content-script.js'),
      },
      output: {
        // Asegúrate de que los nombres de los archivos de salida sean predecibles
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      }
    }
  }
})