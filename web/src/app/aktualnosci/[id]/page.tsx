import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { ProductTile, stripProductTokens, tileIdOf } from '@/components/ProductTile';
import { api, orFallback } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { JsonLd } from '@/components/JsonLd';
import { articlePath, pageMetadata } from '@/lib/site';
import { articleLd, breadcrumbsLd } from '@/lib/structured-data';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await orFallback(api.article(id), null);
  if (!article) return {};
  const cover = article.images?.[0];
  // adres kanoniczny i podgląd linku przy udostępnianiu z okładką wpisu
  return pageMetadata({
    title: article.title,
    description: article.shortDescription,
    path: articlePath(article),
    type: 'article',
    publishedTime: article.publishedAt,
    ...(cover ? { image: { url: cover.imgUrl, alt: article.title } } : {}),
  });
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, products] = await Promise.all([orFallback(api.article(id), null), orFallback(api.products(), [])]);
  if (!article) notFound();

  const [cover, ...rest] = article.images ?? [];
  // kafelki produktów w treści – tylko produkty widoczne na stronie
  const productById = new Map(products.filter((p) => p.isActive).map((p) => [p.id.toLowerCase(), p]));

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-header sm:px-8">
      <JsonLd
        data={[
          articleLd(article),
          breadcrumbsLd([
            { name: 'Aktualności', path: '/aktualnosci' },
            { name: article.title, path: articlePath(article) },
          ]),
        ]}
      />
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
          <Image src={cover.imgUrl} alt="" fill priority sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
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
          {rest.map((image) => (
            <div key={image.id} className="relative aspect-[4/3] overflow-hidden">
              <Image src={image.imgUrl} alt="" fill sizes="(min-width: 768px) 24rem, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
