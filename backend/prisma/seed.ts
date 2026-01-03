import { PrismaClient, Role, ContactType } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding full database...');

  // USERS
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { login: 'admin', password: 'admin123', role: Role.ADMIN },
      { login: 'editor', password: 'editor123', role: Role.EDITOR },
      { login: 'blogger', password: 'blogger123', role: Role.BLOGGER },
      { login: 'viewer', password: 'viewer123', role: Role.VIEWER },
    ],
  });
  console.log('👤 Users created');

  // CATEGORIES + PRODUCTS
  await prisma.productImages.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.category.create({
    data: {
      name: 'Pieczywo',
      products: {
        create: [
          {
            name: 'Chleb Żytni',
            description: 'Tradycyjny chleb na zakwasie.',
            price: 5.5,
            isSeasonal: false,
            isActive: true,
            images: {
              create: [
                { imgUrl: 'https://example.com/chleb.jpg' },
                { imgUrl: 'https://example.com/chleb2.jpg' },
              ],
            },
          },
          {
            name: 'Bułka Kajzerka',
            description: 'Klasyczna, chrupiąca bułka pszenna.',
            price: 1.2,
            isSeasonal: false,
            isActive: true,
          },
        ],
      },
    },
  });
  console.log('🍞 Categories & products created');

  // CONTACTINFO + LOCATIONS + MEDIA
  await prisma.location.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.media.deleteMany();

  await prisma.contactInfo.createMany({
    data: [
      {
        type: ContactType.PHONE,
        label: 'Telefon komórkowy',
        value: '123-456-789',
      },
      {
        type: ContactType.EMAIL,
        label: 'Email ogólny',
        value: 'kontakt@chlebasmak.pl',
      },
      {
        type: ContactType.PHONE,
        label: 'Telefon stacjonarny',
        value: '22 123 45 67',
      },
    ],
  });

  // LOKALIZACJE + GODZINY OTWARCIA (jako JSON)
  await prisma.location.create({
    data: {
      name: 'Piekarnia Główna',
      address: 'ul. Mączna 12, Warszawa',
      googleMapsUrl: 'https://maps.google.com/?q=Mączna+12+Warszawa',
      openingHours: {
        MONDAY: { openFrom: '08:00', openTo: '18:00' },
        TUESDAY: { openFrom: '08:00', openTo: '18:00' },
        WEDNESDAY: { openFrom: '08:00', openTo: '18:00' },
        THURSDAY: { openFrom: '08:00', openTo: '18:00' },
        FRIDAY: { openFrom: '08:00', openTo: '18:00' },
        SATURDAY: { openFrom: '09:00', openTo: '14:00' },
        SUNDAY: { openFrom: '00:00', openTo: '00:00' },
      },
    },
  });

  await prisma.location.create({
    data: {
      name: 'Stoisko w galerii',
      address: 'Galeria Centrum, ul. Handlowa 5',
      googleMapsUrl: 'https://maps.google.com/?q=Galeria+Centrum',
      openingHours: {
        MONDAY: { openFrom: '10:00', openTo: '20:00' },
        TUESDAY: { openFrom: '10:00', openTo: '20:00' },
        WEDNESDAY: { openFrom: '10:00', openTo: '20:00' },
        THURSDAY: { openFrom: '10:00', openTo: '20:00' },
        FRIDAY: { openFrom: '10:00', openTo: '21:00' },
        SATURDAY: { openFrom: '10:00', openTo: '21:00' },
        SUNDAY: { openFrom: '10:00', openTo: '20:00' },
      },
    },
  });

  await prisma.media.createMany({
    data: [
      {
        name: 'Facebook',
        url: 'https://facebook.com/chlebasmak',
        icon: 'facebook',
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/chlebasmak',
        icon: 'instagram',
      },
    ],
  });

  console.log('📞 ContactInfo, locations, opening hours & media created');

  // BREAD VAN LOCATIONS
  await prisma.breadVanLocation.deleteMany();
  await prisma.breadVanLocation.createMany({
    data: [
      {
        address: 'Rynek Główny 1, Kraków',
        googleMapsUrl: 'https://maps.google.com/?q=Rynek+Główny+1+Kraków',
        dayOfTheWeek: 'Poniedziałek',
        startTime: '08:00',
        endTime: '14:00',
      },
      {
        address: 'Plac Wolności 2, Łódź',
        googleMapsUrl: 'https://maps.google.com/?q=Plac+Wolności+2+Łódź',
        dayOfTheWeek: 'Środa',
        startTime: '09:00',
        endTime: '15:00',
      },
    ],
  });
  console.log('🚐 BreadVan locations created');

  // BLOG ITEMS + ARTICLE IMAGES
  await prisma.articleImages.deleteMany();
  await prisma.blogItem.deleteMany();
  await prisma.blogItem.create({
    data: {
      title: 'Jak powstaje nasz chleb na zakwasie',
      shortDescription: 'Zajrzyj za kulisy tradycyjnego wypieku chleba.',
      content: 'Proces zaczyna się od naturalnego zakwasu... (dalszy tekst)',
      images: {
        create: [
          { imgUrl: 'https://example.com/chleb-blog1.jpg' },
          { imgUrl: 'https://example.com/chleb-blog2.jpg' },
        ],
      },
    },
  });
  console.log('📝 Blog items created');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
