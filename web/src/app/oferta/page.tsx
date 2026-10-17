import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { api, orFallback } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Oferta',
  description: 'Chleby na zakwasie, słodkie wypieki, kanapki i lody rzemieślnicze z piekarni Chleba Smak w Krakowie.',
};

export default async function OfferPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string; sezonowe?: string }>;
}) {
  const { kategoria, sezonowe } = await searchParams;
  // ?sezonowe – tylko produkty sezonowe (link z karuzeli na stronie głównej)
  const products = (await orFallback(api.products(), [])).filter((p) => p.isActive);
  const hasSeasonal = products.some((p) => p.isSeasonal);
  const seasonalOnly = sezonowe !== undefined && hasSeasonal;

  // kategorie w kolejności pierwszego wystąpienia, tylko te z produktami
  const categories = [
    ...new Map(products.filter((p) => p.category).map((p) => [p.category!.id, p.category!])).values(),
  ];
  const active = seasonalOnly ? undefined : categories.find((c) => c.id === kategoria);
  const groups = (active ? [active] : categories)
    .map((category) => ({
      category,
      products: products.filter((p) => p.categoryId === category.id && (!seasonalOnly || p.isSeasonal)),
    }))
    .filter((group) => group.products.length > 0);

  const chip = (selected: boolean) =>
    `shrink-0 snap-start border px-4 py-2 font-display text-[0.75rem] uppercase tracking-[0.2em] transition-colors ${
      selected ? 'border-gold bg-gold text-ink' : 'border-line text-cream/85 hover:border-gold hover:text-gold'
    }`;

  return (
    <>
      <PageHeader eyebrow="Oferta" title="Nasze wypieki" image="/images/chleb-deska.jpg">
        Pieczywo i wypieki dostępne w naszych piekarniach. Asortyment zmienia się z porami roku –
        szukaj znaczka „sezonowo”.
      </PageHeader>

      {/* Kategorie – przyklejone pod nagłówkiem strony */}
      <nav
        aria-label="Kategorie"
        className="sticky top-[calc(4.5rem+var(--banner-h))] z-30 border-y border-line bg-ink/90 backdrop-blur-md sm:top-[calc(5rem+var(--banner-h))]"
      >
        <ul className="mx-auto flex max-w-7xl snap-x gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] sm:px-8">
          <li>
            <Link href="/oferta" scroll={false} className={chip(!active && !seasonalOnly)}>
              Wszystko
            </Link>
          </li>
          {hasSeasonal && (
            <li>
              <Link href="/oferta?sezonowe" scroll={false} className={chip(seasonalOnly)}>
                Sezonowo
              </Link>
            </li>
          )}
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/oferta?kategoria=${category.id}`}
                scroll={false}
                className={chip(active?.id === category.id)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl space-y-20 px-5 py-16 sm:px-8 md:py-24">
        {groups.length === 0 && <p className="text-center text-stone">Oferta pojawi się wkrótce.</p>}
        {groups.map(({ category, products }) => (
          <section key={category.id} aria-labelledby={`kat-${category.id}`}>
            <div className="flex items-baseline gap-4">
              <h2 id={`kat-${category.id}`} className="heading text-2xl sm:text-3xl">
                {category.name}
              </h2>
              <span className="text-sm text-stone">{products.length}</span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
