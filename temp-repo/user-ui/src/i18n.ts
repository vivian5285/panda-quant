import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import enTranslation from './i18n/locales/en/translation.json';
import zhTranslation from './i18n/locales/zh/translation.json';
import koTranslation from './i18n/locales/ko/translation.json';

// 定义支持的语言类型
export const supportedLngs = ['en', 'zh', 'ko'] as const;
export type SupportedLng = typeof supportedLngs[number];

// 语言名称映射
export const languageNames: Record<SupportedLng, string> = {
  en: 'English',
  zh: '中文',
  ko: '한국어'
};

const resources = {
  en: { translation: enTranslation },
  zh: { translation: zhTranslation },
  ko: { translation: koTranslation }
};

// 初始化 i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng: 'en',
    lng: localStorage.getItem('i18nextLng') || 'zh',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        return value;
      }
    },
    returnObjects: true,
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
    debug: process.env.NODE_ENV === 'development',
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for languages: ${lngs.join(', ')}`);
      }
    },
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key}`);
      }
      return key;
    }
  });

// 语言切换工具函数
export const changeLanguage = (lng: SupportedLng) => {
  i18n.changeLanguage(lng);
};

// 获取当前语言
export const getCurrentLanguage = (): SupportedLng => {
  return (i18n.language as SupportedLng) || 'en';
};

// 监听语言变化
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng);
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.lang = lng;
  i18n.emit('loaded');
});

// 导出 i18n 实例
export default i18n; 