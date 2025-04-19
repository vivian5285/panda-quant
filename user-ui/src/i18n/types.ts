import enTranslation from './locales/en/translation.json';

// 从英文翻译文件生成类型定义
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKeys = DeepKeys<typeof enTranslation>;

// 翻译键的命名空间
export type TranslationNamespaces = 'translation';

// 翻译函数的类型定义
export type TranslationFunction = (
  key: TranslationKeys,
  options?: {
    [key: string]: any;
  }
) => string; 