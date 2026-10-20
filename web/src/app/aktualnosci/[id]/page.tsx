import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleView } from '@/components/ArticleView';
import { api, orFallback } from '@/lib/api';
import { JsonLd } from '@/components/JsonLd';
import { articlePath, pageMetadata } from '@/lib/site';
import { defaultShareImage } from '@/lib/content';
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
    image: article.shareImageUrl
      ? { url: article.shareImageUrl, alt: article.title }
      : cover
        ? { url: cover.imgUrl, alt: article.title }
        : await defaultShareImage(),
  });
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, products] = await Promise.all([orFallback(api.article(id), null), orFallback(api.products(), [])]);
  if (!article) notFound();

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
      <ArticleView article={article} products={products} />
    </article>
  );
}
