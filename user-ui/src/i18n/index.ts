import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

// 检查是否已经初始化
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enTranslation,
        },
        zh: {
          translation: zhTranslation,
        },
      },
      lng: 'zh', // 默认语言
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      debug: process.env.NODE_ENV === 'development',
      returnObjects: true, // 允许返回对象
      react: {
        useSuspense: false,
      },
      // 添加默认命名空间
      defaultNS: 'translation',
      // 添加命名空间列表
      ns: ['translation'],
    });
}

export default i18n; 