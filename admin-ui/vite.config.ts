import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/locales/*',
          dest: 'locales'
        }
      ]
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Panda Quant Admin',
        short_name: 'PandaQuantAdmin',
        description: 'Panda Quant Trading Platform Admin',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    svgr(),
    eslint({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules'],
      cache: false,
      fix: true,
      failOnError: false,
      emitWarning: true,
      emitError: true,
      formatter: 'stylish',
    }),
  ],
  server: {
    port: 3004,
    host: 'localhost',
    open: true,
    hmr: {
      clientPort: 3004,
      timeout: 120000,
      overlay: false
    },
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval'; object-src 'self'"
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
}) 