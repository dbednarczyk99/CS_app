import {
  PrismaClient,
  Role,
  ContactType,
  Weekday,
  MediaName,
} from '@prisma/client';
import { randomBytes } from 'crypto';
import { seedStats } from './seed-stats';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- USERS ---
  await prisma.user.deleteMany();
  // dwa konta jak docelowo: właściciel (wszystko) i social media (treści strony, bez danych klientów)
  await prisma.user.createMany({
    data: [
      {
        login: 'admin',
        name: 'Właściciel',
        password: bcrypt.hashSync('admin123', 10),
        role: Role.ADMIN,
      },
      {
        login: 'social',
        name: 'Social media',
        password: bcrypt.hashSync('social12345', 10),
        role: Role.EDITOR,
      },
    ],
  });

  // --- PRODUCTS & CATEGORIES ---
  // Asortyment na podstawie zdjęć z sesji (zdjęcia w uploads/seed). Ceny są przykładowe.
  await prisma.reservation.deleteMany();
  await prisma.productImages.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const API_PUBLIC_URL = process.env.API_PUBLIC_URL ?? 'http://localhost:3000';
  const seedImage = (file: string) => ({
    create: [{ imgUrl: `${API_PUBLIC_URL}/uploads/seed/${file}`, order: 0 }],
  });

  const catalog: {
    category: string;
    products: {
      name: string;
      description: string;
      price: number;
      image: string;
      isSeasonal?: boolean;
    }[];
  }[] = [
    {
      category: 'Chleby',
      products: [
        {
          name: 'Chleb pszenny na zakwasie',
          description:
            'Nasz klasyk: pszenny bochenek na naturalnym zakwasie, 24 godziny fermentacji, chrupiąca skórka i wilgotny, dziurawy miąższ.',
          price: 16,
          image: 'chleb-pszenny-na-zakwasie.jpg',
        },
        {
          name: 'Chleb żytni razowy',
          description:
            'Ciemny chleb z mąki żytniej razowej na zakwasie, z dodatkiem ziaren i płatków owsianych. Długo zachowuje świeżość.',
          price: 15,
          image: 'chleb-zytni-razowy.jpg',
        },
        {
          name: 'Chleb rustykalny',
          description:
            'Pszenno-żytni bochenek o głębokim, lekko kwaskowym smaku, wypiekany na kamieniu.',
          price: 14,
          image: 'chleb-rustykalny.jpg',
        },
        {
          name: 'Bagietka',
          description:
            'Smukła bagietka na zakwasie z cienką, chrupiącą skórką. Najlepsza w dniu wypieku.',
          price: 7,
          image: 'bagietka.jpg',
        },
      ],
    },
    {
      category: 'Słodkie wypieki',
      products: [
        {
          name: 'Jagodzianka',
          description:
            'Maślana drożdżówka z leśnymi jagodami, pod lukrem. Krakowski hit sezonu.',
          price: 9,
          image: 'jagodzianka.jpg',
          isSeasonal: true,
        },
        {
          name: 'Drożdżówka z rabarbarem',
          description:
            'Puszyste ciasto drożdżowe z rabarbarem, kruszonką i cukrem pudrem.',
          price: 8,
          image: 'drozdzowka-rabarbar.jpg',
          isSeasonal: true,
        },
        {
          name: 'Drożdżówka z truskawkami',
          description: 'Drożdżówka z serem i świeżymi truskawkami.',
          price: 8.5,
          image: 'drozdzowka-truskawka.jpg',
          isSeasonal: true,
        },
        {
          name: 'Chałka',
          description:
            'Pleciona chałka maślana z kruszonką – na śniadanie, do kawy i na weekend.',
          price: 12,
          image: 'chalka.jpg',
        },
        {
          name: 'Rogal drożdżowy',
          description: 'Duży, maślany rogal drożdżowy posypany kruszonką.',
          price: 6,
          image: 'rogal-drozdzowy.jpg',
        },
        {
          name: 'Ślimak cynamonowy',
          description:
            'Zawijane ciasto drożdżowe z masłem, cynamonem i brązowym cukrem.',
          price: 7.5,
          image: 'slimak-cynamonowy.jpg',
        },
        {
          name: 'Faworki',
          description:
            'Kruche, cienkie faworki smażone na złoto, obficie oprószone cukrem pudrem. Opakowanie 200 g.',
          price: 14,
          image: 'faworki.jpg',
          isSeasonal: true,
        },
        {
          name: 'Ciastko czekoladowe z precelkiem',
          description:
            'Miękkie w środku ciastko z ciemną czekoladą i słonym precelkiem.',
          price: 7,
          image: 'ciastko-czekoladowe.jpg',
        },
        {
          name: 'Muffin',
          description:
            'Wilgotny muffin – czekoladowy lub waniliowy z owocami, w zależności od dnia.',
          price: 7.5,
          image: 'muffin.jpg',
        },
      ],
    },
    {
      category: 'Kanapki',
      products: [
        {
          name: 'Kanapka na chlebie na zakwasie',
          description:
            'Nasz chleb na zakwasie, twarożek, świeże warzywa i rukola. Robiona na miejscu.',
          price: 18,
          image: 'kanapka-zakwas.jpg',
        },
        {
          name: 'Bagietka z pastą i warzywami',
          description:
            'Chrupiąca bagietka z domową pastą, sałatą i warzywami sezonowymi.',
          price: 19,
          image: 'bagietka-kanapka.jpg',
        },
      ],
    },
    {
      category: 'Lody',
      products: [
        {
          name: 'Lody rzemieślnicze',
          description:
            'Lody robione na miejscu z prawdziwych składników. Smaki zmieniają się codziennie. Cena za gałkę.',
          price: 8,
          image: 'lody.jpg',
          isSeasonal: true,
        },
      ],
    },
  ];

  // po kolei, żeby createdAt (kolejność na stronie) odpowiadał kolejności powyżej
  for (const { category, products } of catalog) {
    const { id: categoryId } = await prisma.category.create({
      data: { name: category },
    });
    for (const { image, isSeasonal, ...product } of products) {
      await prisma.product.create({
        data: {
          ...product,
          categoryId,
          isSeasonal: isSeasonal ?? false,
          isActive: true,
          images: seedImage(image),
        },
      });
    }
  }

  // lody i napoje tylko do wglądu – nie można ich rezerwować online
  await prisma.product.updateMany({
    where: { category: { name: 'Lody' } },
    data: { isReservable: false },
  });

  // przykładowo poza sezonem (jesień): faworki i lody – widoczne w sekcji „Wrócą w sezonie”
  await prisma.product.updateMany({
    where: { name: { in: ['Faworki', 'Lody rzemieślnicze'] } },
    data: { inSeason: false },
  });

  // przykładowe etykiety
  await prisma.product.updateMany({
    where: { name: { in: ['Chleb pszenny na zakwasie', 'Jagodzianka'] } },
    data: { isBestseller: true },
  });
  await prisma.product.updateMany({
    where: { name: 'Drożdżówka z truskawkami' },
    data: { isNew: true },
  });

  console.log('✅ Categories & products seeded');

  // --- LOCATIONS ---
  // Prawdziwe sklepy (dane z pierwszej wersji strony). Godziny otwarcia do uzupełnienia w panelu.
  await prisma.location.deleteMany();

  // po kolei, żeby createdAt (kolejność na stronie) odpowiadał kolejności poniżej
  const locations = [
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Wileńska 4, 31-413 Kraków',
      code: 'WIL',
      phone: '+48 699 904 702',
      googleMapsUrl: 'https://maps.app.goo.gl/9aptQDq2nb7YSq2N6',
      lat: 50.0828865,
      lng: 19.9533542,
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Józefa Chełmońskiego 116, 31-348 Kraków',
      code: 'CHE',
      phone: '+48 793 864 282',
      googleMapsUrl: 'https://maps.app.goo.gl/98DExGCTfB3Un9Tp8',
      lat: 50.0922021,
      lng: 19.902874,
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Zygmunta Glogera 21, 31-222 Kraków',
      code: 'GLO',
      phone: '+48 573 834 870',
      googleMapsUrl: 'https://maps.app.goo.gl/jpN4Q9MyQa1hGZ8j8',
      lat: 50.1007776,
      lng: 19.9282251,
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Stańczyka 3A, 30-126 Kraków',
      code: 'STA',
      phone: '+48 571 990 584',
      googleMapsUrl: 'https://maps.app.goo.gl/UPFw44G4KymnWZkL7',
      lat: 50.0788445,
      lng: 19.8942342,
    },
  ];
  // przykładowe godziny otwarcia (do poprawienia w panelu); brak dnia = nieczynne
  type Span = [string, string] | null;
  const hours = (weekdays: Span, saturday: Span, sunday: Span) => {
    const days: [string, Span][] = [
      ['MONDAY', weekdays],
      ['TUESDAY', weekdays],
      ['WEDNESDAY', weekdays],
      ['THURSDAY', weekdays],
      ['FRIDAY', weekdays],
      ['SATURDAY', saturday],
      ['SUNDAY', sunday],
    ];
    return Object.fromEntries(
      days
        .filter((entry): entry is [string, [string, string]] => entry[1] !== null)
        .map(([day, [openFrom, openTo]]) => [day, { openFrom, openTo }]),
    );
  };
  const openingHours: Record<string, ReturnType<typeof hours>> = {
    WIL: hours(['06:30', '19:00'], ['07:00', '15:00'], null),
    CHE: hours(['06:00', '18:00'], ['07:00', '14:00'], ['08:00', '12:00']),
    GLO: hours(['07:00', '19:00'], ['07:00', '15:00'], null),
    STA: hours(['06:30', '18:30'], ['07:00', '14:00'], ['08:00', '13:00']),
  };
  // zdjęcia lokali (tymczasowe, z galerii piekarni)
  const seedImages = (code: string) => ({
    create: [1, 2, 3].map((n, order) => ({
      imgUrl: `${API_PUBLIC_URL}/uploads/seed/lokal-${code.toLowerCase()}-${n}.jpg`,
      order,
    })),
  });

  for (const data of locations) {
    await prisma.location.create({
      data: { ...data, openingHours: openingHours[data.code], images: seedImages(data.code) },
    });
  }

  console.log('✅ Locations seeded');

  // --- BREAD VAN ---
  await prisma.breadVanImages.deleteMany();
  await prisma.breadVanDescription.deleteMany();
  await prisma.breadVanLocation.deleteMany();

  // Przykładowa trasa – do zastąpienia prawdziwymi przystankami w panelu
  await prisma.breadVanLocation.createMany({
    data: [
      {
        address: 'Rynek Podgórski, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0442,19.9497',
        lat: 50.0442,
        lng: 19.9497,
        dayOfTheWeek: Weekday.MONDAY,
        startTime: '07:00',
        endTime: '10:00',
      },
      {
        address: 'Plac Na Stawach, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0569,19.9216',
        lat: 50.0569,
        lng: 19.9216,
        dayOfTheWeek: Weekday.WEDNESDAY,
        startTime: '15:00',
        endTime: '18:00',
      },
      {
        address: 'Plac Inwalidów, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0689,19.9258',
        lat: 50.0689,
        lng: 19.9258,
        dayOfTheWeek: Weekday.TUESDAY,
        startTime: '07:00',
        endTime: '10:00',
      },
      {
        address: 'Rondo Mogilskie, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0657,19.9601',
        lat: 50.0657,
        lng: 19.9601,
        dayOfTheWeek: Weekday.THURSDAY,
        startTime: '14:00',
        endTime: '17:00',
      },
      {
        address: 'Plac Centralny, Nowa Huta',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0718,20.0378',
        lat: 50.0718,
        lng: 20.0378,
        dayOfTheWeek: Weekday.FRIDAY,
        startTime: '08:00',
        endTime: '11:30',
      },
      {
        address: 'Osiedle Ruczaj, ul. Kobierzyńska, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0306,19.9076',
        lat: 50.0306,
        lng: 19.9076,
        dayOfTheWeek: Weekday.SATURDAY,
        startTime: '08:00',
        endTime: '12:00',
      },
      {
        address: 'Błonia – ul. Piastowska, Kraków',
        googleMapsUrl:
          'https://www.google.com/maps/search/?api=1&query=50.0612,19.9105',
        lat: 50.0612,
        lng: 19.9105,
        dayOfTheWeek: Weekday.SUNDAY,
        startTime: '09:00',
        endTime: '13:00',
      },
    ],
  });

  await prisma.breadVanDescription.create({
    data: {
      shortDescription:
        'Nasz pieczywobus – świeże pieczywo prosto pod Twoje drzwi.',
      longDescription:
        'Codziennie rano ruszamy z pieczywem prosto z pieca i przyjeżdżamy w kilka punktów miasta. ' +
        'W ofercie mamy klasyczne chleby, bułki, pieczywo pełnoziarniste oraz słodkie wypieki. ' +
        'Sprawdź harmonogram i znajdź przystanek najbliżej siebie.',
      images: {
        create: [
          {
            imgUrl: `${API_PUBLIC_URL}/uploads/seed/chlebowoz-1.jpg`,
            order: 0,
          },
          {
            imgUrl: `${API_PUBLIC_URL}/uploads/seed/chlebowoz-2.jpg`,
            order: 1,
          },
        ],
      },
    },
  });

  console.log('✅ Bread van seeded');

  // --- CONTACT INFO ---
  await prisma.contactInfo.deleteMany();

  await prisma.contactInfo.createMany({
    data: [
      {
        type: ContactType.EMAIL,
        label: 'E-mail',
        value: 'piekarnia@chlebasmak.pl',
      },
      {
        // główny telefon (oprócz numerów piekarni) – numer przykładowy, do podmiany w panelu
        type: ContactType.PHONE,
        label: 'Telefon',
        value: '+48 12 345 67 89',
      },
    ],
  });

  console.log('✅ Contact info seeded');

  // --- MEDIA ---
  await prisma.media.deleteMany();

  await prisma.media.createMany({
    data: [
      {
        name: MediaName.INSTAGRAM,
        url: 'https://www.instagram.com/chlebasmak/',
      },
      {
        name: MediaName.FACEBOOK,
        url: 'https://www.facebook.com/chlebasmak',
      },
    ],
  });

  console.log('✅ Media seeded');

  // --- BLOG ---
  await prisma.articleImages.deleteMany();
  await prisma.tagOnArticle.deleteMany();
  await prisma.articleTag.deleteMany();
  await prisma.article.deleteMany();

  // --- CREATE TAGS ---
  const [breadTag, recipesTag, sourdoughTag] = await prisma.$transaction([
    prisma.articleTag.create({ data: { name: 'Pieczywo' } }),
    prisma.articleTag.create({ data: { name: 'Przepisy' } }),
    prisma.articleTag.create({ data: { name: 'Zakwas' } }),
  ]);

  // --- CREATE ARTICLES ---
  const article1 = await prisma.article.create({
    data: {
      title: 'Jak powstaje nasz chleb na zakwasie',
      shortDescription:
        'Od dokarmiania zakwasu po wyjęcie bochenka z pieca – zajrzyj z nami do piekarni nocą.',
      content: [
        'Nasz dzień zaczyna się wtedy, gdy większość Krakowa jeszcze śpi. Pierwszy krok to zakwas – żywa kultura dzikich drożdży i bakterii, którą dokarmiamy mąką i wodą każdego dnia.',
        'Ciasto wyrabiamy z mąki, wody, soli i zakwasu. Potem przychodzi najważniejsze: czas. Długa fermentacja sprawia, że chleb ma głęboki smak, lekko kwaskowy aromat i dłużej zachowuje świeżość.',
        'Każdy bochenek formujemy ręcznie, a przed wypiekiem nacinamy skórkę. W piecu bochenki rosną, rumienią się i dostają charakterystyczną, chrupiącą skórkę, której nie da się pomylić z niczym innym.',
      ].join('\n\n'),
      images: {
        create: [
          {
            imgUrl: `${API_PUBLIC_URL}/uploads/seed/blog-zakwas.jpg`,
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.tagOnArticle.createMany({
    data: [
      { articleId: article1.id, tagId: breadTag.id },
      { articleId: article1.id, tagId: sourdoughTag.id },
    ],
  });

  // --- OPTIONAL: Another article ---
  const article2 = await prisma.article.create({
    data: {
      title: 'Kanapki na zakwasie – śniadanie u nas',
      shortDescription:
        'Świeży chleb, dobre dodatki i kawa. Sprawdź, co przygotowujemy na miejscu każdego ranka.',
      content: [
        'W naszych piekarniach poza pieczywem na wynos przygotowujemy kanapki na miejscu – na chlebie na zakwasie i chrupiących bagietkach.',
        'Dodatki zmieniają się z sezonem: twarożek z rzodkiewką, pasty warzywne, świeże sałaty i pomidory. Do tego kawa i chwila spokoju przed pracą.',
      ].join('\n\n'),
      images: {
        create: [
          {
            imgUrl: `${API_PUBLIC_URL}/uploads/seed/blog-kanapki.jpg`,
            order: 0,
          },
        ],
      },
    },
  });

  await prisma.tagOnArticle.createMany({
    data: [
      { articleId: article2.id, tagId: breadTag.id },
      { articleId: article2.id, tagId: recipesTag.id },
    ],
  });

  // wpis do przykładowego banera (przerwa techniczna chlebowozu)
  const vanBreakArticle = await prisma.article.create({
    data: {
      title: 'Przerwa techniczna chlebowozu',
      shortDescription:
        'Nasz chlebowóz jedzie na przegląd i drobne naprawy. Przez najbliższe dwa tygodnie zapraszamy do piekarni.',
      content: [
        'Nasz chlebowóz przejechał w tym roku tysiące kilometrów po Krakowie i potrzebuje chwili odpoczynku. Na najbliższe dwa tygodnie trafia do serwisu na przegląd i drobne naprawy.',
        'W tym czasie chlebowóz nie będzie zatrzymywał się na przystankach, a rezerwacje z odbiorem z chlebowozu są wstrzymane. Wszystkie nasze piekarnie działają normalnie – zapraszamy po świeże pieczywo, a rezerwację możesz złożyć z odbiorem w dowolnej z nich.',
        'Dziękujemy za cierpliwość – wrócimy na trasę wypoczęci i z pełnym bagażnikiem wypieków.',
      ].join('\n\n'),
      images: {
        create: [{ imgUrl: `${API_PUBLIC_URL}/uploads/seed/chlebowoz-1.jpg`, order: 0 }],
      },
    },
  });
  await prisma.tagOnArticle.create({
    data: { articleId: vanBreakArticle.id, tagId: breadTag.id },
  });

  // przykładowe wpisy traktujemy jak dawne – nie wysyłamy ich do newslettera przy edycji
  await prisma.article.updateMany({ data: { sendAsNewsletter: false } });

  console.log('✅ Articles & tags seeded');

  // --- BANER INFORMACYJNY ---
  await prisma.announcement.deleteMany();
  await prisma.announcement.create({
    data: {
      message:
        'Chlebowóz jest w serwisie – przez najbliższe dwa tygodnie nie kursuje. Piekarnie działają normalnie.',
      linkUrl: `/aktualnosci/${vanBreakArticle.id}`,
      // bez napisu – przycisk „Dowiedz się więcej”
      // wygasa sam po dwóch tygodniach
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  await prisma.announcement.create({
    data: {
      message: 'Zapisz się do newslettera – nowości i wypieki sezonowe prosto na Twoją skrzynkę.',
      linkUrl: '#newsletter', // otwiera okienko zapisu
      linkLabel: 'Zapisz się',
      order: 1,
    },
  });
  console.log('✅ Announcements seeded');

  // --- NEWSLETTER (fikcyjni subskrybenci – do zrzutów i testów) ---
  await prisma.newsletterSubscriber.deleteMany();
  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
  const subscribers: [string, 'CONFIRMED' | 'PENDING' | 'UNSUBSCRIBED', number][] = [
    ['magdalena@example.com', 'CONFIRMED', 21],
    ['tomasz@example.com', 'CONFIRMED', 14],
    ['ewa.nowak@example.com', 'CONFIRMED', 9],
    ['jan.kowalski@example.com', 'CONFIRMED', 3],
    ['anna.zielinska@example.com', 'PENDING', 1],
    ['piotr.wisniewski@example.com', 'UNSUBSCRIBED', 30],
  ];
  for (const [email, status, ago] of subscribers) {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        status,
        token: randomBytes(24).toString('hex'),
        consentAt: daysAgo(ago),
        confirmedAt: status === 'PENDING' ? null : daysAgo(ago),
        unsubscribedAt: status === 'UNSUBSCRIBED' ? daysAgo(ago - 10) : null,
      },
    });
  }
  console.log('✅ Newsletter subscribers seeded');

  // --- RESERVATIONS (przykładowe, fikcyjni klienci) ---
  const warsawToday = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Warsaw',
  }).format(new Date());
  const inDays = (n: number) => {
    const d = new Date(`${warsawToday}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const weekdayKeys = [
    Weekday.SUNDAY,
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
  ];
  const stores = await prisma.location.findMany({
    orderBy: { createdAt: 'asc' },
  });
  const vanStops = await prisma.breadVanLocation.findMany();
  const byName = Object.fromEntries(
    (await prisma.product.findMany()).map((p) => [p.name, p]),
  );

  const sample: {
    day: number;
    store?: number;
    van?: boolean;
    time?: string;
    name: string;
    phone: string;
    items: [string, number][];
    notes?: string;
  }[] = [
    {
      day: 1,
      store: 0,
      time: '07:30',
      name: 'Anna Kowalczyk',
      phone: '+48500100201',
      items: [
        ['Chleb pszenny na zakwasie', 2],
        ['Jagodzianka', 4],
      ],
    },
    {
      day: 1,
      store: 0,
      time: '09:00',
      name: 'Piotr Nowicki',
      phone: '+48500100202',
      items: [
        ['Bagietka', 3],
        ['Chałka', 1],
      ],
      notes: 'Proszę o pokrojenie chałki',
    },
    {
      day: 1,
      store: 1,
      time: '08:00',
      name: 'Marta Zielińska',
      phone: '+48500100203',
      items: [
        ['Chleb żytni razowy', 1],
        ['Drożdżówka z rabarbarem', 6],
      ],
    },
    {
      day: 1,
      store: 2,
      time: '16:30',
      name: 'Tomasz Wrona',
      phone: '+48500100204',
      items: [
        ['Kanapka na chlebie na zakwasie', 2],
        ['Ciastko czekoladowe z precelkiem', 2],
      ],
    },
    {
      day: 1,
      van: true,
      name: 'Katarzyna Lis',
      phone: '+48500100205',
      items: [
        ['Chleb rustykalny', 1],
        ['Ślimak cynamonowy', 3],
      ],
    },
    {
      day: 2,
      store: 3,
      time: '10:00',
      name: 'Jan Mazur',
      phone: '+48500100206',
      items: [
        ['Faworki', 2],
        ['Rogal drożdżowy', 4],
      ],
    },
    {
      day: 2,
      store: 0,
      time: '12:30',
      name: 'Ewa Dąbrowska',
      phone: '+48500100207',
      items: [
        ['Chleb pszenny na zakwasie', 1],
        ['Muffin', 6],
      ],
    },
  ];

  // numery jak w aplikacji: KOD-MMDD-NN
  const perPrefix = new Map<string, number>();
  for (const [i, s] of sample.entries()) {
    const pickupDate = inDays(s.day);
    const stop = s.van
      ? vanStops.find(
          (v) =>
            v.dayOfTheWeek ===
            weekdayKeys[new Date(`${pickupDate}T12:00:00Z`).getUTCDay()],
        )
      : undefined;
    const store = s.store !== undefined ? stores[s.store] : undefined;
    if (s.van && !stop) continue;
    const nextNumber = (code: string, date: string) => {
      const prefix = `${code}-${date.slice(2, 4)}${date.slice(5, 7)}${date.slice(8, 10)}-`;
      const n = (perPrefix.get(prefix) ?? 0) + 1;
      perPrefix.set(prefix, n);
      return `${prefix}${String(n).padStart(2, '0')}`;
    };
    const items = s.items.map(([name, quantity]) => ({
      productId: byName[name].id,
      productName: name,
      unitPrice: byName[name].price,
      quantity,
    }));
    await prisma.reservation.create({
      data: {
        number: nextNumber(stop ? 'BUS' : store!.code!, pickupDate),
        status: 'NEW',
        pickupType: stop ? 'VAN' : 'STORE',
        locationId: store?.id,
        vanStopId: stop?.id,
        pickupLabel: stop ? stop.address : store!.address,
        pickupDate,
        pickupTime: stop ? `${stop.startTime}–${stop.endTime}` : s.time,
        customerName: s.name,
        customerPhone: s.phone,
        customerEmail: `${s.name.split(' ')[0].toLowerCase()}@example.com`,
        notes: s.notes,
        total: items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
        cancelToken: `demo-token-${i + 1}`,
        items: { create: items },
      },
    });
  }

  console.log('✅ Reservations seeded');

  // --- STATYSTYKI (fikcyjna historia) ---
  await seedStats(prisma, warsawToday);
  console.log('✅ Stats seeded');
  console.log('✅ All seed data created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
