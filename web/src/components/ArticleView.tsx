import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import type { Product } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { ProductTile, stripProductTokens, tileIdOf } from './ProductTile';

/** Dane wpisu potrzebne do wyświetlenia (z API albo – w podglądzie – z niezapisanego formularza panelu) */
export interface ArticleViewData {
  title: string;
  shortDescription: string;
  publishedAt: string;
  content?: string;
  images?: { id?: string; imgUrl: string }[];
  tags: { tag: { id: string; name: string } }[];
}

/**
 * Treść wpisu jak na stronie /aktualnosci/[wpis]: nagłówek, okładka, akapity z kafelkami produktów, pozostałe
 * zdjęcia. Używane przez stronę wpisu i podgląd z panelu (/podglad/wpis) – zawsze ten sam wygląd.
 * `preview`: zdjęcia nowo dodane w panelu (jeszcze niewgrane, data:) – bez optymalizacji Next.js.
 */
export function ArticleView({
  article,
  products,
  preview = false,
}: {
  article: ArticleViewData;
  products: Product[];
  preview?: boolean;
}) {
  const [cover, ...rest] = article.images ?? [];
  // kafelki produktów w treści – tylko produkty widoczne na stronie
  const productById = new Map(products.filter((p) => p.isActive).map((p) => [p.id.toLowerCase(), p]));
  const unoptimized = (url: string) => preview && !/^https?:\/\//.test(url);

  return (
    <>
      <Link href="/aktualnosci" className="link-arrow inline-flex items-center gap-3 text-[0.75rem]">
        <FaArrowLeft aria-hidden /> Aktualności
      </Link>

      <header className="mt-10">
        <time dateTime={article.publishedAt} className="eyebrow text-stone">
          {formatDate(article.publishedAt)}
        </time>
        <h1 className="heading mt-4 text-4xl sm:text-5xl">{article.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-cream/85">{article.shortDescription}</p>
        {article.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {article.tags.map(({ tag }) => (
              <li key={tag.id} className="border border-line px-2.5 py-0.5 text-xs text-stone">
                {tag.name}
              </li>
            ))}
          </ul>
        )}
      </header>

      {cover && (
        <div className="relative mt-12 aspect-[16/10] overflow-hidden">
          <Image
            src={cover.imgUrl}
            alt=""
            fill
            priority
            unoptimized={unoptimized(cover.imgUrl)}
            sizes="(min-width: 768px) 48rem, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-12 h-px w-16 bg-gold" />
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-cream/90">
        {(article.content ?? '')
          .split(/\n{2,}|\r\n\r\n/)
          .filter(Boolean)
          .map((paragraph, i) => {
            const tileId = tileIdOf(paragraph);
            if (tileId) {
              const product = productById.get(tileId);
              return product ? (
                <div key={i} className="py-2">
                  <ProductTile product={product} />
                </div>
              ) : null;
            }
            const text = stripProductTokens(paragraph);
            return text ? (
              <p key={i} className="whitespace-pre-line">
                {text}
              </p>
            ) : null;
          })}
      </div>

      {rest.length > 0 && (
        <div className="mt-12 grid grid-cols-2 gap-3">
          {rest.map((image, i) => (
            <div key={image.id ?? `${i}-${image.imgUrl.slice(-24)}`} className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image.imgUrl}
                alt=""
                fill
                unoptimized={unoptimized(image.imgUrl)}
                sizes="(min-width: 768px) 24rem, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
