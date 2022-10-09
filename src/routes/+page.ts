import { i18n } from '~/lib/i18n';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
  const lang = url.searchParams.get('lang');
  const __ = await i18n.changeLanguage(lang || undefined);

  return { lang, __ };
};
