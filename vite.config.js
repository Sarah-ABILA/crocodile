import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Crocodile',
        short_name: 'Crocodile',
        description: 'Qui paye la tournée ?',
        theme_color: '#0a1f12',
        background_color: '#0a1f12',
        display: 'standalone',
        icons: [
          {
            src: 'https://fakeimg.pl/192x192/1D9E75/ffffff?text=🐊',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://fakeimg.pl/512x512/1D9E75/ffffff?text=🐊',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
