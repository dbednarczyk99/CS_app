import { LegalDocument } from '@/components/LegalDocument';
import { defaultShareImage } from '@/lib/content';
import { pageMetadata } from '@/lib/site';

export const generateMetadata = async () =>
  pageMetadata({
    title: 'Regulamin rezerwacji',
    description: 'Zasady rezerwacji pieczywa z odbiorem w piekarniach Chleba Smak i z chlebowozu.',
    path: '/regulamin',
    image: await defaultShareImage(),
  });

export default function TermsPage() {
  return <LegalDocument file="regulamin-rezerwacji.md" />;
}
