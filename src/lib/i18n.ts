import en from '@/messages/en.json';
import ur from '@/messages/ur.json';

const messages: Record<string, any> = { en, ur };
export type Locale = 'en' | 'ur';

export function t(locale: Locale, key: string): string {
  const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], messages[locale]);
  return typeof value === 'string' ? value : key;
}

export function getLocale(url: URL): Locale {
  return url.pathname.startsWith('/ur') ? 'ur' : 'en';
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ur';
}
