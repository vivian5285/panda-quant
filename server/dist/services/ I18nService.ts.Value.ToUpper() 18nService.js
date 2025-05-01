"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18nService = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const logger_1 = require("../utils/logger");
class I18nService {
    constructor() {
        this.translations = {};
        this.currentLocale = 'zh';
        this.loadTranslations();
    }
    static getInstance() {
        if (!I18nService.instance) {
            I18nService.instance = new I18nService();
        }
        return I18nService.instance;
    }
    loadTranslations() {
        try {
            const locales = ['zh', 'en'];
            for (const locale of locales) {
                const filePath = (0, path_1.join)(__dirname, `../../locales/${locale}.json`);
                this.translations[locale] = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf-8'));
            }
            logger_1.logger.info('Translations loaded successfully');
        }
        catch (error) {
            logger_1.logger.error('Error loading translations:', error);
            throw error;
        }
    }
    setLocale(locale) {
        if (this.translations[locale]) {
            this.currentLocale = locale;
            logger_1.logger.info(`Locale changed to ${locale}`);
        }
        else {
            logger_1.logger.warn(`Locale ${locale} not found, keeping current locale`);
        }
    }
    t(key, params) {
        try {
            const translation = this.translations[this.currentLocale][key];
            if (!translation) {
                logger_1.logger.warn(`Translation not found for key: ${key}`);
                return key;
            }
            return this.replaceParams(translation, params);
        }
        catch (error) {
            logger_1.logger.error('Error getting translation:', error);
            return key;
        }
    }
    replaceParams(text, params) {
        if (!params)
            return text;
        return Object.entries(params).reduce((str, [key, value]) => str.replace(`{${key}}`, String(value)), text);
    }
    getAvailableLocales() {
        return Object.keys(this.translations);
    }
}
exports.I18nService = I18nService;
//# sourceMappingURL=%20I18nService.ts.Value.ToUpper()%2018nService.js.map