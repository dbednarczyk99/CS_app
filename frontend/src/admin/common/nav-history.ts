import { useEffect, useSyncExternalStore } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Historia ekranów panelu z ich tytułami – do strzałek „← poprzedni ekran” / „następny →” w górnym pasku.
 * Pozycję w historii przeglądarki podaje router (history.state.idx), więc strzałki przeglądarki i panelu
 * działają razem. Tytuł = tekst w górnym pasku (react-admin wstawia go do #react-admin-title).
 * Zapis w sessionStorage – zostaje po odświeżeniu karty, znika po jej zamknięciu.
 */
type Entry = { path: string; title: string };

const KEY = 'chleba-smak:historia-ekranow';
const EVENT = 'historia-ekranow';
let fallback = '[]';

const read = (): string => {
  try {
    return sessionStorage.getItem(KEY) ?? fallback;
  } catch {
    return fallback;
  }
};

const parse = (raw: string): Entry[] => {
  try {
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

const write = (entries: Entry[]) => {
  fallback = JSON.stringify(entries);
  try {
    sessionStorage.setItem(KEY, fallback);
  } catch {
    // brak sessionStorage – historia do odświeżenia karty
  }
  window.dispatchEvent(new Event(EVENT));
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener('popstate', onChange);
  };
};

const currentIdx = () => (window.history.state as { idx?: number } | null)?.idx ?? 0;

const titleText = () => document.getElementById('react-admin-title')?.textContent?.trim() ?? '';

/** Poprzedni i następny ekran (z tytułami) dla bieżącej pozycji w historii */
export function useNavHistory() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const path = location.pathname + location.search;

  // nowa pozycja: zapis adresu; nowy ekran (PUSH) ucina „dalsze” wpisy, jak przeglądarka
  useEffect(() => {
    const idx = currentIdx();
    const entries = parse(read());
    // inny adres na tej pozycji (np. wpisany ręcznie albo nowa karta) – też nowy ekran
    if (navigationType === 'PUSH' || (entries[idx] && entries[idx].path !== path)) entries.length = idx;
    entries[idx] = { path, title: entries[idx]?.path === path ? entries[idx].title : titleText() };
    write(entries);
  }, [path, navigationType]);

  // tytuł pojawia się po wczytaniu danych (np. nazwa produktu) – aktualizacja, gdy się zmieni
  useEffect(() => {
    const target = document.getElementById('react-admin-title');
    if (!target) return;
    const update = () => {
      const title = titleText();
      const idx = currentIdx();
      const entries = parse(read());
      if (!title || !entries[idx] || entries[idx].title === title) return;
      entries[idx] = { ...entries[idx], title };
      write(entries);
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(target, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [path]);

  const entries = parse(useSyncExternalStore(subscribe, read));
  const idx = currentIdx();
  const label = (e?: Entry) => (e ? e.title || 'Poprzedni ekran' : null);
  return { back: label(entries[idx - 1]), forward: label(entries[idx + 1]) };
}
