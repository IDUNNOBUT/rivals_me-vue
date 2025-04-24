import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import analyzer from 'vite-bundle-analyzer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    analyzer(),
    svgLoader({
      defaultImport: 'component',
      svgo: false,
    })
  ],
})
