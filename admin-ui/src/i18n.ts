import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      zh: {
        translation: zhTranslation
      }
    },
    fallbackLng: 'zh',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      cookieOptions: {
        sameSite: 'strict'
      }
    },
    react: {
      useSuspense: false
    }
  });

export default i18n; 