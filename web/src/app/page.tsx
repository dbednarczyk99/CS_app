import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaInstagram } from 'react-icons/fa6';
import { HeroCarousel } from '@/components/HeroCarousel';
import { LocationCard } from '@/components/LocationCard';
import { ProductCard } from '@/components/ProductCard';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { api, orFallback } from '@/lib/api';
import { isAvailable } from '@/lib/products';
import { formatDate, plural } from '@/lib/format';
import { buildHeroSlides } from '@/lib/heroSlides';

const VALUES = [
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
];

const GALLERY = ['01', '02', '03', '04', '05', '06', '07', '08'];

export default async function HomePage() {
  const [products, locations, articles, media, stops] = await Promise.all([
    orFallback(api.products(), []),
    orFallback(api.locations(), []),
    orFallback(api.articles(), []),
    orFallback(api.media(), []),
    orFallback(api.breadVanStops(), []),
  ]);

  // na przemian z pierwszych kategorii (np. chleby i słodkie wypieki), tylko produkty ze zdjęciem
  const withImages = products.filter((p) => isAvailable(p) && p.images?.length);
  const groups = new Map<string, typeof withImages>();
  for (const p of withImages) groups.set(p.categoryId, [...(groups.get(p.categoryId) ?? []), p]);
  const byCategory = [...groups.values()];
  const featured = Array.from({ length: 4 }, (_, i) => byCategory[i % 2]?.[Math.floor(i / 2)])
    .filter((p) => p !== undefined)
    .concat(withImages)
    .filter((p, i, all) => all.indexOf(p) === i)
    .slice(0, 4);
  const latestArticles = [...articles].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  const instagram = media.find((m) => m.name === 'INSTAGRAM');
  const heroSlides = buildHeroSlides({ locations, stops, products });

  return (
    <>
      {/* HERO – karuzela najważniejszych informacji */}
      <HeroCarousel
        slides={heroSlides}
        firstImage={
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/hero-desktop.jpg" />
            {/* art direction: różne kadry na telefon i komputer */}
            <img
              src="/images/hero-mobile.jpg"
              alt="Przekrojony chleb na zakwasie w lnianej ściereczce"
              className="absolute inset-0 size-full object-cover object-[70%_center]"
              fetchPriority="high"
            />
          </picture>
        }
      />

      {/* WARTOŚCI */}
      <section id="wartosci" className="border-b border-line bg-coal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-12 md:py-20">
          {VALUES.map((value, i) => (
            <Reveal key={value.title} delay={i * 120}>
              <span className="font-display text-sm tracking-[0.3em] text-gold">0{i + 1}</span>
              <h2 className="heading mt-3 text-2xl">{value.title}</h2>
              <p className="mt-3 leading-relaxed text-stone">{value.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Z NASZEGO PIECA */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Z naszego pieca" title="Wypieki, po które się wraca" />
            <Link href="/oferta" className="link-arrow inline-flex items-center gap-3">
              Cała oferta <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 100}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* HISTORIA */}
      <section className="bg-coal">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src="/images/piekarz.jpg"
                alt="Piekarz trzymający świeże bochenki chleba"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            {locations.length > 0 && (
              <div className="absolute -bottom-6 -right-4 hidden border border-gold/50 bg-ink px-6 py-5 sm:block lg:-right-8">
                <p className="font-display text-4xl text-gold">{locations.length}</p>
                <p className="eyebrow mt-1 text-[0.65rem] text-cream">
                  {plural(locations.length, ['piekarnia', 'piekarnie', 'piekarni'])} w Krakowie
                </p>
              </div>
            )}
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading eyebrow="O nas" title="Rzemiosło, które czuć w każdym kęsie">
              <p>
                Chleba Smak to piekarnia rzemieślnicza, w której chleb robi się tak jak kiedyś: na
                naturalnym zakwasie, z dobrej mąki i bez pośpiechu.
              </p>
              <p className="mt-4">
                Codziennie rano na nasze półki trafiają chrupiące bochenki, maślane drożdżówki i
                sezonowe wypieki – w naszych krakowskich piekarniach i w chlebowozie.
              </p>
            </SectionHeading>
            <Link href="/o-nas" className="link-arrow mt-10 inline-flex items-center gap-3">
              Poznaj nas <FaArrowRight aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CYTAT NA ZDJĘCIU */}
      <section className="relative overflow-hidden">
        <Image src="/images/zakwas.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-4xl px-5 py-32 text-center sm:px-8 md:py-44">
          <Reveal>
            <p className="eyebrow">Nasza filozofia</p>
            <blockquote className="heading mt-6 text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Mąka, woda, sól
              <br />
              <span className="text-gold">i czas.</span>
            </blockquote>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">
              Tyle potrzeba, żeby upiec dobry chleb. Resztę robi cierpliwość.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PIEKARNIE */}
      {locations.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Odwiedź nas" title="Nasze piekarnie" />
            <Link href="/piekarnie" className="link-arrow inline-flex items-center gap-3">
              Godziny i dojazd <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location, i) => (
              <Reveal key={location.id} delay={i * 100} className="h-full">
                <LocationCard location={location} index={i} showHours={false} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CHLEBOWÓZ */}
      <section className="bg-coal">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:order-2">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/chlebowoz.jpg"
                alt="Świeże bochenki na drewnianej łopacie"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150} className="lg:order-1">
            <SectionHeading eyebrow="Chlebowóz" title="Przyjeżdżamy z pieczywem do Ciebie">
              <p>
                Nasz chlebowóz w stałe dni tygodnia zatrzymuje się w kolejnych punktach miasta. Sprawdź
                trasę i złap świeży chleb po drodze.
              </p>
            </SectionHeading>
            <Link href="/chlebowoz" className="btn btn-outline mt-10">
              Sprawdź trasę
            </Link>
          </Reveal>
        </div>
      </section>

      {/* AKTUALNOŚCI */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Aktualności" title="Co słychać w piekarni" />
            <Link href="/aktualnosci" className="link-arrow inline-flex items-center gap-3">
              Wszystkie wpisy <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {latestArticles.map((article, i) => (
              <Reveal key={article.id} delay={i * 100}>
                <Link href={`/aktualnosci/${article.id}`} className="group block border-t border-line pt-6">
                  <time dateTime={article.createdAt} className="eyebrow text-[0.7rem] text-stone">
                    {formatDate(article.createdAt)}
                  </time>
                  <h3 className="heading mt-3 text-xl transition-colors group-hover:text-gold">
                    {article.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-stone">{article.shortDescription}</p>
                  <span className="link-arrow mt-5 inline-flex items-center gap-2 text-[0.75rem]">
                    Czytaj <FaArrowRight aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* GALERIA */}
      <section className="border-t border-line pb-24 pt-20 md:pb-32">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
          <SectionHeading eyebrow="Zajrzyj do nas" title="Prosto z piekarni" />
          {instagram && (
            <a
              href={instagram.url}
              target="_blank"
              rel="noreferrer"
              className="link-arrow inline-flex items-center gap-3"
            >
              <FaInstagram size={18} aria-hidden /> Obserwuj nas
            </a>
          )}
        </div>
        <ul className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 sm:px-8 [scrollbar-width:thin]">
          {GALLERY.map((name, i) => (
            <li key={name} className="relative aspect-[3/4] w-[70vw] shrink-0 snap-start overflow-hidden sm:w-[38vw] lg:w-[22vw]">
              <Image
                src={`/images/galeria/${name}.jpg`}
                alt={`Wypieki Chleba Smak – zdjęcie ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 38vw, 70vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
