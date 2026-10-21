import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * /robots.txt – wskazuje Google mapę strony i strony, których nie indeksujemy (rezerwacja i jej anulowanie,
 * linki z e-maili newslettera, adresy techniczne). Strony te mają też „noindex” w metadanych.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/rezerwacja', '/newsletter/', '/podglad/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
