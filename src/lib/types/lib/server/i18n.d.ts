import type { Resource } from 'i18next';

export type LoadLocalesResult = {
  resources: Resource;
  lng: string;
  fallbackLng: string[];
  ns: string[];
  defaultNS: string;
};
