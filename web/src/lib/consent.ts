'use client';

import { useSyncExternalStore } from 'react';

/*
 * Decyzja odwiedzającego w sprawie plików cookie (baner na dole strony). Zapamiętana w przeglądarce
 * (localStorage) – bez wysyłania na serwer. `maps` – zgoda na Mapę Google (zapisuje pliki cookie Google).
 */
export type Consent = { maps: boolean; at: number };

const KEY = 'chleba-smak:cookies:v1';
const CHANGE = 'chleba-smak:cookies-change';
const OPEN = 'chleba-smak:cookies-open';

let cached: { raw: string | null; value: Consent | null } = { raw: null, value: null };
// gdy przeglądarka nie pozwala zapisywać (np. zablokowana pamięć) – decyzja tylko na czas wizyty
let memory: Consent | null = null;

function read(): Consent | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    // brak dostępu do pamięci przeglądarki – decyzja tylko na czas wizyty
    return memory;
  }
  if (raw === cached.raw) return cached.value;
  let value: Consent | null = null;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<Consent>) : null;
    value =
      parsed && typeof parsed.maps === 'boolean'
        ? { maps: parsed.maps, at: Number(parsed.at) || 0 }
        : null;
  } catch {
    value = null;
  }
  cached = { raw, value };
  return value;
}

export function saveConsent(maps: boolean) {
  const value: Consent = { maps, at: Date.now() };
  memory = value;
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // tryb prywatny itp. – zostaje w pamięci do końca wizyty
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE, callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Aktualna decyzja: `undefined` – jeszcze nieznana (renderowanie na serwerze / przed odczytem),
 * `null` – odwiedzający jeszcze nie zdecydował, inaczej zapisana decyzja.
 */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

/** Ponowne otwarcie banera (link „Ustawienia plików cookie” w stopce) */
export const openConsentSettings = () => window.dispatchEvent(new Event(OPEN));

export function onOpenConsentSettings(callback: () => void) {
  window.addEventListener(OPEN, callback);
  return () => window.removeEventListener(OPEN, callback);
}
