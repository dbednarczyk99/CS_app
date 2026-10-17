import type { Metadata } from 'next';
import { NewsletterTokenAction } from '@/components/NewsletterTokenAction';

export const metadata: Metadata = {
  title: 'Wypisz się z newslettera',
  robots: { index: false },
};

/** Link „wypisz się” z wiadomości newslettera */
export default async function UnsubscribeNewsletterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-header sm:px-8">
      <NewsletterTokenAction action="wypisz" token={token} />
    </div>
  );
}
