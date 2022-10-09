import i18next from 'i18next';
import enUSTranslation from '../../locales/en.json';
import zhCNTranslation from '../../locales/zh.json';

i18next.init({
  fallbackLng: 'en',
  resources: {
    'en': {
      translation: enUSTranslation
    },
    'zh': {
      translation: zhCNTranslation
    }
  },
  interpolation: {
    escapeValue: false
  },
  debug: true
});

export const i18n = i18next;
export default i18next.t;
