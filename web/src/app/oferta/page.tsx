import type { Metadata } from 'next';
import Link from 'next/link';
import { FaCheck, FaChevronDown, FaXmark } from 'react-icons/fa6';
import { DropdownPanel } from '@/components/DropdownPanel';
import { PageHeader } from '@/components/PageHeader';
import { ProductCard } from '@/components/ProductCard';
import { api, orFallback, type Product } from '@/lib/api';
import { LABEL_FILTERS, isAvailable, isOutOfSeason, type LabelFilterKey } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Oferta',
  description: 'Chleby na zakwasie, słodkie wypieki, kanapki i lody rzemieślnicze z piekarni Chleba Smak w Krakowie.',
};

/** Adres oferty z filtrami (kategoria + etykiety) */
function offerHref(kategoria: string | undefined, etykiety: LabelFilterKey[]) {
  const params = new URLSearchParams();
  if (kategoria) params.set('kategoria', kategoria);
  if (etykiety.length) params.set('etykiety', etykiety.join(','));
  const query = params.toString();
  return query ? `/oferta?${query.replace(/%2C/g, ',')}` : '/oferta';
}

export default async function OfferPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string; etykiety?: string; sezonowe?: string }>;
}) {
  const params = await searchParams;
  const all = (await orFallback(api.products(), [])).filter((p) => p.isActive);
  const products = all.filter(isAvailable);

  // kategorie w kolejności pierwszego wystąpienia, tylko te z produktami
  const categories = [
    ...new Map(all.filter((p) => p.category).map((p) => [p.category!.id, p.category!])).values(),
  ];
  const active = categories.find((c) => c.id === params.kategoria);
  const inCategory = (p: Product) => !active || p.categoryId === active.id;

  // etykiety z adresu; ?sezonowe – stary link z karuzeli na stronie głównej
  const requested = [...(params.etykiety?.split(',') ?? []), ...(params.sezonowe !== undefined ? ['sezonowe'] : [])];
  const labels = LABEL_FILTERS.filter((f) => requested.includes(f.key)).map((f) => f.key);
  const matchesLabels = (p: Product) =>
    labels.length === 0 || LABEL_FILTERS.some((f) => labels.includes(f.key) && f.test(p));

  const groups = (active ? [active] : categories)
    .map((category) => ({
      category,
      products: products.filter((p) => p.categoryId === category.id && matchesLabels(p)),
    }))
    .filter((group) => group.products.length > 0);
  // sezonowe poza sezonem – na końcu, wyciszone; przy filtrze etykiet tylko gdy wybrano „Sezonowe”
  const outOfSeason = all.filter(
    (p) => isOutOfSeason(p) && inCategory(p) && (labels.length === 0 || labels.includes('sezonowe')),
  );

  // przełączniki etykiet: tylko te, które mają produkty (liczba w obrębie wybranej kategorii)
  const labelOptions = LABEL_FILTERS.map((f) => {
    const selected = labels.includes(f.key);
    return {
      ...f,
      selected,
      count: products.filter((p) => inCategory(p) && f.test(p)).length,
      href: offerHref(active?.id, selected ? labels.filter((k) => k !== f.key) : [...labels, f.key]),
    };
  }).filter((f) => f.count > 0 || f.selected);
  const filtered = Boolean(active) || labels.length > 0;

  // kategorie z adresem (z zachowaniem wyróżnionych) i liczbą pasujących produktów
  const categoryOptions = [
    { id: '', name: 'Wszystkie', href: offerHref(undefined, labels), count: products.filter(matchesLabels).length },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name,
      href: offerHref(c.id, labels),
      count: products.filter((p) => p.categoryId === c.id && matchesLabels(p)).length,
    })),
  ];
  const categoryHref = Object.fromEntries(categoryOptions.map((o) => [o.id, o.href])) as Record<string, string>;

  // wspólny wygląd przycisku i panelu rozwijanych filtrów (telefon/tablet)
  const dropdownButton = (on: boolean) =>
    `flex h-10 items-center gap-2 border px-3.5 font-display text-[0.7rem] uppercase tracking-[0.2em] ${
      on ? 'border-gold bg-gold/10 text-gold' : 'border-line text-cream/85'
    }`;
  const dropdownPanel = 'absolute top-full mt-2 w-64 border border-line bg-ink p-2 shadow-xl shadow-black/40';
  const chevron = <FaChevronDown size={9} aria-hidden className="ml-auto shrink-0 transition-transform group-open:rotate-180" />;

  const categoryChip = (selected: boolean) =>
    `block shrink-0 whitespace-nowrap border px-4 py-2 font-display text-[0.75rem] uppercase tracking-[0.2em] transition-colors ${
      selected ? 'border-gold bg-gold text-ink' : 'border-line text-cream/85 hover:border-gold hover:text-gold'
    }`;

  return (
    <>
      <PageHeader eyebrow="Oferta" title="Nasze wypieki" image="/images/chleb-deska.jpg">
        Pieczywo i wypieki dostępne w naszych piekarniach. Asortyment zmienia się z porami roku –
        wypieki sezonowe dostępne teraz mają znaczek „Teraz dostępne”.
      </PageHeader>

      {/* Filtry – przyklejone pod nagłówkiem strony: kategoria + wyróżnione (etykiety) */}
      <nav
        aria-label="Filtry oferty"
        className="sticky top-[calc(4.5rem+var(--banner-h))] z-30 border-y border-line bg-ink/90 backdrop-blur-md sm:top-[calc(5rem+var(--banner-h))]"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3 sm:px-8">
          {/* telefon/tablet: dwa rozwijane panele – kategoria (jeden wybór) i wyróżnione (kilka) */}
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
            <DropdownPanel
              className="min-w-0 flex-1"
              closeOnSelect
              summaryClassName={dropdownButton(Boolean(active))}
              summary={
                <>
                  <span className="truncate">{active ? active.name : 'Kategorie'}</span>
                  {chevron}
                </>
              }
            >
              <div className={`${dropdownPanel} left-0`}>
                <ul>
                  {categoryOptions.map((option) => {
                    const selected = (active?.id ?? '') === option.id;
                    return (
                      <li key={option.id || 'wszystkie'}>
                        <Link
                          href={option.href}
                          scroll={false}
                          aria-current={selected ? 'true' : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-coal ${
                            option.count === 0 && !selected ? 'opacity-45' : ''
                          }`}
                        >
                          {/* kropka – wybór jednej kategorii */}
                          <span
                            className={`grid size-4 shrink-0 place-items-center rounded-full border ${
                              selected ? 'border-gold' : 'border-cream/40'
                            }`}
                          >
                            {selected && <span className="size-2 rounded-full bg-gold" />}
                          </span>
                          <span className={selected ? 'text-gold' : 'text-cream'}>{option.name}</span>
                          <span className="ml-auto text-sm text-stone">{option.count}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </DropdownPanel>
            {labelOptions.length > 0 && (
              <DropdownPanel
                className="shrink-0"
                summaryClassName={dropdownButton(labels.length > 0)}
                summary={
                  <>
                    Wyróżnione
                    {labels.length > 0 && (
                      <span className="grid size-5 place-items-center bg-gold text-[0.65rem] tracking-normal text-ink">
                        {labels.length}
                      </span>
                    )}
                    {chevron}
                  </>
                }
              >
                <div className={`${dropdownPanel} right-0`}>
                  <ul>
                    {labelOptions.map((option) => (
                      <li key={option.key}>
                        <Link
                          href={option.href}
                          scroll={false}
                          aria-pressed={option.selected}
                          className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-coal"
                        >
                          <span
                            className={`grid size-4 shrink-0 place-items-center border ${
                              option.selected ? 'border-gold bg-gold text-ink' : 'border-cream/40'
                            }`}
                          >
                            {option.selected && <FaCheck size={9} aria-hidden />}
                          </span>
                          <span className={option.selected ? 'text-gold' : 'text-cream'}>{option.label}</span>
                          <span className="ml-auto text-sm text-stone">{option.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {filtered && (
                    <Link
                      href="/oferta"
                      scroll={false}
                      className="mt-1 flex items-center gap-2 border-t border-line px-3 pb-1 pt-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-stone hover:text-gold"
                    >
                      <FaXmark size={11} aria-hidden /> Wyczyść filtry
                    </Link>
                  )}
                </div>
              </DropdownPanel>
            )}
          </div>

          {/* komputer: przewijany rząd zakładek, krawędzie wygaszone */}
          <ul
            aria-label="Kategorie"
            className="hidden min-w-0 flex-1 gap-2 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] [scrollbar-width:none] lg:flex"
          >
            <li>
              <Link href={categoryHref['']} scroll={false} className={categoryChip(!active)}>
                Wszystko
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={categoryHref[category.id]} scroll={false} className={categoryChip(active?.id === category.id)}>
                  {category.name}
                </Link>
              </li>
            ))}
            {/* miejsce na wygaszenie krawędzi */}
            <li aria-hidden className="w-10 shrink-0" />
          </ul>

          {/* komputer: przełączniki wyróżnionych (etykiet) obok kategorii */}
          {labelOptions.length > 0 && (
            <>
              <div aria-hidden className="hidden h-7 w-px shrink-0 bg-line lg:block" />
              <ul aria-label="Wyróżnione" className="hidden shrink-0 gap-2 lg:flex">
                {labelOptions.map((option) => (
                  <li key={option.key}>
                    <Link
                      href={option.href}
                      scroll={false}
                      aria-pressed={option.selected}
                      className={`flex h-10 items-center gap-2 whitespace-nowrap border px-3.5 font-display text-[0.7rem] uppercase tracking-[0.2em] transition-colors ${
                        option.selected
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-line text-cream/80 hover:border-gold/60 hover:text-gold'
                      }`}
                    >
                      {option.selected && <FaCheck size={10} aria-hidden />}
                      {option.label}
                      <span className={option.selected ? 'text-gold/70' : 'text-stone'}>{option.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {filtered && (
            <Link
              href="/oferta"
              scroll={false}
              className="hidden shrink-0 items-center gap-2 whitespace-nowrap px-2 font-display text-[0.7rem] uppercase tracking-[0.2em] text-stone transition-colors hover:text-gold lg:flex"
            >
              <FaXmark size={11} aria-hidden /> Wyczyść
            </Link>
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-20 px-5 py-16 sm:px-8 md:py-24">
        {groups.length === 0 && (
          <div className="text-center">
            <p className="text-stone">
              {filtered ? 'Brak dostępnych produktów dla wybranych filtrów.' : 'Oferta pojawi się wkrótce.'}
            </p>
            {filtered && (
              <Link href="/oferta" scroll={false} className="link-arrow mt-4 inline-flex">
                Pokaż całą ofertę
              </Link>
            )}
          </div>
        )}
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

        {outOfSeason.length > 0 && (
          <section aria-labelledby="poza-sezonem" className="border-t border-line pt-16">
            <div className="flex items-baseline gap-4">
              <h2 id="poza-sezonem" className="heading text-2xl text-cream/70 sm:text-3xl">
                Wrócą w sezonie
              </h2>
              <div className="h-px flex-1 bg-line" />
            </div>
            <p className="mt-3 max-w-2xl text-stone">
              Te wypieki pieczemy tylko w swoim sezonie – wrócą, gdy pozwolą na to składniki.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {outOfSeason.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
