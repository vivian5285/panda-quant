import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { splitVendorChunkPlugin } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Panda Quant User',
        short_name: 'PandaQuant',
        description: 'Panda Quant Trading Platform',
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
  ],
  base: '/',
  server: {
    port: 3003,
    host: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
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
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-is',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'chart.js',
      'react-chartjs-2',
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
    'global': 'window',
    '__REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    })
  }
}) 