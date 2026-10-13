import {
  PrismaClient,
  Role,
  ContactType,
  Weekday,
  MediaName,
} from '@prisma/client';
import 'dotenv/config';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- USERS ---
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      {
        login: 'admin',
        password: bcrypt.hashSync('admin123', 10),
        role: Role.ADMIN,
      },
      {
        login: 'editor',
        password: bcrypt.hashSync('editor123', 10),
        role: Role.EDITOR,
      },
      {
        login: 'blogger',
        password: bcrypt.hashSync('blogger123', 10),
        role: Role.BLOGGER,
      },
      {
        login: 'viewer',
        password: bcrypt.hashSync('viewer123', 10),
        role: Role.VIEWER,
      },
    ],
  });

  // --- PRODUCTS & CATEGORIES ---
  await prisma.productImages.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.create({
    data: {
      name: 'Pieczywo podstawowe',
      products: {
        create: [
          {
            name: 'Chleb żytni na zakwasie',
            description:
              'Tradycyjny chleb żytni na zakwasie, wypiekany codziennie rano.',
            price: 7.5,
            isSeasonal: false,
            isActive: true,
            images: {
              create: [
                {
                  imgUrl: 'https://example.com/chleb-zytni-1.jpg',
                  order: 0,
                },
                {
                  imgUrl: 'https://example.com/chleb-zytni-2.jpg',
                  order: 1,
                },
              ],
            },
          },
          {
            name: 'Chleb pszenno-żytni',
            description:
              'Delikatniejszy chleb pszenno-żytni, idealny na kanapki.',
            price: 6.9,
            isSeasonal: false,
            isActive: true,
          },
          {
            name: 'Bułka kajzerka',
            description: 'Klasyczna, chrupiąca bułka pszenna.',
            price: 1.2,
            isSeasonal: false,
            isActive: true,
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Pieczywo specjalne',
      products: {
        create: [
          {
            name: 'Chleb orkiszowy',
            description:
              'Chleb z mąki orkiszowej, bogaty w błonnik i minerały.',
            price: 8.5,
            isSeasonal: false,
            isActive: true,
          },
          {
            name: 'Chleb z ziarnami',
            description:
              'Chleb z mieszanką ziaren: słonecznik, dynia, siemię lniane.',
            price: 8.9,
            isSeasonal: false,
            isActive: true,
            images: {
              create: [
                {
                  imgUrl: 'https://example.com/chleb-ziarna-1.jpg',
                  order: 0,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.category.create({
    data: {
      name: 'Wyroby słodkie',
      products: {
        create: [
          {
            name: 'Drożdżówka z serem',
            description: 'Miękka drożdżówka z serem i kruszonką.',
            price: 4.5,
            isSeasonal: false,
            isActive: true,
          },
          {
            name: 'Jagodzianka',
            description: 'Drożdżówka z nadzieniem jagodowym.',
            price: 5.5,
            isSeasonal: true,
            isActive: true,
          },
          {
            name: 'Sernik krakowski',
            description: 'Klasyczny sernik z kratką.',
            price: 12.9,
            isSeasonal: false,
            isActive: true,
          },
        ],
      },
    },
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
      phone: '+48 699 904 702',
      googleMapsUrl: 'https://maps.app.goo.gl/9aptQDq2nb7YSq2N6',
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Józefa Chełmońskiego 116, 31-348 Kraków',
      phone: '+48 793 864 282',
      googleMapsUrl: 'https://maps.app.goo.gl/98DExGCTfB3Un9Tp8',
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Zygmunta Glogera 21, 31-222 Kraków',
      phone: '+48 573 834 870',
      googleMapsUrl: 'https://maps.app.goo.gl/jpN4Q9MyQa1hGZ8j8',
    },
    {
      name: 'Piekarnia Rzemieślnicza Chleba Smak',
      address: 'ul. Stańczyka 3A, 30-126 Kraków',
      phone: '+48 571 990 584',
      googleMapsUrl: 'https://maps.app.goo.gl/UPFw44G4KymnWZkL7',
    },
  ];
  for (const data of locations) {
    await prisma.location.create({ data });
  }

  console.log('✅ Locations seeded');

  // --- BREAD VAN ---
  await prisma.breadVanImages.deleteMany();
  await prisma.breadVanDescription.deleteMany();
  await prisma.breadVanLocation.deleteMany();

  await prisma.breadVanLocation.createMany({
    data: [
      {
        address: 'Parking przy Lidlu, ul. Handlowa 3',
        googleMapsUrl: 'https://maps.google.com/?q=Handlowa+3',
        dayOfTheWeek: Weekday.MONDAY,
        startTime: '07:00',
        endTime: '10:00',
      },
      {
        address: 'Osiedle Słoneczne, ul. Słoneczna 15',
        googleMapsUrl: 'https://maps.google.com/?q=Sloneczna+15',
        dayOfTheWeek: Weekday.WEDNESDAY,
        startTime: '15:00',
        endTime: '18:00',
      },
      {
        address: 'Rynek Miejski – plac główny',
        googleMapsUrl: 'https://maps.google.com/?q=Rynek+Miasto',
        dayOfTheWeek: Weekday.FRIDAY,
        startTime: '08:00',
        endTime: '11:30',
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
            imgUrl: 'https://example.com/breadvan-1.jpg',
            order: 0,
          },
          {
            imgUrl: 'https://example.com/breadvan-2.jpg',
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
      {
        name: MediaName.TIKTOK,
        url: 'https://www.tiktok.com/@chlebasmak',
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
      shortDescription: 'Krótka historia naszego zakwasu i procesu wypieku.',
      content:
        'Tutaj możesz wstawić dłuższy tekst o procesie powstawania chleba.',
      images: {
        create: [
          {
            imgUrl: 'https://example.com/blog-chleb-1.jpg',
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
      title: 'Przepisy na domowe bułki',
      shortDescription: 'Łatwe przepisy na bułki w domu.',
      content: 'Instrukcja przygotowania różnych rodzajów bułek.',
      images: {
        create: [
          {
            imgUrl: 'https://example.com/blog-bulki-1.jpg',
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

  console.log('✅ Articles & tags seeded');
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
