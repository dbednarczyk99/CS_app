import { useInput } from 'react-admin';
import { useWatch } from 'react-hook-form';
import { ImageUploadField } from './ImageUploadField';

type FormImage = { src?: string; imgUrl?: string };

/**
 * Wpis: opcjonalne zdjęcie w podglądzie linku (Facebook, Messenger). Puste – podgląd pokazuje okładkę
 * (pierwsze zdjęcie wpisu), a bez zdjęć – domyślne zdjęcie strony.
 */
export const ShareImageInput = () => {
  const { field } = useInput({ source: 'shareImageUrl' });
  const images = useWatch({ name: 'images' }) as FormImage[] | undefined;
  const cover = images?.[0]?.src || images?.[0]?.imgUrl;
  return (
    <ImageUploadField
      label="Zdjęcie przy udostępnianiu (opcjonalnie)"
      value={(field.value as string | null) || null}
      onChange={(url) => field.onChange(url)}
      help="Poziome 1200 × 630 px – pokazuje się, gdy ktoś udostępni link do wpisu na Facebooku czy w Messengerze."
      aspect="1.91 / 1"
      removable
      fallbackUrl={cover}
      fallbackNote={cover ? 'Bez własnego zdjęcia – okładka wpisu (pierwsze zdjęcie poniżej).' : undefined}
    />
  );
};
