import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Regulamin rezerwacji',
  description: 'Zasady rezerwacji pieczywa z odbiorem w piekarniach Chleba Smak i z chlebowozu.',
  path: '/regulamin',
});

export default function TermsPage() {
  return <LegalDocument file="regulamin-rezerwacji.md" />;
}
