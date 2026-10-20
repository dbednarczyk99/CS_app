import { LegalDocument } from '@/components/LegalDocument';
import { defaultShareImage } from '@/lib/content';
import { pageMetadata } from '@/lib/site';

export const generateMetadata = async () =>
  pageMetadata({
    title: 'Polityka prywatności',
    description: 'Jak Chleba Smak przetwarza dane osobowe osób korzystających z serwisu i składających rezerwacje.',
    path: '/polityka-prywatnosci',
    image: await defaultShareImage(),
  });

export default function PrivacyPage() {
  return <LegalDocument file="polityka-prywatnosci.md" />;
}
