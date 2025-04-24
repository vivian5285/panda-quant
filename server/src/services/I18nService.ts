import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

export class I18nService {
  private static instance: I18nService;
  private translations: Record<string, any> = {};
  private currentLocale: string = 'zh';

  private constructor() {
    this.loadTranslations();
  }

  public static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  private loadTranslations() {
    try {
      const locales = ['zh', 'en'];
      for (const locale of locales) {
        const filePath = join(__dirname, `../../locales/${locale}.json`);
        this.translations[locale] = JSON.parse(readFileSync(filePath, 'utf-8'));
      }
      logger.info('Translations loaded successfully');
    } catch (error) {
      logger.error('Error loading translations:', error);
      throw error;
    }
  }

  public setLocale(locale: string): void {
    if (this.translations[locale]) {
      this.currentLocale = locale;
      logger.info(`Locale changed to ${locale}`);
    } else {
      logger.warn(`Locale ${locale} not found, keeping current locale`);
    }
  }

  public t(key: string, params?: Record<string, any>): string {
    try {
      const translation = this.translations[this.currentLocale][key];
      if (!translation) {
        logger.warn(`Translation not found for key: ${key}`);
        return key;
      }
      return this.replaceParams(translation, params);
    } catch (error) {
      logger.error('Error getting translation:', error);
      return key;
    }
  }

  private replaceParams(text: string, params?: Record<string, any>): string {
    if (!params) return text;
    return Object.entries(params).reduce(
      (str, [key, value]) => str.replace(`{${key}}`, String(value)),
      text
    );
  }

  public getAvailableLocales(): string[] {
    return Object.keys(this.translations);
  }
} 