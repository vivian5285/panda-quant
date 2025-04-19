declare module 'vite-plugin-compression' {
  import { Plugin } from 'vite'
  export default function viteCompression(options?: any): Plugin
}

declare module 'vite-plugin-pwa' {
  import { Plugin } from 'vite'
  export function VitePWA(options?: any): Plugin
}

declare module 'vite-plugin-svgr' {
  import { Plugin } from 'vite'
  export default function svgr(options?: any): Plugin
}

declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite'
  export default function eslint(options?: any): Plugin
}

declare module 'vite-plugin-checker' {
  import { Plugin } from 'vite'
  export default function checker(options?: any): Plugin
}

declare module 'vite-plugin-imagemin' {
  import { Plugin } from 'vite'
  export function imagemin(options?: any): Plugin
} 