import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Polityka prywatności',
  description: 'Jak Chleba Smak przetwarza dane osobowe osób korzystających z serwisu i składających rezerwacje.',
  path: '/polityka-prywatnosci',
});

export default function PrivacyPage() {
  return <LegalDocument file="polityka-prywatnosci.md" />;
}
