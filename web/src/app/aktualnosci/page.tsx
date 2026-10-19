import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { PageHeader } from '@/components/PageHeader';
import { api, orFallback } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { articlePath } from '@/lib/site';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Aktualności',
  description: 'Nowości, sezonowe wypieki i wiadomości z piekarni Chleba Smak.',
  path: '/aktualnosci',
});

export default async function NewsPage() {
  const articles = [...(await orFallback(api.articles(), []))].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <PageHeader eyebrow="Aktualności" title="Co słychać w piekarni" image="/images/galeria/06.jpg" />

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 md:py-24">
        {articles.length === 0 && <p className="text-center text-stone">Wkrótce pojawią się tu pierwsze wpisy.</p>}
        <ul className="divide-y divide-line border-y border-line">
          {articles.map((article) => {
            const image = article.images?.[0];
            return (
              <li key={article.id}>
                <Link
                  href={articlePath(article)}
                  className={`group grid gap-6 py-10 ${image ? 'sm:grid-cols-[14rem_1fr]' : ''}`}
                >
                  {image && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={image.imgUrl}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 14rem, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div>
                    <time dateTime={article.publishedAt} className="eyebrow text-[0.7rem] text-stone">
                      {formatDate(article.publishedAt)}
                    </time>
                    <h2 className="heading mt-3 text-2xl transition-colors group-hover:text-gold sm:text-3xl">
                      {article.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-stone">{article.shortDescription}</p>
                    {article.tags.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map(({ tag }) => (
                          <li key={tag.id} className="border border-line px-2.5 py-0.5 text-xs text-stone">
                            {tag.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="link-arrow mt-5 inline-flex items-center gap-2 text-[0.75rem]">
                      Czytaj <FaArrowRight aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
