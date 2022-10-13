import { createInstance, type i18n, type TFunction } from 'i18next';

const _fetch = fetch; // DOM internal
const GET_I18N_OPTIONS_ENDPOINT = '/_internal/i18n';

export async function createI18nInstanceByLang(
  lang: string,
  fetch?: (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>
): Promise<i18n> {
  fetch = fetch ?? _fetch;
  const url = GET_I18N_OPTIONS_ENDPOINT + `?lang=${lang}`;
  /** @see https://developer.mozilla.org/en-US/docs/Web/API/fetch */
  return (
    fetch(url)
      // can still encounter HTTP errors
      .then(async (resp) => {
        if (resp.ok) {
          const options = await resp.json();
          return (async () => {
            // get the translation function
            const __ = await new Promise<TFunction>((resolve, reject) => createInstance(options, (err, t) => {
              if (err) {
                reject(err);
              } else {
                resolve(t);
              }
            }));
            // create an instance
            const i = createInstance(options);
            // construct the function and the instance
            i.t = __;
            // return the final promise
            return i;
          })();
        } else {
          throw Error(`Failed to create i18n instance by lang. Response status: ${resp.status} ${resp.statusText}.`);
        }
      })
      // network issues, etc.
      .catch((reason) => {
        throw Error(reason);
      })
  );
}
