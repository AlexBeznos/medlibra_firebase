import { writable } from 'svelte/store';
import ua from './locales/ua.json';

const global = globalThis || window || global;

const KEY = 'currentLanguage';
const cache = { ua };

export async function setLocale(locale) {
  const nextLocale =
    cache[locale] || (await (await fetch(`/locales/${locale}.json`)).json());
  localization.set(nextLocale);
  cache[locale] = nextLocale;
  global.localStorage && global.localStorage.setItem(KEY, locale);
}

if (!!global.localStorage) {
  const initialLanguage = global.localStorage.getItem(KEY);

  if (initialLanguage !== 'ua' && initialLanguage !== null) {
    setLocale(initialLanguage);
  }
}

export const localization = writable(ua);
