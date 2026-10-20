import { useCallback, useSyncExternalStore } from 'react';
import { useGetIdentity } from 'react-admin';

/**
 * Ukryte panele pulpitu i statystyk – zapamiętane w przeglądarce (localStorage), osobno dla każdego konta,
 * więc zostają po wylogowaniu i zamknięciu przeglądarki. Bez dostępu do localStorage (tryb prywatny) – tylko do
 * odświeżenia strony.
 */
const PREFIX = 'chleba-smak:ukryte-panele:';
const EVENT = 'ukryte-panele';
const memory = new Map<string, string>();

const read = (key: string): string[] => {
  let raw: string | null = memory.get(key) ?? null;
  try {
    raw = localStorage.getItem(key) ?? raw;
  } catch {
    // brak dostępu do localStorage
  }
  try {
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (key: string, ids: string[]) => {
  const raw = JSON.stringify(ids);
  memory.set(key, raw);
  try {
    localStorage.setItem(key, raw);
  } catch {
    // brak dostępu do localStorage – zostaje w pamięci
  }
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
};

/** Czy panel jest ukryty i funkcja przełączająca – `id` unikalny w panelu, np. „statystyki:Mapa Google” */
export function usePanelHidden(id: string): [boolean, () => void] {
  const { identity } = useGetIdentity();
  const key = PREFIX + (identity?.id ?? 'wspolne');
  // ciąg znaków (a nie tablica) – stabilny wynik dla useSyncExternalStore
  const snapshot = useSyncExternalStore(subscribe, () => JSON.stringify(read(key)));
  const hidden = (JSON.parse(snapshot) as string[]).includes(id);
  const toggle = useCallback(() => {
    const ids = read(key);
    write(key, ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }, [id, key]);
  return [hidden, toggle];
}
