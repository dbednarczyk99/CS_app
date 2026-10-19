/**
 * Opis edytowalnych sekcji strony („domowy WordPress”): pola, limity znaków i wartości domyślne (= obecne teksty
 * strony). Serwer sprawdza zapis według tego opisu, a panel na jego podstawie sam buduje formularze –
 * nowa sekcja to nowa pozycja tutaj (+ jej użycie na stronie). Wartości domyślne strony są też w
 * web/src/lib/content-defaults.ts (awaryjnie, gdy API nie odpowiada) – przy zmianie domyślnych tekstów
 * zaktualizować oba pliki.
 */

export type Field =
  | {
      name: string;
      label: string;
      type: 'text';
      max: number;
      required?: boolean;
      help?: string;
    }
  | {
      name: string;
      label: string;
      type: 'textarea';
      max: number;
      required?: boolean;
      help?: string;
      rows?: number;
    }
  | {
      name: string;
      label: string;
      type: 'image';
      help?: string;
      required?: boolean;
    }
  | { name: string; label: string; type: 'toggle'; help?: string }
  | {
      name: string;
      label: string;
      type: 'list';
      help?: string;
      min: number;
      max: number;
      /** nazwa pojedynczego elementu w panelu, np. „Zdjęcie” */
      itemLabel: string;
      fields: Field[];
    };

/** Zdjęcie w treści: adres (wgrany plik albo zdjęcie strony) i opis dla niewidomych / Google */
export type ImageValue = { url: string; alt: string };

