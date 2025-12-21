// plugins/i18n.ts
import { createI18n } from 'vue-i18n';
import en from '@/app/locales/en.json';
import ar from '@/app/locales/ar.json';

function getLanguage(): string {
  let lang = localStorage.getItem('lang');

  if (!lang) {
    const browserLang = navigator.language?.substring(0, 2) ?? import.meta.env.VITE_DEFAULT_LANGUAGE ?? 'en';
    lang = browserLang;
    localStorage.setItem('lang', lang);
  }

  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  return lang;
}

export default createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, ar }
});
