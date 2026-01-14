import {
  PrismaClient,
  Role,
  ContactType,
  Weekday,
  MediaName,
} from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- USERS ---
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { login: 'admin', password: 'admin123', role: Role.ADMIN },
      { login: 'editor', password: 'editor123', role: Role.EDITOR },
      { login: 'blogger', password: 'blogger123', role: Role.BLOGGER },
      { login: 'viewer', password: 'viewer123', role: Role.VIEWER },
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
  await prisma.location.deleteMany();

  await prisma.location.createMany({
    data: [
      {
        name: 'Piekarnia – Centrum',
        address: 'ul. Kwiatowa 10, 00-001 Miasto',
        googleMapsUrl: 'https://maps.google.com/?q=Kwiatowa+10+Miasto',
        openingHours: {
          monday: '06:30–18:00',
          tuesday: '06:30–18:00',
          wednesday: '06:30–18:00',
          thursday: '06:30–18:00',
          friday: '06:30–19:00',
          saturday: '07:00–14:00',
        },
      },
      {
        name: 'Piekarnia – Rynek',
        address: 'Rynek 1, 00-002 Miasto',
        googleMapsUrl: 'https://maps.google.com/?q=Rynek+1+Miasto',
        openingHours: {
          monday: '07:00–19:00',
          tuesday: '07:00–19:00',
          wednesday: '07:00–19:00',
          thursday: '07:00–19:00',
          friday: '07:00–20:00',
          saturday: '08:00–14:00',
        },
      },
      {
        name: 'Piekarnia – Osiedle',
        address: 'ul. Lipowa 5, 00-003 Miasto',
        googleMapsUrl: 'https://maps.google.com/?q=Lipowa+5+Miasto',
        openingHours: {
          monday: '06:30–17:00',
          tuesday: '06:30–17:00',
          wednesday: '06:30–17:00',
          thursday: '06:30–17:00',
          friday: '06:30–17:00',
          saturday: '07:00–13:00',
        },
      },
    ],
  });

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
        'W ofercie mamy klasyczne chleby, bułki, pieczywo pełnoziarniste oraz słodkie wypieki.',
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
        type: ContactType.PHONE,
        label: 'Sklep – centrum',
        value: '+48 123 456 789',
      },
      {
        type: ContactType.EMAIL,
        label: 'Kontakt ogólny',
        value: 'kontakt@piekarnia-przyklad.pl',
      },
      {
        type: ContactType.OTHER,
        label: 'Bread van – zapytania',
        value: 'breadvan@piekarnia-przyklad.pl',
      },
    ],
  });

  console.log('✅ Contact info seeded');

  // --- MEDIA ---
  await prisma.media.deleteMany();

  await prisma.media.createMany({
    data: [
      {
        name: MediaName.FACEBOOK,
        url: 'https://facebook.com/piekarnia-przyklad',
      },
      {
        name: MediaName.INSTAGRAM,
        url: 'https://instagram.com/piekarnia-przyklad',
      },
    ],
  });

  console.log('✅ Media seeded');

  // --- BLOG ---
  await prisma.articleImages.deleteMany();
  await prisma.blogItem.deleteMany();

  await prisma.blogItem.create({
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

  console.log('✅ Blog seeded');
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
