import type { Metadata } from 'next';
import { NewsletterTokenAction } from '@/components/NewsletterTokenAction';

export const metadata: Metadata = {
  title: 'Potwierdź zapis do newslettera',
  robots: { index: false },
};

/** Link z e-maila potwierdzającego zapis (double opt-in) */
export default async function ConfirmNewsletterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="mx-auto max-w-2xl px-5 pb-24 pt-header sm:px-8">
      <NewsletterTokenAction action="potwierdz" token={token} />
    </div>
  );
}
