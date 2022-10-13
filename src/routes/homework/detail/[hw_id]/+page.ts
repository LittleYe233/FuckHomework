import { createI18nInstanceByLang } from '$lib/i18n';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, data, fetch }) => {
  const lang = url.searchParams.get('lang');
  const i18n = await createI18nInstanceByLang(lang ?? '', fetch);
  const __ = i18n.t;

  return { lang, __, ...data };
};
