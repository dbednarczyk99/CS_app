import type { MetadataRoute } from 'next';
import { api, orFallback } from '@/lib/api';
import { absoluteUrl, articlePath, productPath } from '@/lib/site';

// mapa odświeżana co godzinę (nowe produkty i wpisy trafiają do niej same)
export const revalidate = 3600;

/**
 * /sitemap.xml – wszystkie publiczne podstrony, aktywne produkty i opublikowane wpisy (czytelne adresy),
 * z datą ostatniej zmiany – Google szybciej znajduje nowości. Strony rezerwacji i linki z e-maili pomijamy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([
    orFallback(api.products(), []),
    orFallback(api.articles(), []),
  ]);

  const pages: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '/', priority: 1, changeFrequency: 'daily' },
    { path: '/oferta', priority: 0.9, changeFrequency: 'daily' },
    { path: '/piekarnie', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/chlebowoz', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/aktualnosci', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/o-nas', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/kontakt', priority: 0.6, changeFrequency: 'yearly' },
    { path: '/regulamin', priority: 0.2, changeFrequency: 'yearly' },
    { path: '/polityka-prywatnosci', priority: 0.2, changeFrequency: 'yearly' },
  ];

  return [
    ...pages.map((p) => ({ url: absoluteUrl(p.path), changeFrequency: p.changeFrequency, priority: p.priority })),
    ...products
      .filter((p) => p.isActive)
      .map((p) => ({
        url: absoluteUrl(productPath(p)),
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
        ...(p.images?.length ? { images: p.images.map((i) => absoluteUrl(i.imgUrl)) } : {}),
      })),
    ...articles.map((a) => ({
      url: absoluteUrl(articlePath(a)),
      lastModified: a.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
