import Link from 'next/link';
import type { Metadata } from 'next';
import { getContent } from '@/lib/content';

// osobny tytuł karty przeglądarki; strony błędu nie indeksujemy
export const metadata: Metadata = { title: 'Nie znaleziono strony', robots: { index: false } };

/** Teksty – z panelu (Strona → Podstrony → Elementy wspólne → Strona 404) */
export default async function NotFound() {
  const texts = (await getContent())['common.notFound'];
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-3xl flex-col items-center justify-center px-5 pt-24 text-center">
      <p className="eyebrow">{texts.eyebrow}</p>
      <h1 className="heading mt-4 text-4xl sm:text-5xl">{texts.title}</h1>
      <p className="mt-6 text-lg text-stone">{texts.text}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-gold">
          {texts.homeButton}
        </Link>
        <Link href="/oferta" className="btn btn-outline">
          {texts.offerButton}
        </Link>
      </div>
    </section>
  );
}
