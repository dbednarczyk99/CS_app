'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/api';
import { ArticleView, type ArticleViewData } from './ArticleView';

/** Adres panelu – tylko on może przysłać treść do podglądu (i tylko do niego wysyłamy wysokość strony) */
const ADMIN_ORIGIN = new URL(process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:5173').origin;

/**
 * Podgląd wpisu z panelu (otwierany w ramce okna „Podgląd posta na stronie”): panel przysyła niezapisaną treść
 * formularza wiadomością (postMessage), strona rysuje ją tym samym komponentem co prawdziwy wpis i odsyła
 * wysokość, żeby ramka w panelu miała całą stronę.
 */
export function ArticlePreview({ products }: { products: Product[] }) {
  const [article, setArticle] = useState<ArticleViewData | null>(null);
  const [embedded, setEmbedded] = useState(true);

  useEffect(() => {
    if (window.parent === window) {
      setEmbedded(false);
      return;
    }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ADMIN_ORIGIN || e.data?.type !== 'chleba-smak:article-preview') return;
      setArticle(e.data.article as ArticleViewData);
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: 'chleba-smak:preview-ready' }, ADMIN_ORIGIN);

    // wysokość strony (np. po wczytaniu zdjęć) – ramka w panelu bez własnego przewijania
    const sendHeight = () =>
      window.parent.postMessage(
        { type: 'chleba-smak:preview-height', height: document.documentElement.scrollHeight },
        ADMIN_ORIGIN,
      );
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    return () => {
      window.removeEventListener('message', onMessage);
      observer.disconnect();
    };
  }, []);

  if (!embedded)
    return <p className="text-stone">Ten adres służy do podglądu wpisów w panelu administracyjnym.</p>;
  if (!article) return <p className="text-stone">Wczytywanie podglądu…</p>;
  return <ArticleView article={article} products={products} preview />;
}
