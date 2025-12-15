import { createI18n } from 'vue-i18n';
import en from '@/app/locales/en.json';
import ar from '@/app/locales/ar.json';

export const i18n = createI18n({
  legacy: false, // use Composition API
  globalInjection: true,
  locale: 'en', // default language
  fallbackLocale: 'en',
  messages: {
    en,
    ar
  }
});
