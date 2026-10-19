import { api, orFallback } from './api';

/**
 * Treści strony edytowane w panelu („Strona”). API zwraca sekcje uzupełnione wartościami domyślnymi;
 * DEFAULTS poniżej to te same teksty – używane tylko awaryjnie, gdy API nie odpowiada (strona nigdy nie jest
 * pusta). Opis pól i limity: backend/src/modules/content/sections.ts – przy zmianie domyślnych tekstów
 * zaktualizować oba pliki.
 */

export type ContentImage = { url: string; alt: string };

export interface HomeContent {
  'home.values': { items: { title: string; text: string }[] };
  'home.featured': { eyebrow: string; title: string; linkLabel: string };
  'home.rating': { visible: boolean; eyebrow: string; cta: string };
  'home.about': {
    eyebrow: string;
    title: string;
    text: string;
    image: ContentImage;
    showCount: boolean;
    linkLabel: string;
  };
  'home.quote': {
    visible: boolean;
    eyebrow: string;
    line1: string;
    highlight: string;
    text: string;
    image: ContentImage;
  };
  'home.locations': { eyebrow: string; title: string; linkLabel: string };
  'home.van': { eyebrow: string; title: string; text: string; image: ContentImage; buttonLabel: string };
  'home.news': { eyebrow: string; title: string; linkLabel: string };
  'home.gallery': {
    visible: boolean;
    eyebrow: string;
    title: string;
    instagramLabel: string;
    images: { image: ContentImage }[];
  };
}

export type SiteContent = HomeContent;

const DEFAULTS: SiteContent = {
  'home.values': {
    items: [
      {
        title: 'Naturalny zakwas',
        text: 'Bez polepszaczy i skrótów. Tylko mąka, woda, sól i czas potrzebny na dobrą fermentację.',
      },
      {
        title: 'Ręczna praca',
        text: 'Każdy bochenek formujemy ręcznie. Dlatego żaden nie jest identyczny – i dobrze.',
      },
      {
        title: 'Codziennie świeże',
        text: 'Pieczemy nocą i nad ranem, żeby rano na półkach czekało pieczywo prosto z pieca.',
      },
    ],
  },
  'home.featured': { eyebrow: 'Z naszego pieca', title: 'Wypieki, po które się wraca', linkLabel: 'Cała oferta' },
  'home.rating': { visible: true, eyebrow: 'Opinie naszych gości', cta: 'Byłeś u nas? Oceń swoją piekarnię w Google' },
  'home.about': {
    eyebrow: 'O nas',
    title: 'Rzemiosło, które czuć w każdym kęsie',
    text:
      'Chleba Smak to piekarnia rzemieślnicza, w której chleb robi się tak jak kiedyś: na naturalnym zakwasie, z dobrej mąki i bez pośpiechu.\n\n' +
      'Codziennie rano na nasze półki trafiają chrupiące bochenki, maślane drożdżówki i sezonowe wypieki – w naszych krakowskich piekarniach i w chlebowozie.',
    image: { url: '/images/piekarz.jpg', alt: 'Piekarz trzymający świeże bochenki chleba' },
    showCount: true,
    linkLabel: 'Poznaj nas',
  },
  'home.quote': {
    visible: true,
    eyebrow: 'Nasza filozofia',
    line1: 'Mąka, woda, sól',
    highlight: 'i czas.',
    text: 'Tyle potrzeba, żeby upiec dobry chleb. Resztę robi cierpliwość.',
    image: { url: '/images/zakwas.jpg', alt: '' },
  },
  'home.locations': { eyebrow: 'Odwiedź nas', title: 'Nasze piekarnie', linkLabel: 'Godziny i dojazd' },
  'home.van': {
    eyebrow: 'Chlebowóz',
    title: 'Przyjeżdżamy z pieczywem do Ciebie',
    text: 'Nasz chlebowóz w stałe dni tygodnia zatrzymuje się w kolejnych punktach miasta. Sprawdź trasę i złap świeży chleb po drodze.',
    image: { url: '/images/chlebowoz.jpg', alt: 'Świeże bochenki na drewnianej łopacie' },
    buttonLabel: 'Sprawdź trasę',
  },
  'home.news': { eyebrow: 'Aktualności', title: 'Co słychać w piekarni', linkLabel: 'Wszystkie wpisy' },
  'home.gallery': {
    visible: true,
    eyebrow: 'Zajrzyj do nas',
    title: 'Prosto z piekarni',
    instagramLabel: 'Obserwuj nas',
    images: ['01', '02', '03', '04', '05', '06', '07', '08'].map((n, i) => ({
      image: { url: `/images/galeria/${n}.jpg`, alt: `Wypieki Chleba Smak – zdjęcie ${i + 1}` },
    })),
  },
};

/** Wszystkie treści: z API, a każda brakująca sekcja – awaryjnie z wartości domyślnych */
export async function getContent(): Promise<SiteContent> {
  const fromApi = await orFallback(api.content(), {} as Partial<SiteContent>);
  return Object.fromEntries(
    (Object.keys(DEFAULTS) as (keyof SiteContent)[]).map((key) => [key, { ...DEFAULTS[key], ...(fromApi[key] ?? {}) }]),
  ) as unknown as SiteContent;
}

/** Tekst z akapitami oddzielonymi pustą linią → lista akapitów */
export const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
