import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaInstagram } from 'react-icons/fa6';
import { LoopCarousel } from '@/components/LoopCarousel';
import { HeroCarousel } from '@/components/HeroCarousel';
import { HomeLocations } from '@/components/HomeLocations';
import { ProductCard } from '@/components/ProductCard';
import { GoogleRatingBand } from '@/components/GoogleRatingBand';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { api, orFallback } from '@/lib/api';
import { getContent, paragraphs, seoMetadata } from '@/lib/content';
import { featuredProducts, isAvailable } from '@/lib/products';
import { formatDate, plural } from '@/lib/format';
import { buildHeroSlides } from '@/lib/heroSlides';
import { getReservationRules } from '@/lib/reservation-rules';
import { articlePath } from '@/lib/site';
import { bakeryLd } from '@/lib/structured-data';

export const generateMetadata = () => seoMetadata('seo.home', { path: '/' });

/** Teksty, zdjęcia i widoczność sekcji – z panelu (Strona → Strona główna, Karuzela) */
export default async function HomePage() {
  const [products, locations, articles, media, stops, slides, content, rules] = await Promise.all([
    orFallback(api.products(), []),
    orFallback(api.locations(), []),
    orFallback(api.articles(), []),
    orFallback(api.media(), []),
    orFallback(api.breadVanStops(), []),
    orFallback(api.heroSlides(), []),
    getContent(),
    getReservationRules(),
  ]);
  const values = content['home.values'];
  const featuredText = content['home.featured'];
  const rating = content['home.rating'];
  const about = content['home.about'];
  const quote = content['home.quote'];
  const locationsText = content['home.locations'];
  const van = content['home.van'];
  const news = content['home.news'];
  const gallery = content['home.gallery'];

  // karuzela: produkty z etykietami, dopełnione losowymi do min. 8 (tylko dostępne, ze zdjęciem)
  const featured = featuredProducts(products.filter((p) => isAvailable(p) && p.images?.length));
  const latestArticles = [...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 3);
  const instagram = media.find((m) => m.name === 'INSTAGRAM');
  const heroSlides = buildHeroSlides({ slides, locations, stops, products, rules });
  const first = heroSlides[0];

  return (
    <>
      {/* dane dla Google: każda piekarnia z adresem, położeniem, telefonem i godzinami */}
      <JsonLd data={locations.map(bakeryLd)} />

      {/* HERO – karuzela najważniejszych informacji */}
      <HeroCarousel
        slides={heroSlides}
        firstImage={
          <picture>
            <source media="(min-width: 768px)" srcSet={first.image.src} />
            {/* art direction: różne kadry na telefon i komputer */}
            <img
              src={first.mobileImage?.src ?? first.image.src}
              alt={first.image.alt}
              className="absolute inset-0 size-full object-cover"
              style={{ objectPosition: first.mobileImage?.position ?? first.image.position }}
              fetchPriority="high"
            />
          </picture>
        }
      />

      {/* WARTOŚCI */}
      <section id="wartosci" className="border-b border-line bg-coal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3 md:gap-12 md:py-20">
          {values.items.map((value, i) => (
            <Reveal key={i} delay={i * 120}>
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
            <SectionHeading eyebrow={featuredText.eyebrow} title={featuredText.title} />
            <Link href="/oferta" className="link-arrow inline-flex items-center gap-3">
              {featuredText.linkLabel} <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-14">
            <LoopCarousel
              label={featuredText.title}
              perView="[--n:2] sm:[--n:3] lg:[--n:4]"
              gap="[--gap:1rem] sm:[--gap:1.5rem]"
              items={featured.map((product) => ({ key: product.id, node: <ProductCard product={product} /> }))}
            />
          </div>
        </section>
      )}

      {/* OCENA W GOOGLE – zbiorcza i każdej piekarni (link do wystawienia opinii) */}
      {rating.visible && <GoogleRatingBand locations={locations} eyebrow={rating.eyebrow} cta={rating.cta} />}

      {/* HISTORIA */}
      <section className="bg-coal">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src={about.image.url}
                alt={about.image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            {about.showCount && locations.length > 0 && (
              <div className="absolute -bottom-6 -right-4 hidden border border-gold/50 bg-ink px-6 py-5 sm:block lg:-right-8">
                <p className="font-display text-4xl text-gold">{locations.length}</p>
                <p className="eyebrow mt-1 text-[0.65rem] text-cream">
                  {plural(locations.length, ['piekarnia', 'piekarnie', 'piekarni'])} w Krakowie
                </p>
              </div>
            )}
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading eyebrow={about.eyebrow} title={about.title}>
              {paragraphs(about.text).map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-4' : undefined}>
                  {p}
                </p>
              ))}
            </SectionHeading>
            <Link href="/o-nas" className="link-arrow mt-10 inline-flex items-center gap-3">
              {about.linkLabel} <FaArrowRight aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CYTAT NA ZDJĘCIU */}
      {quote.visible && (
        <section className="relative overflow-hidden">
          <Image src={quote.image.url} alt={quote.image.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative mx-auto max-w-4xl px-5 py-32 text-center sm:px-8 md:py-44">
            <Reveal>
              <p className="eyebrow">{quote.eyebrow}</p>
              <blockquote className="heading mt-6 text-3xl leading-tight sm:text-4xl lg:text-5xl">
                {quote.line1}
                {quote.highlight && (
                  <>
                    <br />
                    <span className="text-gold">{quote.highlight}</span>
                  </>
                )}
              </blockquote>
              {quote.text && <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">{quote.text}</p>}
            </Reveal>
          </div>
        </section>
      )}

      {/* PIEKARNIE */}
      {locations.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={locationsText.eyebrow} title={locationsText.title} />
            <Link href="/piekarnie" className="link-arrow inline-flex items-center gap-3">
              {locationsText.linkLabel} <FaArrowRight aria-hidden />
            </Link>
          </div>
          {/* do 4 piekarni – siatka na całą szerokość, więcej – karuzela */}
          <div className="mt-14">
            <HomeLocations locations={locations} />
          </div>
        </section>
      )}

      {/* CHLEBOWÓZ */}
      <section className="bg-coal">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:order-2">
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={van.image.url}
                alt={van.image.alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={150} className="lg:order-1">
            <SectionHeading eyebrow={van.eyebrow} title={van.title}>
              {paragraphs(van.text).map((p, i) => (
                <p key={i} className={i > 0 ? 'mt-4' : undefined}>
                  {p}
                </p>
              ))}
            </SectionHeading>
            <Link href="/chlebowoz" className="btn btn-outline mt-10">
              {van.buttonLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* AKTUALNOŚCI */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={news.eyebrow} title={news.title} />
            <Link href="/aktualnosci" className="link-arrow inline-flex items-center gap-3">
              {news.linkLabel} <FaArrowRight aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {latestArticles.map((article, i) => (
              <Reveal key={article.id} delay={i * 100}>
                <Link href={articlePath(article)} className="group block border-t border-line pt-6">
                  <time dateTime={article.publishedAt} className="eyebrow text-[0.7rem] text-stone">
                    {formatDate(article.publishedAt)}
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
      {gallery.visible && gallery.images.length > 0 && (
        <section className="border-t border-line pb-24 pt-20 md:pb-32">
          <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 sm:px-8">
            <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
            {instagram && gallery.instagramLabel && (
              <a
                href={instagram.url}
                target="_blank"
                rel="noreferrer"
                className="link-arrow inline-flex items-center gap-3"
              >
                <FaInstagram size={18} aria-hidden /> {gallery.instagramLabel}
              </a>
            )}
          </div>
          {/* galeria w szerokości treści – krawędzie zgrane z nagłówkiem i resztą strony */}
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mt-12">
              <LoopCarousel
                label={gallery.title}
                perView="[--n:1] sm:[--n:2] lg:[--n:4]"
                items={gallery.images.map(({ image }, i) => ({
                  key: `${i}-${image.url}`,
                  node: (
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
