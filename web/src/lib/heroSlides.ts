import type { HeroSlide } from '@/components/HeroCarousel';
import type { BreadVanStop, Location, Product } from './api';
import { plural } from './format';
import { isAvailable } from './products';

/**
 * Slajdy karuzeli na stronie głównej. Teksty na stałe w kodzie, liczby i nazwy z API;
 * slajd bez danych (np. brak przystanków chlebowozu albo produktów sezonowych) jest pomijany.
 */
export function buildHeroSlides({
  locations,
  stops,
  products,
}: {
  locations: Location[];
  stops: BreadVanStop[];
  products: Product[];
}): HeroSlide[] {
  // tylko sezonowe dostępne teraz (poza sezonem nie reklamujemy)
  const seasonal = products.filter((p) => isAvailable(p) && p.isSeasonal);
  const seasonalWithImage = seasonal.find((p) => p.images?.length);

  const slides: (HeroSlide | null)[] = [
    {
      key: 'marka',
      name: 'Piekarnia',
      eyebrow: 'Piekarnia rzemieślnicza · Kraków',
      title: ['Chleb,', 'który ma czas'],
      text: 'Naturalny zakwas, długa fermentacja i ręczna praca. Codziennie od świtu w naszych krakowskich piekarniach.',
      ctas: [
        { href: '/oferta', label: 'Zobacz ofertę', primary: true },
        { href: '/piekarnie', label: 'Znajdź piekarnię' },
      ],
      // zdjęcie pierwszego slajdu przekazywane osobno (<picture> renderowany na serwerze)
      image: { src: '/images/hero-desktop.jpg', alt: '' },
    },
    {
      key: 'rezerwacja',
      name: 'Rezerwacja',
      eyebrow: 'Rezerwacja online',
      title: ['Twój chleb', 'już czeka'],
      text: 'Zarezerwuj wypieki do 18:00 dnia poprzedniego i odbierz je w piekarni albo w chlebowozie. Płacisz przy odbiorze, bez zakładania konta.',
      ctas: [{ href: '/oferta', label: 'Wybierz wypieki', primary: true }],
      image: { src: '/images/piekarz.jpg', alt: '', position: '60% center' },
      mobileImage: { src: '/images/chleb-deska.jpg', position: 'center 70%' },
    },
    stops.length > 0
      ? {
          key: 'chlebowoz',
          name: 'Chlebowóz',
          eyebrow: 'Chlebowóz',
          title: ['Piekarnia', 'na kółkach'],
          vanStops: stops,
          text: 'Stałe dni i stałe miejsca w całym Krakowie – pieczywo prosto z pieca, bliżej Ciebie.',
          ctas: [{ href: '/chlebowoz', label: 'Sprawdź trasę', primary: true }],
          image: { src: '/images/chlebowoz.jpg', alt: '', position: '65% center' },
          mobileImage: { src: '/images/chlebowoz.jpg', position: '60% center' },
        }
      : null,
    locations.length > 0
      ? {
          key: 'piekarnie',
          name: 'Piekarnie',
          eyebrow: 'Nasze piekarnie',
          title:
            locations.length === 1
              ? ['Piekarnia', 'w Krakowie']
              : [`${locations.length} ${plural(locations.length, ['piekarnia', 'piekarnie', 'piekarni'])}`, 'w Krakowie'],
          text: 'Świeże pieczywo od rana, kawa, kanapki przygotowywane na miejscu i chwila przy stoliku.',
          ctas: [{ href: '/piekarnie', label: 'Znajdź najbliższą', primary: true }],
          image: { src: '/images/lokal.jpg', alt: '', position: '70% center' },
          mobileImage: { src: '/images/wnetrze.jpg', position: 'center' },
        }
      : null,
    seasonalWithImage
      ? {
          key: 'sezonowe',
          name: 'Sezonowo',
          eyebrow: 'Sezonowo',
          title: ['Tylko', 'przez chwilę'],
          text: 'Wypieki, które pojawiają się w naszych piekarniach tylko w swoim sezonie. Sprawdź, co pieczemy teraz – póki sezon trwa.',
          ctas: [{ href: '/oferta?etykiety=sezonowe', label: 'Zobacz sezonowe', primary: true }],
          image: { src: seasonalWithImage.images![0].imgUrl, alt: '', position: 'center' },
        }
      : null,
  ];

  return slides.filter((s): s is HeroSlide => s !== null);
}
