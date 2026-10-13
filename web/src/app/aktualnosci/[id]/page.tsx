import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { api, orFallback } from '@/lib/api';
import { formatDate } from '@/lib/format';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await orFallback(api.article(id), null);
  return article ? { title: article.title, description: article.shortDescription } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await orFallback(api.article(id), null);
  if (!article) notFound();

  const [cover, ...rest] = article.images ?? [];

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <Link href="/aktualnosci" className="link-arrow inline-flex items-center gap-3 text-[0.75rem]">
        <FaArrowLeft aria-hidden /> Aktualności
      </Link>

      <header className="mt-10">
        <time dateTime={article.createdAt} className="eyebrow text-stone">
          {formatDate(article.createdAt)}
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
          .map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
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
