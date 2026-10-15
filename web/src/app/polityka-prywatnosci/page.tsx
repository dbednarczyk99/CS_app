import type { Metadata } from 'next';
import { LegalDocument } from '@/components/LegalDocument';

export const metadata: Metadata = {
  title: 'Polityka prywatności',
  description: 'Jak Chleba Smak przetwarza dane osobowe osób korzystających z serwisu i składających rezerwacje.',
};

export default function PrivacyPage() {
  return <LegalDocument file="polityka-prywatnosci.md" />;
}
