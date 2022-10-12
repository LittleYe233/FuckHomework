/**
 * @file src/lib/server/i18n.ts
 * @description This is a locale-file searching utility for `src/lib/i18n.ts`.
 * The core function is implemented by the latter file.
 */

import fs from 'fs';
import { glob, type IGlob } from 'glob';
import { isNull } from 'lodash';
import { dirname, normalize, join } from 'path';
import { fileURLToPath } from 'url';
import type { InitOptions, Resource, ResourceKey, ResourceLanguage } from 'i18next';
import type { LoadLocalesResult } from '../types';

/**
 * Automatically load locales from a specified path. It can be regarded one part
 * of `i18next-fs-backend`.
 *
 * @returns A `Promise` of an object of `resources`, `lng`, `fallbackLng`, `ns`,
 * and `defaultNS`.
 */
export async function loadLocales(): Promise<LoadLocalesResult> {
  const root = join(fileURLToPath(dirname(import.meta.url)), '../../../locales');
  const subPattern = '*/*.json';
  const pattern = normalize(join(root, subPattern));
  const defaultLng = 'en';
  const defaultNs = 'common';

  const paths = await new Promise<string[]>((resolve) => {
    const g: IGlob = glob(pattern, () => resolve(g.found));
  });

  const result: LoadLocalesResult = {
    resources: {} as Resource,
    fallbackLng: [] as string[],
    ns: [] as string[],
    lng: '',
    defaultNS: ''
  };
  for (const p of paths) {
    const [lng, ns] = p.slice(root.length + 1, p.length - 5).split('/');
    if (!result.fallbackLng.includes(lng)) {
      result.fallbackLng.push(lng);
    }
    if (!result.ns.includes(ns)) {
      result.ns.push(ns);
    }
    const content: ResourceKey = await new Promise<string>((resolve, reject) => {
      fs.readFile(p, { encoding: 'utf-8' }, (err, data) => {
        if (isNull(err)) {
          resolve(data);
        } else {
          reject(err);
        }
      });
    });
    // Initialize the language if necessary.
    result.resources[lng] = result.resources[lng] || ({} as ResourceLanguage);
    result.resources[lng][ns] = JSON.parse(content);
  }
  let i: number;
  // strip and sort paths
  if ((i = result.fallbackLng.indexOf(defaultLng)) != -1) {
    result.lng = defaultLng;
    result.fallbackLng = [defaultLng, ...[...result.fallbackLng.slice(0, i), ...result.fallbackLng.slice(i + 1)].sort()];
  } else {
    result.fallbackLng = result.fallbackLng.sort();
    result.lng = result.fallbackLng.length ? result.fallbackLng[0] : result.lng;
  }
  if ((i = result.ns.indexOf(defaultNs)) != -1) {
    result.defaultNS = defaultNs;
    result.ns = [defaultNs, ...[...result.ns.slice(0, i), ...result.ns.slice(i + 1)].sort()];
  } else {
    result.ns = result.ns.sort();
    result.defaultNS = result.ns.length ? result.ns[0] : result.defaultNS;
  }

  return result;
}

export const allLocales = await loadLocales();
export const restI18nOptions: InitOptions = {
  interpolation: {
    escapeValue: false
  },
  debug: true
};

export async function getI18nOptionsByLang(lng: string): Promise<InitOptions> {
  const result = { ...restI18nOptions, ...allLocales };

  /**
   * @note Now `lng` still can be an unavailable value. We allow it to be a
   * wrong value, but it must throw an error when there is no any locale.
   */
  lng = result.fallbackLng.includes(lng) ? lng : result.lng;
  if (result.fallbackLng.length === 0) {
    return Promise.reject('no available locales');
  }
  result.fallbackLng = [lng];
  result.lng = lng;
  result.resources = { lng: result.resources[lng] };

  return result;
}
