import type { Metadata } from 'next';
import { ArticlePreview } from '@/components/ArticlePreview';
import { api, orFallback } from '@/lib/api';

// podgląd z panelu – poza wyszukiwarkami i statystykami (PageViewTracker pomija /podglad)
export const metadata: Metadata = {
  title: 'Podgląd wpisu',
  robots: { index: false, follow: false },
};

/** Podgląd niezapisanego wpisu z panelu – treść przychodzi z panelu, produkty (kafelki) – z API */
export default async function ArticlePreviewPage() {
  const products = await orFallback(api.products(), []);
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-header sm:px-8">
      <ArticlePreview products={products} />
    </article>
  );
}
