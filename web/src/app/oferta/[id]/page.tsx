import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { AddToReservation } from '@/components/AddToReservation';
import { ProductCard } from '@/components/ProductCard';
import { api, orFallback } from '@/lib/api';
import { formatPrice } from '@/lib/format';

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
  const related = all
    .filter((p) => p.isActive && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
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
                className="object-cover"
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
            <p className="mt-6 font-display text-3xl text-gold">{formatPrice(product.price)}</p>
            {product.isSeasonal && (
              <p className="mt-4 inline-block border border-gold/50 px-3 py-1 font-display text-[0.7rem] uppercase tracking-[0.25em] text-gold">
                Produkt sezonowy
              </p>
            )}
            <div className="mt-8 h-px bg-line" />
            <p className="mt-8 text-lg leading-relaxed text-cream/90">{product.description}</p>

            <div className="mt-10">
              <AddToReservation product={product} />
            </div>

            <div className="mt-10 border border-line bg-coal p-6">
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
