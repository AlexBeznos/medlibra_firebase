import { writable } from 'svelte/store';
import ua from './locales/ua.json';
import ru from './locales/ru.json';

const lang = { ua, ru };

export function setLocale(locale) {
  localization.set(lang[locale]);
}

export const localization = writable(ua);
