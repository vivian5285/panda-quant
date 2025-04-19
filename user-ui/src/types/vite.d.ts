declare module 'vite-plugin-compression' {
  import { Plugin } from 'vite'
  interface CompressionOptions {
    algorithm?: 'gzip' | 'brotliCompress' | 'deflate' | 'deflateRaw';
    ext?: string;
    threshold?: number;
    deleteOriginFile?: boolean;
    filter?: RegExp | ((file: string) => boolean);
  }
  export default function viteCompression(options?: CompressionOptions): Plugin
}

declare module 'vite-plugin-pwa' {
  import { Plugin } from 'vite'
  interface PWAPluginOptions {
    registerType?: 'autoUpdate' | 'prompt';
    includeAssets?: string[];
    manifest?: {
      name?: string;
      short_name?: string;
      description?: string;
      theme_color?: string;
      icons?: Array<{
        src: string;
        sizes: string;
        type: string;
      }>;
    };
  }
  export function VitePWA(options?: PWAPluginOptions): Plugin
}

declare module 'vite-plugin-svgr' {
  import { Plugin } from 'vite'
  interface SVGROptions {
    svgrOptions?: {
      icon?: boolean;
      ref?: boolean;
      svgo?: boolean;
      svgoConfig?: {
        plugins?: Array<{
          name: string;
          params?: Record<string, unknown>;
        }>;
      };
    };
  }
  export default function svgr(options?: SVGROptions): Plugin
}

declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite'
  interface ESLintOptions {
    include?: string | string[];
    exclude?: string | string[];
    cache?: boolean;
    fix?: boolean;
  }
  export default function eslint(options?: ESLintOptions): Plugin
}

declare module 'vite-plugin-checker' {
  import { Plugin } from 'vite'
  interface CheckerOptions {
    typescript?: boolean;
    eslint?: {
      lintCommand?: string;
    };
  }
  export default function checker(options?: CheckerOptions): Plugin
}

declare module 'vite-plugin-imagemin' {
  import { Plugin } from 'vite'
  interface ImageminOptions {
    gifsicle?: boolean;
    optipng?: boolean;
    mozjpeg?: boolean;
    pngquant?: boolean;
    svgo?: boolean;
  }
  export function imagemin(options?: ImageminOptions): Plugin
} 