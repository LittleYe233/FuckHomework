import i18next from 'i18next';
// import { createI18nStore } from 'svelte-i18next';
import enUSTranslation from '../../locales/en-US.json';
import zhCNTranslation from '../../locales/zh-CN.json';

i18next.init({
  fallbackLng: 'en-US',
  resources: {
    'en-US': {
      translation: enUSTranslation
    },
    'zh-CN': {
      translation: zhCNTranslation
    }
  },
  interpolation: {
    escapeValue: false
  },
  debug: true
});

// export const i18n = createI18nStore(i18next);
export const i18n = i18next;
export default i18next.t;
