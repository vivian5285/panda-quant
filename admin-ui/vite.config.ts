import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'
import eslint from 'vite-plugin-eslint'
import checker from 'vite-plugin-checker'
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
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
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
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@mui/icons-material',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'react-router-dom',
      'i18next',
      'react-i18next',
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
    'process.env': {},
    'global': 'window'
  }
}) 