import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
// import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'robots.txt', '**/*.{js,css,html,ico,png,svg}'],
    //   manifest: {
    //     name: 'Panda Quant User',
    //     short_name: 'PandaQuant',
    //     description: 'Panda Quant Trading Platform',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
    svgr(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
      '@services': resolve(__dirname, './src/services'),
      '@noble/hashes/_sha2': resolve(__dirname, 'node_modules/@noble/hashes/esm/_sha2.js'),
    },
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled', '@emotion/is-prop-valid'],
  },
  server: {
    port: 3003,
    host: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
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
            if (id.includes('chart.js') || id.includes('recharts')) {
              return 'chart-vendor';
            }
            if (id.includes('web3') || id.includes('ethers') || id.includes('viem') || id.includes('wagmi')) {
              return 'web3-vendor';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
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
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production'),
    },
    'global': 'window',
    '__REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    })
  },
  mode: 'production',
  ssr: {
    noExternal: ['@vitejs/plugin-react']
  }
}) 