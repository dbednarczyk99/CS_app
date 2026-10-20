import type { HeroSlide } from '@/components/HeroCarousel';
import type { BreadVanStop, HeroSlideData, Location, Product } from './api';
import { plural } from './format';
import { isAvailable } from './products';

// awaryjnie (API nie odpowiada / wszystkie slajdy wyłączone) – jeden slajd marki, jak dotąd pierwszy
const FALLBACK: HeroSlide = {
  key: 'marka',
  name: 'Piekarnia',
  eyebrow: 'Piekarnia rzemieślnicza · Kraków',
  title: ['Chleb,', 'który ma czas'],
  text: 'Naturalny zakwas, długa fermentacja i ręczna praca. Codziennie od świtu w naszych krakowskich piekarniach.',
  ctas: [
    { href: '/oferta', label: 'Zobacz ofertę', primary: true },
    { href: '/piekarnie', label: 'Znajdź piekarnię' },
  ],
  image: { src: '/images/hero-desktop.jpg', alt: 'Przekrojony chleb na zakwasie w lnianej ściereczce' },
  mobileImage: { src: '/images/hero-mobile.jpg', position: '70% center' },
};

/**
 * Slajdy karuzeli z panelu (Strona → Karuzela), w kolejności z panelu. Slajdy automatyczne biorą dane z panelu
 * i są pomijane, gdy danych brak: chlebowóz (najbliższy przystanek – bez trasy slajdu nie ma), piekarnie
 * ({piekarnie} w tytule → „4 piekarnie”), sezonowe (tylko gdy jakiś produkt sezonowy jest teraz dostępny).
 * Każdy slajd ma własne zdjęcie (wymagane w panelu).
 */
export function buildHeroSlides({
  slides,
  locations,
  stops,
  products,
}: {
  slides: HeroSlideData[];
  locations: Location[];
  stops: BreadVanStop[];
  products: Product[];
}): HeroSlide[] {
  // slajd sezonowy tylko wtedy, gdy jakiś produkt sezonowy jest teraz dostępny (poza sezonem nie reklamujemy)
  const hasSeasonal = products.some((p) => isAvailable(p) && p.isSeasonal);
  const bakeries =
    locations.length === 1
      ? '1 piekarnia'
      : `${locations.length} ${plural(locations.length, ['piekarnia', 'piekarnie', 'piekarni'])}`;

  const built = slides.map((s): HeroSlide | null => {
    if (s.kind === 'VAN' && stops.length === 0) return null;
    if (s.kind === 'BAKERIES' && locations.length === 0) return null;
    if (s.kind === 'SEASONAL' && !hasSeasonal) return null;

    const fill = (text: string) => (s.kind === 'BAKERIES' ? text.replace(/\{piekarnie\}/gi, bakeries) : text);
    const ctas = [
      s.cta1Label && s.cta1Href ? { href: s.cta1Href, label: s.cta1Label, primary: true } : null,
      s.cta2Label && s.cta2Href ? { href: s.cta2Href, label: s.cta2Label } : null,
    ].filter((c): c is { href: string; label: string; primary?: boolean } => c !== null);

    return {
      key: s.id,
      name: s.name,
      eyebrow: s.eyebrow,
      title: [fill(s.titleLine1), fill(s.titleLine2)].filter(Boolean),
      text: fill(s.text),
      ...(s.kind === 'VAN' ? { vanStops: stops } : {}),
      ctas,
      image: { src: s.imageUrl, alt: s.imageAlt, position: s.imagePosition },
      ...(s.mobileImageUrl ? { mobileImage: { src: s.mobileImageUrl, position: s.mobileImagePosition } } : {}),
    };
  });

  const result = built.filter((s): s is HeroSlide => s !== null);
  return result.length > 0 ? result : [FALLBACK];
}