export type Section = {
  key: string;
  /** strona w panelu (grupa ekranów), np. „home” */
  page: string;
  title: string;
  description?: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

const img = (url: string, alt: string): ImageValue => ({ url, alt });

export const SECTIONS: Section[] = [
  {
    key: 'home.values',
    page: 'home',
    title: 'Wartości (pod karuzelą)',
    description: 'Trzy krótkie hasła z opisem – pasek tuż pod karuzelą.',
    fields: [
      {
        name: 'items',
        label: 'Wartości',
        type: 'list',
        min: 3,
        max: 3,
        itemLabel: 'Wartość',
        fields: [
          {
            name: 'title',
            label: 'Tytuł',
            type: 'text',
            max: 30,
            required: true,
          },
          {
            name: 'text',
            label: 'Opis',
            type: 'textarea',
            max: 160,
            required: true,
            rows: 2,
          },
        ],
      },
    ],
    defaults: {
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
  },
  {
    key: 'home.featured',
    page: 'home',
    title: 'Wypieki (karuzela produktów)',
    description:
      'Nagłówek sekcji z produktami. Produkty wybierają się same: najpierw promocje i produkty z etykietami.',
    fields: [
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 60, required: true },
      {
        name: 'linkLabel',
        label: 'Napis linku do oferty',
        type: 'text',
        max: 30,
        required: true,
      },
    ],
    defaults: {
      eyebrow: 'Z naszego pieca',
      title: 'Wypieki, po które się wraca',
      linkLabel: 'Cała oferta',
    },
  },
  {
    key: 'home.rating',
    page: 'home',
    title: 'Opinie w Google',
    description:
      'Pasek z oceną w Google i kartami piekarni (pokazuje się, gdy piekarnie mają ocenę).',
    fields: [
      { name: 'visible', label: 'Pokazuj na stronie głównej', type: 'toggle' },
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      {
        name: 'cta',
        label: 'Zachęta nad kartami piekarni',
        type: 'text',
        max: 60,
        required: true,
      },
    ],
    defaults: {
      visible: true,
      eyebrow: 'Opinie naszych gości',
      cta: 'Byłeś u nas? Oceń swoją piekarnię w Google',
    },
  },
  {
    key: 'home.about',
    page: 'home',
    title: 'O nas (skrót)',
    description: 'Zdjęcie z tekstem i linkiem do strony „O nas”.',
    fields: [
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 70, required: true },
      {
        name: 'text',
        label: 'Tekst',
        type: 'textarea',
        max: 600,
        required: true,
        rows: 5,
        help: 'Akapity oddziel pustą linią',
      },
      {
        name: 'image',
        label: 'Zdjęcie',
        type: 'image',
        required: true,
        help: 'Najlepiej pionowe (4:5)',
      },
      {
        name: 'showCount',
        label: 'Pokazuj liczbę piekarni na zdjęciu („4 piekarnie w Krakowie”)',
        type: 'toggle',
      },
      {
        name: 'linkLabel',
        label: 'Napis linku do „O nas”',
        type: 'text',
        max: 30,
        required: true,
      },
    ],
    defaults: {
      eyebrow: 'O nas',
      title: 'Rzemiosło, które czuć w każdym kęsie',
      text:
        'Chleba Smak to piekarnia rzemieślnicza, w której chleb robi się tak jak kiedyś: na naturalnym zakwasie, z dobrej mąki i bez pośpiechu.\n\n' +
        'Codziennie rano na nasze półki trafiają chrupiące bochenki, maślane drożdżówki i sezonowe wypieki – w naszych krakowskich piekarniach i w chlebowozie.',
      image: img(
        '/images/piekarz.jpg',
        'Piekarz trzymający świeże bochenki chleba',
      ),
      showCount: true,
      linkLabel: 'Poznaj nas',
    },
  },
  {
    key: 'home.quote',
    page: 'home',
    title: 'Cytat na zdjęciu',
    description: 'Duże hasło na zdjęciu przez całą szerokość strony.',
    fields: [
      { name: 'visible', label: 'Pokazuj na stronie głównej', type: 'toggle' },
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      {
        name: 'line1',
        label: 'Hasło – pierwsza linia',
        type: 'text',
        max: 40,
        required: true,
      },
      {
        name: 'highlight',
        label: 'Hasło – druga linia (złota)',
        type: 'text',
        max: 30,
      },
      {
        name: 'text',
        label: 'Tekst pod hasłem',
        type: 'textarea',
        max: 160,
        rows: 2,
      },
      {
        name: 'image',
        label: 'Zdjęcie tła',
        type: 'image',
        required: true,
        help: 'Poziome, jasne zdjęcia zostaną przyciemnione',
      },
    ],
    defaults: {
      visible: true,
      eyebrow: 'Nasza filozofia',
      line1: 'Mąka, woda, sól',
      highlight: 'i czas.',
      text: 'Tyle potrzeba, żeby upiec dobry chleb. Resztę robi cierpliwość.',
      image: img('/images/zakwas.jpg', ''),
    },
  },
  {
    key: 'home.locations',
    page: 'home',
    title: 'Nasze piekarnie',
    description:
      'Nagłówek sekcji z kartami piekarni (adresy i godziny z zakładki „Piekarnie”).',
    fields: [
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 60, required: true },
      {
        name: 'linkLabel',
        label: 'Napis linku do strony „Piekarnie”',
        type: 'text',
        max: 30,
        required: true,
      },
    ],
    defaults: {
      eyebrow: 'Odwiedź nas',
      title: 'Nasze piekarnie',
      linkLabel: 'Godziny i dojazd',
    },
  },
  {
    key: 'home.van',
    page: 'home',
    title: 'Chlebowóz',
    description: 'Zdjęcie z tekstem i przyciskiem do trasy chlebowozu.',
    fields: [
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 70, required: true },
      {
        name: 'text',
        label: 'Tekst',
        type: 'textarea',
        max: 300,
        required: true,
        rows: 3,
      },
      {
        name: 'image',
        label: 'Zdjęcie',
        type: 'image',
        required: true,
        help: 'Poziome (3:2)',
      },
      {
        name: 'buttonLabel',
        label: 'Napis przycisku',
        type: 'text',
        max: 30,
        required: true,
      },
    ],
    defaults: {
      eyebrow: 'Chlebowóz',
      title: 'Przyjeżdżamy z pieczywem do Ciebie',
      text: 'Nasz chlebowóz w stałe dni tygodnia zatrzymuje się w kolejnych punktach miasta. Sprawdź trasę i złap świeży chleb po drodze.',
      image: img(
        '/images/chlebowoz.jpg',
        'Świeże bochenki na drewnianej łopacie',
      ),
      buttonLabel: 'Sprawdź trasę',
    },
  },
  {
    key: 'home.news',
    page: 'home',
    title: 'Aktualności',
    description: 'Nagłówek sekcji z trzema najnowszymi wpisami.',
    fields: [
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 60, required: true },
      {
        name: 'linkLabel',
        label: 'Napis linku do wszystkich wpisów',
        type: 'text',
        max: 30,
        required: true,
      },
    ],
    defaults: {
      eyebrow: 'Aktualności',
      title: 'Co słychać w piekarni',
      linkLabel: 'Wszystkie wpisy',
    },
  },
  {
    key: 'home.gallery',
    page: 'home',
    title: 'Galeria „Prosto z piekarni”',
    description: 'Przewijana galeria zdjęć na dole strony.',
    fields: [
      { name: 'visible', label: 'Pokazuj na stronie głównej', type: 'toggle' },
      {
        name: 'eyebrow',
        label: 'Nadtytuł',
        type: 'text',
        max: 40,
        required: true,
      },
      { name: 'title', label: 'Tytuł', type: 'text', max: 60, required: true },
      {
        name: 'instagramLabel',
        label: 'Napis linku do Instagrama',
        type: 'text',
        max: 30,
        help: 'Link pokazuje się, gdy Instagram jest w „Media społecznościowe”',
      },
      {
        name: 'images',
        label: 'Zdjęcia',
        type: 'list',
        min: 4,
        max: 16,
        itemLabel: 'Zdjęcie',
        help: 'Najlepiej pionowe (3:4). Kolejność zmienisz strzałkami.',
        fields: [
          { name: 'image', label: 'Zdjęcie', type: 'image', required: true },
        ],
      },
    ],
    defaults: {
      visible: true,
      eyebrow: 'Zajrzyj do nas',
      title: 'Prosto z piekarni',
      instagramLabel: 'Obserwuj nas',
      images: ['01', '02', '03', '04', '05', '06', '07', '08'].map((n, i) => ({
        image: img(
          `/images/galeria/${n}.jpg`,
          `Wypieki Chleba Smak – zdjęcie ${i + 1}`,
        ),
      })),
    },
  },
];

export const SECTION_BY_KEY = new Map(SECTIONS.map((s) => [s.key, s]));
