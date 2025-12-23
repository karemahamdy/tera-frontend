// plugins/i18n.ts
import { createI18n } from 'vue-i18n';

const messages = import.meta.glob('../app/locales/*.json', { eager: true });

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

// Map messages to locale
const mappedMessages: Record<string, any> = {};
for (const path in messages) {
  const fileName = path.split('/').pop()?.replace('.json', '');
  if (fileName) mappedMessages[fileName] = (messages as any)[path];
}

export default createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: mappedMessages,
});
