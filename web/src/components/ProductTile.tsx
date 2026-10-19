import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import type { Product } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { BADGE_STYLE, isOutOfSeason, oldPriceOf, priceOf, productBadges } from '@/lib/products';
import { productPath } from '@/lib/site';

/** Akapit wpisu „[produkt:<id> Nazwa]” → id produktu (nazwa jest tylko dla czytelności w panelu) */
export const tileIdOf = (paragraph: string) =>
  /^\s*\[produkt:([0-9a-f-]{36})[^\]]*\]\s*$/i.exec(paragraph)?.[1].toLowerCase() ?? null;

/** Znaczniki produktów wpisane w środku zwykłego akapitu – usuwane (kafelek musi być osobnym akapitem) */
export const stripProductTokens = (text: string) => text.replace(/\[produkt:[0-9a-f-]{36}[^\]]*\]/gi, '').trim();

/**
 * Kafelek produktu w treści wpisu (aktualności): zdjęcie, etykiety, nazwa, krótki opis, cena i link do produktu.
 * Uproszczona wersja karty z oferty – poziomo, żeby nie rozbijała tekstu artykułu.
 */
export function ProductTile({ product }: { product: Product }) {
  const image = product.images?.[0];
  const outOfSeason = isOutOfSeason(product);
  const badges = productBadges(product);
  const oldPrice = oldPriceOf(product);

  return (
    <Link
      href={productPath(product)}
      className="group flex gap-4 border border-line bg-coal p-3 transition-colors hover:border-gold/60 sm:gap-6 sm:p-4"
    >
      <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-graphite sm:w-36">
        {image && (
          <Image
            src={image.imgUrl}
            alt={product.name}
            fill
            sizes="(min-width: 640px) 9rem, 7rem"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              outOfSeason ? 'grayscale' : ''
            }`}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        {badges.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <li
                key={badge.label}
                className={`px-2 py-0.5 font-display text-[0.6rem] uppercase tracking-[0.2em] ${BADGE_STYLE[badge.tone].card}`}
              >
                {badge.label}
              </li>
            ))}
          </ul>
        )}
        {product.category && <p className="eyebrow text-[0.65rem]">{product.category.name}</p>}
        <p className="mt-1 font-display text-lg uppercase leading-snug tracking-wide text-cream transition-colors group-hover:text-gold sm:text-xl">
          {product.name}
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-stone">{product.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-2 pt-3">
          {outOfSeason ? (
            <span className="text-sm text-stone">Wróci w sezonie</span>
          ) : (
            <span className="flex items-baseline gap-2 font-display">
              <span className="text-xl text-gold">
                {oldPrice !== null && <span className="sr-only">Cena promocyjna: </span>}
                {formatPrice(priceOf(product))}
              </span>
              {oldPrice !== null && (
                <s className="text-sm text-stone">
                  <span className="sr-only">Cena przed promocją: </span>
                  {formatPrice(oldPrice)}
                </s>
              )}
            </span>
          )}
          <span className="link-arrow inline-flex items-center gap-2 text-[0.7rem]">
            Zobacz produkt <FaArrowRight aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
