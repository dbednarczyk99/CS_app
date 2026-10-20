/**
 * Wymagania dla wgrywanych zdjęć: proporcje kadru (null – dowolne, bez przycinania do proporcji),
 * najmniejszy dopuszczalny kadr i największy rozmiar pliku wynikowego (większe zdjęcia są zmniejszane).
 * Wynik to zawsze JPEG – działa na stronie i w każdym programie pocztowym.
 */
export interface ImagePreset {
  aspect: number | null;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export const IMAGE_PRESETS = {
  /** produkt: karta i strona produktu 4:5 */
  product: { aspect: 4 / 5, minWidth: 800, minHeight: 1000, maxWidth: 1600, maxHeight: 2000 },
  /** wpis: lista i galeria 4:3 (okładka 16:10 przycina minimalnie); też zdjęcie w newsletterze */
  article: { aspect: 4 / 3, minWidth: 1200, minHeight: 900, maxWidth: 1600, maxHeight: 1200 },
  /** piekarnia, chlebowóz: strona pokazuje je w różnych kadrach – bez przycinania do proporcji */
  place: { aspect: null, minWidth: 800, minHeight: 800, maxWidth: 2000, maxHeight: 2000 },
  /** podgląd linku (Facebook, Messenger): dokładnie 1200 × 630 */
  share: { aspect: 1200 / 630, minWidth: 1200, minHeight: 630, maxWidth: 1200, maxHeight: 630 },
} satisfies Record<string, ImagePreset>;

/** Wymagania z proporcji podglądu („16 / 9”, „4 / 5”…): poziome min. 1200 px szerokości (szerokie tła 1600), pionowe min. 1000 px wysokości */
export function presetForAspect(aspect: string): ImagePreset {
  const [w, h] = aspect.split('/').map((n) => Number(n.trim()));
  const ratio = w > 0 && h > 0 ? w / h : 4 / 3;
  if (Math.abs(ratio - IMAGE_PRESETS.share.aspect) < 0.02) return IMAGE_PRESETS.share;
  if (ratio >= 1) {
    const minWidth = ratio >= 1.7 ? 1600 : 1200;
    return { aspect: ratio, minWidth, minHeight: Math.round(minWidth / ratio), maxWidth: 2400, maxHeight: Math.round(2400 / ratio) };
  }
  return { aspect: ratio, minWidth: Math.round(1000 * ratio), minHeight: 1000, maxWidth: Math.round(2000 * ratio), maxHeight: 2000 };
}

/** Krótki opis wymagań pod przyciskiem wyboru zdjęcia */
export function presetHint(preset: ImagePreset) {
  const min = `min. ${preset.minWidth} × ${preset.minHeight} px`;
  return preset.aspect
    ? `${min} · kadr ${ratioLabel(preset.aspect)} ustawisz po wybraniu zdjęcia`
    : `${min} · większe zdjęcia zmniejszymy automatycznie`;
}

const KNOWN: [number, string][] = [
  [4 / 5, '4:5'],
  [3 / 4, '3:4'],
  [4 / 3, '4:3'],
  [3 / 2, '3:2'],
  [16 / 9, '16:9'],
  [16 / 10, '16:10'],
  [1200 / 630, '1,91:1'],
  [1, '1:1'],
];
export const ratioLabel = (ratio: number) =>
  KNOWN.find(([r]) => Math.abs(r - ratio) < 0.01)?.[1] ?? ratio.toFixed(2).replace('.', ',') + ':1';

/** Wycina fragment zdjęcia, zmniejsza do `width × height` i zapisuje jako JPEG */
export async function cropImage(
  src: string,
  area: { x: number; y: number; width: number; height: number },
  width: number,
  height: number,
  name: string,
): Promise<File> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  // przezroczyste tło PNG → białe (JPEG nie ma przezroczystości)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
  if (!blob) throw new Error('toBlob');
  return new File([blob], name.replace(/\.[^.]*$/, '') + '.jpg', { type: 'image/jpeg' });
}
