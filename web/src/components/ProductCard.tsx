import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { AddToReservationCompact } from './AddToReservation';

export function ProductCard({
  product,
  priority = false,
  reservable = true,
}: {
  product: Product;
  priority?: boolean;
  /** false – bez przycisku rezerwacji (np. na stronie głównej) */
  reservable?: boolean;
}) {
  const image = product.images?.[0];

  return (
    <div className="group flex h-full flex-col">
      <Link href={`/oferta/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
          {image ? (
            <Image
              src={image.imgUrl}
              alt={product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center p-6 text-center font-display uppercase tracking-[0.2em] text-stone">
              {product.name}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.isSeasonal && (
            <span className="absolute left-3 top-3 bg-ink/80 px-2.5 py-1 font-display text-[0.65rem] uppercase tracking-[0.25em] text-gold backdrop-blur-sm">
              Sezonowo
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <h3 className="font-display text-base uppercase leading-snug tracking-wide transition-colors group-hover:text-gold sm:text-lg">
            {product.name}
          </h3>
          <span className="shrink-0 font-display text-gold">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone">{product.description}</p>
      </Link>
      {reservable && (
        <div className="mt-auto pt-4">
          <AddToReservationCompact product={product} />
        </div>
      )}
    </div>
  );
}
