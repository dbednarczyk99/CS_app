import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { getContent, paragraphs, seoMetadata } from '@/lib/content';

export const generateMetadata = () => seoMetadata('seo.about', { path: '/o-nas' });

/** Kolumny zasad na komputerze – pełne rzędy: 2, 3 i 6 → po 2/3, pozostałe → 4 */
const principleColumns = (count: number) =>
  count === 2 ? 'lg:grid-cols-2' : count % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';

/** Teksty i zdjęcia – z panelu (Strona → Podstrony → O nas) */
export default async function AboutPage() {
  const content = await getContent();
  const header = content['about.header'];
  const story = content['about.story'];
  const principles = content['about.principles'];
  const gallery = content['about.gallery'];

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} image={header.image.url} />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow={story.eyebrow} title={story.title}>
            {paragraphs(story.text).map((p, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : undefined}>
                {p}
              </p>
            ))}
          </SectionHeading>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={story.image.url}
              alt={story.image.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-coal">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading eyebrow={principles.eyebrow} title={principles.title} align="center" />
          <div className={`mt-16 grid gap-px bg-line sm:grid-cols-2 ${principleColumns(principles.items.length)}`}>
            {principles.items.map((principle, i) => (
              <Reveal key={i} delay={i * 100} className="h-full">
                <div className="h-full bg-coal p-8">
                  <span className="font-display text-sm tracking-[0.3em] text-gold">0{i + 1}</span>
                  <h3 className="heading mt-4 text-xl">{principle.title}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{principle.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {gallery.images.map(({ image }, i) => (
            <Reveal key={i} delay={(i % 4) * 80}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="heading text-2xl sm:text-3xl">{gallery.title}</p>
          <Link href="/piekarnie" className="btn btn-gold mt-4">
            {gallery.buttonLabel}
          </Link>
        </div>
      </section>
    </>
  );
}
