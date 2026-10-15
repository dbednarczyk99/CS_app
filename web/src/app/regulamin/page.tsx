import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';

export const metadata: Metadata = {
  title: 'Regulamin rezerwacji',
  description: 'Zasady rezerwacji pieczywa z odbiorem w piekarniach Chleba Smak i z chlebowozu.',
};

export default function TermsPage() {
  return <LegalDocument file="regulamin-rezerwacji.md" />;
}
