import { createI18n } from 'vue-i18n';
import en from '../app/i18n/locales/en.json';
import ar from '../app/i18n/locales/ar.json';

export const i18n = createI18n({
  legacy: false, // use Composition API
  globalInjection: true,
  locale: 'en', // default language
  fallbackLocale: 'en',
  flatJson: false,

  messages: {
    en,
    ar
  }
});
