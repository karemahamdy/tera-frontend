import { createI18n } from 'vue-i18n';
import ar from './locales/ar.json';
import en from './locales/en.json';

export const defaultLocale = 'en';
export const supportedLocales = {
  en: { name: 'English', dir: 'ltr' },
  ar: { name: 'العربية (Arabic)', dir: 'rtl' }
};

const i18n = createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: defaultLocale,
  globalInjection: true,
  messages: { ar, en }
});

function getStartingLocale(): string {
  const savedLanguage = localStorage.getItem('lang');
  if (savedLanguage) {
    return savedLanguage;
  }

  return 'en';
}

export default i18n;
