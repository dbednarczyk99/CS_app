/*
 * Tryb pokazowy sekcji Instagrama – przykładowe posty (zdjęcia z bazy przykładowej), żeby zobaczyć i pokazać
 * klientowi, jak sekcja wygląda, zanim połączymy prawdziwe konto:
 *
 *   npm run instagram:demo           → wstawia przykładowe posty i włącza sekcję
 *   npm run instagram:demo -- usun   → usuwa je (to samo robi „Odłącz konto” w panelu)
 *
 * Wklejenie prawdziwego klucza w panelu (Marketing → Instagram) samo kończy tryb pokazowy i podmienia posty.
 */
import 'dotenv/config';
import { existsSync, mkdirSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const UPLOADS = join(process.cwd(), 'uploads');
const DIR = join(UPLOADS, 'instagram');

// zdjęcia z bazy przykładowej (uploads/seed) i podpisy w stylu postów piekarni
const POSTS: [string, string][] = [
  ['lokal-wil-1.jpg', 'Dzień dobry z Wilczej! Pierwsze bochenki już na półkach 🍞'],
  ['jagodzianka.jpg', 'Sezon na jagodzianki trwa – leśne jagody i maślane ciasto.'],
  ['chleb-pszenny-na-zakwasie.jpg', 'Nasz zakwas ma już kilka lat. Chleb pszenny – 24 godziny pracy.'],
  ['chlebowoz-1.jpg', 'Chlebowóz rusza w trasę – sprawdź, gdzie dziś stajemy.'],
  ['slimak-cynamonowy.jpg', 'Ślimaki cynamonowe prosto z pieca. Kto pierwszy, ten lepszy!'],
  ['lokal-che-2.jpg', 'Poranek w piekarni na Chełmońskiego.'],
  ['chalka.jpg', 'Piątek = chałka. Pleciona ręcznie, posypana kruszonką.'],
  ['kanapka-zakwas.jpg', 'Kanapki na naszym chlebie – idealne na drugie śniadanie.'],
  ['drozdzowka-rabarbar.jpg', 'Drożdżówka z rabarbarem – słodko-kwaśna klasyka.'],
  ['blog-zakwas.jpg', 'Jak powstaje zakwas? Zaglądamy za kulisy piekarni.'],
];

async function main() {
  const remove = process.argv[2] === 'usun';
  if (remove || existsSync(DIR)) {
    for (const f of existsSync(DIR) ? readdirSync(DIR) : []) if (f.startsWith('demo-')) rmSync(join(DIR, f));
  }
  if (remove) {
    await prisma.siteContent.deleteMany({ where: { key: { in: ['instagram.settings', 'instagram.feed'] } } });
    console.log('Usunięto przykładowe posty – sekcja Instagrama jest ukryta.');
    return;
  }

  const media = await prisma.media.findUnique({ where: { name: 'INSTAGRAM' } });
  const username = media?.url.match(/instagram\.com\/([^/?#]+)/i)?.[1] ?? 'chlebasmak';
  const profileUrl = `https://www.instagram.com/${username}/`;

  mkdirSync(DIR, { recursive: true });
  const posts: { id: string; permalink: string; image: string; caption: string; takenAt: string; type: string }[] = [];
  const now = Date.now();
  for (const [i, [source, caption]] of POSTS.entries()) {
    const from = join(UPLOADS, 'seed', source);
    if (!existsSync(from)) continue;
    const file = `demo-${i + 1}.jpg`;
    await sharp(from)
      .rotate()
      .resize(640, 640, { fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(join(DIR, file));
    posts.push({
      id: `demo-${i + 1}`,
      // przykładowe posty prowadzą na profil piekarni
      permalink: profileUrl,
      image: `instagram/${file}`,
      caption,
      takenAt: new Date(now - i * 2 * 86400_000).toISOString(),
      type: 'IMAGE',
    });
  }

  const at = new Date().toISOString();
  const settings = { enabled: true, demo: true, token: null, tokenUpdatedAt: null, tokenExpiresAt: null };
  const feed = { username, posts, fetchedAt: at, lastAttemptAt: at, error: null };
  for (const [key, data] of [
    ['instagram.settings', settings],
    ['instagram.feed', feed],
  ] as const) {
    await prisma.siteContent.upsert({ where: { key }, create: { key, data }, update: { data } });
  }
  console.log(`Wstawiono ${posts.length} przykładowych postów (@${username}). Sekcja widoczna na stronie głównej i w kontakcie (do minuty).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
