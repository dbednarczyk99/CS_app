/**
 * Sekcje podstron (O nas, Oferta, Piekarnie, Chlebowóz, Aktualności, Kontakt, Rezerwacja), elementów wspólnych
 * (stopka, okienko newslettera, strona 404) i SEO każdej strony. Domyślne wartości = teksty strony sprzed panelu.
 */
import { img, type Field, type Section } from './section-types';

const text = (
  name: string,
  label: string,
  max: number,
  extra: Partial<Extract<Field, { type: 'text' }>> = {},
): Field => ({ name, label, type: 'text', max, required: true, ...extra });

const area = (
  name: string,
  label: string,
  max: number,
  extra: Partial<Extract<Field, { type: 'textarea' }>> = {},
): Field => ({
  name,
  label,
  type: 'textarea',
  max,
  required: true,
  rows: 3,
  ...extra,
});

const image = (
  name: string,
  label: string,
  help?: string,
  required = true,
  aspect?: string,
): Field => ({ name, label, type: 'image', required, help, aspect });

const EYEBROW = text('eyebrow', 'Nadtytuł', 40);
const HEADER_IMAGE = image(
  'image',
  'Zdjęcie w tle',
  'Poziome, duże (najlepiej 2400 px szerokości); jest przyciemnione, tekst leży na dole',
  true,
  '16 / 9',
);

/** Nagłówek podstrony: zdjęcie w tle, nadtytuł, tytuł i (opcjonalnie) tekst pod tytułem */
function header(
  page: string,
  defaults: { eyebrow: string; title: string; text?: string; image: string },
  textField?: Field,
): Section {
  return {
    key: `${page}.header`,
    page,
    title: 'Nagłówek strony',
    description: 'Duży nagłówek na górze strony – zdjęcie w tle z tytułem.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      ...(textField ? [textField] : []),
      HEADER_IMAGE,
    ],
    defaults: {
      eyebrow: defaults.eyebrow,
      title: defaults.title,
      ...(defaults.text !== undefined ? { text: defaults.text } : {}),
      image: img(defaults.image, ''),
    },
  };
}

/**
 * „Wyszukiwarka i udostępnianie”: tytuł i opis w Google oraz zdjęcie w podglądzie linku (Facebook, Messenger,
 * WhatsApp). Puste zdjęcie = domyślne z „Elementy wspólne”.
 */
function seo(
  page: string,
  path: string,
  title: string,
  description: string,
  suffix = true,
): Section {
  return {
    key: `seo.${page}`,
    page,
    title: 'Wyszukiwarka i udostępnianie (SEO)',
    description:
      'Tak strona wygląda w wynikach Google i w podglądzie linku na Facebooku czy w Messengerze. Google pokazuje zwykle ok. 60 znaków tytułu i ok. 155 znaków opisu – dłuższe obcina. Google odświeża wyniki po kilku dniach; Facebook pamięta podgląd linku – po zmianie zdjęcia użyj „Sharing Debugger” Facebooka (opis w Pomocy).',
    seo: { path, suffix },
    fields: [
      text('title', 'Tytuł w Google', 70, {
        recommended: suffix ? 45 : 60,
        help: suffix
          ? 'Na końcu dopisujemy „ · Chleba Smak”. Najważniejsze słowa na początku.'
          : 'Pełny tytuł strony głównej. Najważniejsze słowa na początku.',
      }),
      area('description', 'Opis w Google', 200, {
        recommended: 155,
        rows: 2,
        help: 'Jedno, dwa zdania zachęcające do wejścia – co tu znajdę.',
      }),
      image(
        'image',
        'Zdjęcie w podglądzie linku (opcjonalnie)',
        'Poziome 1200 × 630 px. Puste – domyślne zdjęcie z „Strona → Podstrony → Elementy wspólne”.',
        false,
        '1.91 / 1',
      ),
    ],
    defaults: { title, description, image: img('', '') },
  };
}

export const HOME_SEO = seo(
  'home',
  '/',
  'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
  'Rzemieślnicza piekarnia z Krakowa: chleb na naturalnym zakwasie, słodkie wypieki i chlebowóz. Nasze piekarnie znajdziesz w różnych częściach Krakowa.',
  false,
);

