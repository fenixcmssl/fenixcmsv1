export const locales = ['es', 'en', 'it', 'fr', 'pt', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';
