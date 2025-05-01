export declare class I18nService {
    private static instance;
    private translations;
    private currentLocale;
    private constructor();
    static getInstance(): I18nService;
    private loadTranslations;
    setLocale(locale: string): void;
    t(key: string, params?: Record<string, any>): string;
    private replaceParams;
    getAvailableLocales(): string[];
}