export const PAGE_SECTIONS: Section[] = [
  // ——— O nas ———
  seo(
    'about',
    '/o-nas',
    'O nas',
    'Poznaj piekarnię rzemieślniczą Chleba Smak – ludzi, zasady i sposób, w jaki pieczemy chleb.',
  ),
  header('about', {
    eyebrow: 'O nas',
    title: 'Piekarnia, w której chleb ma czas',
    image: '/images/piekarz.jpg',
  }),
  {
    key: 'about.story',
    page: 'about',
    title: 'Nasza historia',
    description: 'Tekst ze zdjęciem pod nagłówkiem.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst', 1200, {
        rows: 6,
        help: 'Akapity oddziel pustą linią',
      }),
      image('image', 'Zdjęcie', 'Pionowe (4:5)', true, '4 / 5'),
    ],
    defaults: {
      eyebrow: 'Nasza historia',
      title: 'Zaczęło się od zakwasu',
      text:
        'Chleba Smak powstała z prostej potrzeby: piec chleb, który sami chcielibyśmy jeść każdego dnia. Uczciwy, pachnący, z chrupiącą skórką.\n\n' +
        'Dziś pieczemy dla naszych piekarni w Krakowie i chlebowozu, ale zasady się nie zmieniły – wciąż formujemy bochenki ręcznie i dajemy ciastu tyle czasu, ile potrzebuje.',
      image: img(
        '/images/chleb-deska.jpg',
        'Chleb na zakwasie na drewnianej desce',
      ),
    },
  },
  {
    key: 'about.principles',
    page: 'about',
    title: 'Zasady',
    description: 'Ponumerowane zasady na ciemnym tle.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      {
        name: 'items',
        label: 'Zasady',
        type: 'list',
        min: 2,
        max: 6,
        itemLabel: 'Zasada',
        help: 'Najlepiej wyglądają 4 (jeden rząd na komputerze).',
        fields: [text('title', 'Tytuł', 40), area('text', 'Tekst', 220)],
      },
    ],
    defaults: {
      eyebrow: 'Jak pracujemy',
      title: 'Cztery zasady',
      items: [
        {
          title: 'Zakwas zamiast skrótów',
          text: 'Nasz chleb rośnie na naturalnym zakwasie, który dokarmiamy każdego dnia. Bez polepszaczy, bez spulchniaczy.',
        },
        {
          title: 'Dobre składniki',
          text: 'Mąka z polskich młynów, prawdziwe masło, sezonowe owoce. Krótka lista składników, którą da się przeczytać.',
        },
        {
          title: 'Czas',
          text: 'Długa fermentacja daje chlebowi smak, aromat i chrupiącą skórkę. Nie przyspieszamy jej.',
        },
        {
          title: 'Ludzie',
          text: 'Za każdym bochenkiem stoi zespół piekarzy, którzy pracują wtedy, kiedy miasto śpi.',
        },
      ],
    },
  },
  {
    key: 'about.gallery',
    page: 'about',
    title: 'Zdjęcia i zaproszenie',
    description: 'Rząd zdjęć i hasło z przyciskiem do piekarni na dole strony.',
    fields: [
      {
        name: 'images',
        label: 'Zdjęcia',
        type: 'list',
        min: 4,
        max: 8,
        itemLabel: 'Zdjęcie',
        help: 'Pionowe (3:4); najlepiej 4 albo 8 (pełne rzędy).',
        fields: [image('image', 'Zdjęcie', undefined, true, '3 / 4')],
      },
      text('title', 'Hasło', 60),
      text('buttonLabel', 'Napis przycisku', 30, {
        help: 'Przycisk prowadzi do strony „Piekarnie”',
      }),
    ],
    defaults: {
      images: ['02', '05', '08', '03'].map((n) => ({
        image: img(`/images/galeria/${n}.jpg`, ''),
      })),
      title: 'Najlepiej smakuje na miejscu',
      buttonLabel: 'Znajdź piekarnię',
    },
  },

  // ——— Oferta ———
  seo(
    'offer',
    '/oferta',
    'Oferta',
    'Chleby na zakwasie, słodkie wypieki, kanapki i lody rzemieślnicze z piekarni Chleba Smak w Krakowie.',
  ),
  header(
    'offer',
    {
      eyebrow: 'Oferta',
      title: 'Nasze wypieki',
      text: 'Pieczywo i wypieki dostępne w naszych piekarniach. Asortyment zmienia się z porami roku – wypieki sezonowe dostępne teraz mają znaczek „Teraz dostępne”.',
      image: '/images/chleb-deska.jpg',
    },
    area('text', 'Tekst pod tytułem', 300, { required: false }),
  ),

  // ——— Piekarnie ———
  seo(
    'locations',
    '/piekarnie',
    'Piekarnie',
    'Adresy, godziny otwarcia, telefony i dojazd do piekarni Chleba Smak w Krakowie.',
  ),
  header(
    'locations',
    {
      eyebrow: 'Odwiedź nas',
      title: 'Nasze piekarnie',
      text: '{miejsca} w Krakowie, w których czeka na Ciebie świeże pieczywo.',
      image: '/images/lokal.jpg',
    },
    area('text', 'Tekst pod tytułem', 300, {
      required: false,
      help: '{miejsca} zamieni się na liczbę piekarni, np. „4 miejsca”',
    }),
  ),
  {
    key: 'locations.onsite',
    page: 'locations',
    title: 'Na miejscu',
    description: 'Zdjęcie z tekstem pod listą piekarni i mapą.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst', 400),
      image('image', 'Zdjęcie', 'Pionowe (3:4)', true, '3 / 4'),
    ],
    defaults: {
      eyebrow: 'Na miejscu',
      title: 'Usiądź na chwilę',
      text: 'W naszych piekarniach poza pieczywem znajdziesz kawę, kanapki przygotowywane na miejscu, słodkie wypieki i – w sezonie – lody rzemieślnicze.',
      image: img('/images/wnetrze.jpg', 'Wnętrze piekarni Chleba Smak'),
    },
  },
  {
    key: 'locations.van',
    page: 'locations',
    title: 'Zaproszenie do chlebowozu',
    description:
      'Ramka na dole strony z linkiem do trasy chlebowozu (widoczna, gdy chlebowóz ma przystanki).',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst', 400, {
        help: '{przystanki} zamieni się na liczbę miejsc, np. „5 miejscach”',
      }),
      text('cta', 'Napis linku', 40),
      image('image', 'Zdjęcie', 'Poziome (3:2)', true, '3 / 2'),
    ],
    defaults: {
      eyebrow: 'Chlebowóz',
      title: 'Może masz bliżej do chlebowozu?',
      text: 'Nasz chlebowóz zatrzymuje się w {przystanki} Krakowa według stałego, tygodniowego harmonogramu. Sprawdź, czy nie przyjeżdża w Twoją okolicę – pieczywo możesz u niego także zarezerwować.',
      cta: 'Sprawdź trasę chlebowozu',
      image: img('/images/chlebowoz.jpg', 'Chlebowóz Chleba Smak'),
    },
  },

  // ——— Chlebowóz ———
  seo(
    'van',
    '/chlebowoz',
    'Chlebowóz',
    'Trasa chlebowozu Chleba Smak – gdzie i kiedy kupisz nasze świeże pieczywo.',
  ),
  header('van', {
    eyebrow: 'Chlebowóz',
    title: 'Świeże pieczywo w drodze',
    image: '/images/chlebowoz.jpg',
  }),
  {
    key: 'van.schedule',
    page: 'van',
    title: 'Trasa',
    description:
      'Nagłówki przy opisie i trasie. Sam opis chlebowozu i przystanki zmieniasz w „Piekarnie → Chlebowóz”.',
    fields: [
      text('eyebrow', 'Nadtytuł przy opisie', 40),
      text('title', 'Tytuł przy opisie', 60),
      text('scheduleTitle', 'Tytuł trasy', 60),
      text('mapTitle', 'Tytuł mapy', 60),
    ],
    defaults: {
      eyebrow: 'Jak to działa',
      title: 'Stałe dni, stałe miejsca',
      scheduleTitle: 'Trasa w tym tygodniu',
      mapTitle: 'Przystanki na mapie',
    },
  },
  {
    key: 'van.locations',
    page: 'van',
    title: 'Zaproszenie do piekarni',
    description: 'Ramka na dole strony z linkiem do listy piekarni.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst', 400, {
        help: '{piekarnie} zamieni się na „naszej piekarni” albo „jednej z 4 naszych piekarni”',
      }),
      text('cta', 'Napis linku', 40),
      image('image', 'Zdjęcie', 'Poziome (3:2)', true, '3 / 2'),
    ],
    defaults: {
      eyebrow: 'Nasze piekarnie',
      title: 'Może masz bliżej do piekarni?',
      text: 'Chlebowóz nie dojeżdża w Twoje okolice albo nie pasuje Ci godzina? Zajrzyj do {piekarnie} w Krakowie – z pełnym asortymentem, kanapkami i kawą na miejscu.',
      cta: 'Zobacz nasze piekarnie',
      image: img('/images/lokal.jpg', 'Piekarnia Chleba Smak'),
    },
  },

  // ——— Aktualności ———
  seo(
    'news',
    '/aktualnosci',
    'Aktualności',
    'Nowości, sezonowe wypieki i wiadomości z piekarni Chleba Smak.',
  ),
  header('news', {
    eyebrow: 'Aktualności',
    title: 'Co słychać w piekarni',
    image: '/images/galeria/06.jpg',
  }),
  {
    key: 'news.list',
    page: 'news',
    title: 'Lista wpisów',
    fields: [
      text('readMore', 'Napis linku przy wpisie', 20),
      text('empty', 'Gdy nie ma jeszcze wpisów', 120),
    ],
    defaults: {
      readMore: 'Czytaj',
      empty: 'Wkrótce pojawią się tu pierwsze wpisy.',
    },
  },

  // ——— Kontakt ———
  seo(
    'contact',
    '/kontakt',
    'Kontakt',
    'Skontaktuj się z piekarnią Chleba Smak – telefony do piekarni, e-mail i formularz kontaktowy.',
  ),
  header(
    'contact',
    {
      eyebrow: 'Kontakt',
      title: 'Porozmawiajmy',
      text: 'Masz pytanie o zamówienie, chcesz zaproponować współpracę albo podzielić się pomysłem na nowy bochenek? Napisz lub zadzwoń.',
      image: '/images/wnetrze.jpg',
    },
    area('text', 'Tekst pod tytułem', 300, { required: false }),
  ),
  {
    key: 'contact.page',
    page: 'contact',
    title: 'Formularz, Instagram i newsletter',
    description:
      'Telefon, e-mail i piekarnie pod spodem pochodzą z „Kontakt” i „Piekarnie”.',
    fields: [
      text('formTitle', 'Tytuł nad formularzem', 40),
      text('instagramTitle', 'Instagram – tytuł', 40),
      area('instagramText', 'Instagram – tekst', 200, {
        rows: 2,
        help: '{profil} zamieni się na nazwę profilu, np. „@chlebasmak”. Sekcja jest widoczna, gdy Instagram jest w „Media społecznościowe”.',
      }),
      text('instagramButton', 'Instagram – napis przycisku', 30),
      text('newsletterEyebrow', 'Newsletter – nadtytuł', 40),
      text('newsletterTitle', 'Newsletter – tytuł', 40),
      area('newsletterText', 'Newsletter – tekst', 300),
      text('newsletterButton', 'Newsletter – napis przycisku', 40),
    ],
    defaults: {
      formTitle: 'Napisz do nas',
      instagramTitle: 'Wolisz Instagram?',
      instagramText:
        'Napisz do nas wiadomość – link otworzy od razu rozmowę z {profil}.',
      instagramButton: 'Otwórz rozmowę',
      newsletterEyebrow: 'Newsletter',
      newsletterTitle: 'Bądź na bieżąco',
      newsletterText:
        'Nowości, wypieki sezonowe, promocje i konkursy – a do tego ważne informacje, np. o przerwie w kursowaniu chlebowozu czy zmianie godzin piekarni. Bez spamu, wypiszesz się w każdej chwili.',
      newsletterButton: 'Zapisz się do newslettera',
    },
  },

  // ——— Rezerwacja ———
  seo(
    'reservation',
    '/rezerwacja',
    'Rezerwacja',
    'Zarezerwuj pieczywo z odbiorem w piekarni Chleba Smak lub z chlebowozu. Płatność przy odbiorze.',
  ),
  {
    key: 'reservation.header',
    page: 'reservation',
    title: 'Nagłówek strony',
    description:
      'Tytuł nad formularzem rezerwacji. Zasady rezerwacji (terminy, limity) ustawia właściciel w „Rezerwacje → Zasady rezerwacji”.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst pod tytułem', 300, { required: false }),
      area('unavailable', 'Gdy rezerwacje nie działają', 300, {
        help: 'Pokazuje się, gdy serwer rezerwacji chwilowo nie odpowiada',
      }),
    ],
    defaults: {
      eyebrow: 'Rezerwacja',
      title: 'Zarezerwuj pieczywo',
      text: 'Odbierz w wybranej piekarni lub z chlebowozu. Płacisz na miejscu, przy odbiorze.',
      unavailable:
        'Rezerwacje są chwilowo niedostępne. Spróbuj ponownie za kilka minut lub zadzwoń do piekarni.',
    },
  },

  {
    key: 'reservation.form',
    page: 'reservation',
    title: 'Formularz rezerwacji',
    description:
      'Nagłówki kroków, podpowiedzi i przyciski formularza oraz ramka „Jak działa rezerwacja?” na stronie produktu. Zasady (godzina, liczba dni, limit) ustawia właściciel w „Rezerwacje → Zasady rezerwacji” – w tekstach wstawiaj je znacznikami.',
    fields: [
      text('stepProducts', 'Krok 1 – tytuł', 30),
      text('addMore', 'Link do dodania produktów', 40),
      text('stepPickup', 'Krok 2 – tytuł', 30),
      area('rulesNote', 'Krok 2 – zasady pod tytułem', 250, {
        rows: 2,
        help: '{godzina} – godzina zamknięcia, {dni} – np. „5 dni”, {limit} – rezerwacji na telefon (z Rezerwacje → Zasady rezerwacji)',
      }),
      area('noDates', 'Gdy nie ma wolnych terminów', 200, { rows: 2 }),
      text('stepDetails', 'Krok 3 – tytuł', 30),
      text('namePlaceholder', 'Podpowiedź w polu „Imię”', 40),
      text('emailLabel', 'Opis pola „E-mail”', 60),
      text('summaryTitle', 'Podsumowanie – tytuł', 30),
      text('submit', 'Przycisk wysłania', 30),
      text('paymentNote', 'Pod przyciskiem', 100),
      text('successTitle', 'Po wysłaniu – tytuł', 40),
      text('howItWorksTitle', 'Strona produktu – tytuł ramki', 40),
      area('howItWorks', 'Strona produktu – punkty ramki', 500, {
        rows: 4,
        help: 'Każdy punkt w osobnej linii. {godzina} – godzina zamknięcia, {dni} – np. „5 dni”, {limit} – rezerwacji na telefon (z Rezerwacje → Zasady rezerwacji)',
      }),
    ],
    defaults: {
      stepProducts: 'Produkty',
      addMore: '+ Dodaj kolejne produkty',
      stepPickup: 'Odbiór',
      rulesNote:
        'Rezerwacje przyjmujemy do {godzina} dnia poprzedzającego odbiór, maksymalnie {dni} do przodu.',
      noDates:
        'W najbliższych dniach nie ma terminów dostępnych do rezerwacji.',
      stepDetails: 'Twoje dane',
      namePlaceholder: 'Zawołamy Cię przy odbiorze',
      emailLabel: 'E-mail – wyślemy na niego potwierdzenie',
      summaryTitle: 'Podsumowanie',
      submit: 'Zarezerwuj',
      paymentNote: 'Płatność gotówką lub kartą przy odbiorze.',
      successTitle: 'Rezerwacja przyjęta',
      howItWorksTitle: 'Jak działa rezerwacja?',
      howItWorks:
        'Odbiór w jednej z naszych piekarni lub z chlebowozu.\nRezerwacje przyjmujemy do {godzina} dnia poprzedzającego odbiór, maksymalnie {dni} do przodu.\nPłacisz na miejscu, przy odbiorze.',
    },
  },

  // ——— Elementy wspólne ———
  {
    key: 'seo.default',
    page: 'common',
    title: 'Domyślne zdjęcie do udostępniania',
    description:
      'Zdjęcie w podglądzie linku (Facebook, Messenger, WhatsApp) dla stron bez własnego. Produkty i wpisy pokazują swoje zdjęcie.',
    fields: [
      image(
        'image',
        'Zdjęcie',
        'Poziome 1200 × 630 px (proporcje 1,91 : 1); ważne elementy na środku',
        true,
        '1.91 / 1',
      ),
    ],
    defaults: {
      image: img(
        '/images/og-domyslny.jpg',
        'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
      ),
    },
  },
  {
    key: 'common.footer',
    page: 'common',
    title: 'Stopka',
    description:
      'Dół każdej strony. Adresy, telefony, e-mail i media społecznościowe pochodzą z ich zakładek.',
    fields: [
      area('about', 'Tekst pod logo', 200, { rows: 2 }),
      text('newsletterText', 'Newsletter – tekst', 100),
      text('newsletterButton', 'Newsletter – napis przycisku', 30),
      text('copyright', 'Dopisek przy ©', 80, {
        help: 'Rok i „Chleba Smak” dopisujemy sami, np. „© 2026 Chleba Smak · …”',
      }),
    ],
    defaults: {
      about:
        'Rzemieślnicza piekarnia z Krakowa. Chleb na naturalnym zakwasie i słodkie wypieki – codziennie od świtu.',
      newsletterText: 'Nowości, promocje i konkursy – prosto na skrzynkę.',
      newsletterButton: 'Zapisz się',
      copyright: 'Piekarnia Rzemieślnicza · Kraków',
    },
  },
  {
    key: 'common.instagram',
    page: 'common',
    title: 'Instagram – ostatnie posty',
    description:
      'Sekcja z ostatnimi zdjęciami z Instagrama na stronie głównej i w kontakcie. Posty i połączenie z kontem: „Marketing” → „Instagram”. Gdy połączenie nie działa, sekcja sama się ukrywa.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 50),
      text('buttonLabel', 'Napis przycisku', 40, {
        help: '{profil} – nazwa profilu, np. @chlebasmak',
      }),
    ],
    defaults: {
      eyebrow: 'Instagram',
      title: 'Z życia piekarni',
      buttonLabel: 'Obserwuj {profil}',
    },
  },
  {
    key: 'common.newsletter',
    page: 'common',
    title: 'Okienko zapisu do newslettera',
    description:
      'Okienko otwierane przyciskami „Zapisz się”. Treść zgody (wymaganej prawem) zostaje bez zmian.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 40),
      area('text', 'Tekst', 300),
      text('button', 'Napis przycisku', 30),
      text('sentTitle', 'Po wysłaniu – tytuł', 40),
      area('sentText', 'Po wysłaniu – tekst', 300, {
        help: 'Prośba o kliknięcie linku z e-maila (bez potwierdzenia nic nie wysyłamy)',
      }),
    ],
    defaults: {
      eyebrow: 'Newsletter',
      title: 'Bądź na bieżąco',
      text: 'Nowości, wypieki sezonowe, promocje i konkursy, a także ważne informacje – np. o przerwie w kursowaniu chlebowozu czy zmianie godzin piekarni. Bez spamu, wypiszesz się w każdej chwili.',
      button: 'Zapisz się',
      sentTitle: 'Sprawdź skrzynkę',
      sentText:
        'Wysłaliśmy Ci e-mail z linkiem potwierdzającym. Kliknij go, a zaczniemy wysyłać wiadomości – bez potwierdzenia nie wyślemy nic więcej.',
    },
  },
  {
    key: 'common.notFound',
    page: 'common',
    title: 'Strona 404 (nie znaleziono)',
    description:
      'Pokazuje się po wejściu na nieistniejący adres, np. z nieaktualnego linku.',
    fields: [
      EYEBROW,
      text('title', 'Tytuł', 60),
      area('text', 'Tekst', 200, { rows: 2 }),
      text('homeButton', 'Przycisk do strony głównej', 30),
      text('offerButton', 'Przycisk do oferty', 30),
    ],
    defaults: {
      eyebrow: 'Błąd 404',
      title: 'Tego bochenka nie znaleźliśmy',
      text: 'Strona mogła zostać przeniesiona albo już nie istnieje.',
      homeButton: 'Strona główna',
      offerButton: 'Zobacz ofertę',
    },
  },
];
