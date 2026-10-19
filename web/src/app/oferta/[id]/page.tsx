import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { AddToReservation } from '@/components/AddToReservation';
import { ProductCard } from '@/components/ProductCard';
import { api, orFallback } from '@/lib/api';
import { ProductViewTracker } from '@/components/ProductViewTracker';
import { BADGE_STYLE, isAvailable, isOnPromo, isOutOfSeason, oldPriceOf, priceOf, productBadges } from '@/lib/products';
import { formatDate, formatPrice } from '@/lib/format';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await orFallback(api.product(id), null);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const [product, all] = await Promise.all([
    orFallback(api.product(id), null),
    orFallback(api.products(), []),
  ]);
  if (!product || !product.isActive) notFound();

  const image = product.images?.[0];
  const outOfSeason = isOutOfSeason(product);
  const badges = productBadges(product);
  const oldPrice = oldPriceOf(product);
  const related = all
    .filter((p) => isAvailable(p) && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductViewTracker productId={product.id} />
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-header sm:px-8">
        <Link href="/oferta" className="link-arrow inline-flex items-center gap-3 text-[0.75rem]">
          <FaArrowLeft aria-hidden /> Oferta
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
            {image && (
              <Image
                src={image.imgUrl}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover ${outOfSeason ? 'grayscale' : ''}`}
              />
            )}
          </div>

          <div className="lg:py-8">
            {product.category && (
              <Link href={`/oferta?kategoria=${product.category.id}`} className="eyebrow hover:text-gold-light">
                {product.category.name}
              </Link>
            )}
            <h1 className="heading mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            {!outOfSeason && (
              <p className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display">
                <span className="text-3xl text-gold">
                  {oldPrice !== null && <span className="sr-only">Cena promocyjna: </span>}
                  {formatPrice(priceOf(product))}
                </span>
                {oldPrice !== null && (
                  <s className="text-xl text-stone">
                    <span className="sr-only">Cena przed promocją: </span>
                    {formatPrice(oldPrice)}
                  </s>
                )}
              </p>
            )}
            {!outOfSeason && isOnPromo(product) && product.promoTo && (
              <p className="mt-2 text-sm text-stone">
                Promocja trwa do {formatDate(`${product.promoTo}T12:00:00`)} – przy rezerwacji obejmuje odbiór do tego dnia.
              </p>
            )}
            {badges.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <li
                    key={badge.label}
                    className={`border px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.25em] ${BADGE_STYLE[badge.tone].page}`}
                  >
                    {badge.label}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 h-px bg-line" />
            <p className="mt-8 text-lg leading-relaxed text-cream/90">{product.description}</p>

            <div className="mt-10">
              {outOfSeason ? (
                <div className="border-l-2 border-line py-1 pl-5">
                  <p className="heading text-lg">Obecnie poza sezonem</p>
                  <p className="mt-2 leading-relaxed text-stone">
                    Teraz nie ma go w naszych piekarniach i nie można go zarezerwować – wróci, gdy
                    przyjdzie na niego pora.
                  </p>
                  <Link href="/oferta" className="link-arrow mt-4 inline-flex items-center gap-3 text-[0.75rem]">
                    Zobacz, co mamy teraz <FaArrowRight aria-hidden />
                  </Link>
                </div>
              ) : (
                <AddToReservation product={product} />
              )}
            </div>

            {/* poza sezonem nie można rezerwować – bez opisu rezerwacji */}
            <div className={`mt-10 border border-line bg-coal p-6 ${outOfSeason ? 'hidden' : ''}`}>
              <p className="heading text-lg">Jak działa rezerwacja?</p>
              <ul className="mt-3 space-y-2 leading-relaxed text-stone">
                <li>Odbiór w jednej z naszych piekarni lub z chlebowozu.</li>
                <li>Rezerwacje przyjmujemy do 18:00 dnia poprzedzającego odbiór, maksymalnie 5 dni do przodu.</li>
                <li>Płacisz na miejscu, przy odbiorze.</li>
              </ul>
              <Link href="/piekarnie" className="link-arrow mt-5 inline-flex items-center gap-3 text-[0.75rem]">
                Nasze piekarnie <FaArrowRight aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-coal">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <h2 className="heading text-2xl sm:text-3xl">Może Cię też zainteresować</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
