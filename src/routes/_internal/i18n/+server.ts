import { error, json } from '@sveltejs/kit';
import type { InitOptions } from 'i18next';
import { getI18nOptionsByLang } from '~/lib/server/i18n';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const lang = url.searchParams.get('lang');
  let result: InitOptions;

  if (lang === null) {
    throw error(400, 'Missing query parameter "lang"');
  }

  try {
    result = await getI18nOptionsByLang(lang);
  } catch (e) {
    return error(500, (e as Error).message);
  }

  return json(result);
};
