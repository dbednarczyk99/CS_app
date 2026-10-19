import type { Metadata } from 'next';
import type { Article, Product } from './api';

/** Adres strony (bez ukośnika na końcu) – adresy kanoniczne, mapa strony, podgląd linków, dane dla Google */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001').replace(/\/+$/, '');

export const SITE_NAME = 'Chleba Smak';

/** Pełny adres z ścieżki („/oferta” → „https://chlebasmak.pl/oferta”); pełne adresy zostają bez zmian */
export const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`);

/** Adres produktu na stronie – czytelny (slug), a gdy go nie ma – po id (strona przekierowuje) */
export const productPath = (p: Pick<Product, 'id' | 'slug'>) => `/oferta/${p.slug ?? p.id}`;

/** Adres wpisu na stronie – czytelny (slug), a gdy go nie ma – po id */
export const articlePath = (a: Pick<Article, 'id' | 'slug'>) => `/aktualnosci/${a.slug ?? a.id}`;

const DEFAULT_OG_IMAGE = {
  url: '/images/og-domyslny.jpg',
  width: 1200,
  height: 630,
  alt: 'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
};

/**
 * Metadane podstrony: tytuł, opis, adres kanoniczny (bez parametrów, np. filtrów i ?utm_…) i pełny podgląd linku
 * przy udostępnianiu. Next.js nie łączy openGraph podstrony z ustawieniami całej strony – stąd komplet tutaj.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
  noindex = false,
}: {
  /** tytuł podstrony (bez „· Chleba Smak” – dopisuje szablon); null = strona główna */
  title: string | null;
  description: string;
  path: string;
  image?: { url: string; alt: string };
  type?: 'website' | 'article';
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  const ogTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} – piekarnia rzemieślnicza w Krakowie`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false } } : {}),
    openGraph: {
      type,
      locale: 'pl_PL',
      siteName: SITE_NAME,
      title: ogTitle,
      description,
      url: path,
      images: [image ?? DEFAULT_OG_IMAGE],
      ...(publishedTime ? { publishedTime } : {}),
    },
  };
}

/** Ciąg znaków z parametrów adresu (?utm_source=…) – zachowanie ich przy przekierowaniu ze starego adresu */
export function searchString(params: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    for (const v of Array.isArray(value) ? value : value !== undefined ? [value] : []) query.append(key, v);
  const text = query.toString();
  return text ? `?${text}` : '';
}
