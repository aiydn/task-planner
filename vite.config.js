import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"
import { VitePWA } from 'vite-plugin-pwa'

// export default defineConfig({
// 	plugins: [vue(), viteSingleFile()],
// })

export default defineConfig({
  plugins: [
    vue(), 
    VitePWA({ registerType: 'promt' })
  ]
})