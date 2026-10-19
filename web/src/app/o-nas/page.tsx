import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { pageMetadata } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'O nas',
  description: 'Poznaj piekarnię rzemieślniczą Chleba Smak – ludzi, zasady i sposób, w jaki pieczemy chleb.',
  path: '/o-nas',
});

const PRINCIPLES = [
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
];

const GALLERY = ['02', '05', '08', '03'];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="O nas" title="Piekarnia, w której chleb ma czas" image="/images/piekarz.jpg" />

      {/* TODO: historia piekarni od właściciela */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading eyebrow="Nasza historia" title="Zaczęło się od zakwasu">
            <p>
              Chleba Smak powstała z prostej potrzeby: piec chleb, który sami chcielibyśmy jeść
              każdego dnia. Uczciwy, pachnący, z chrupiącą skórką.
            </p>
            <p className="mt-4">
              Dziś pieczemy dla naszych piekarni w Krakowie i chlebowozu, ale zasady się nie
              zmieniły – wciąż formujemy bochenki ręcznie i dajemy ciastu tyle czasu, ile potrzebuje.
            </p>
          </SectionHeading>
        </Reveal>
        <Reveal delay={150}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/chleb-deska.jpg"
              alt="Chleb na zakwasie na drewnianej desce"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-coal">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <SectionHeading eyebrow="Jak pracujemy" title="Cztery zasady" align="center" />
          <div className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 100} className="h-full">
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
          {GALLERY.map((name, i) => (
            <Reveal key={name} delay={i * 80}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={`/images/galeria/${name}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="heading text-2xl sm:text-3xl">Najlepiej smakuje na miejscu</p>
          <Link href="/piekarnie" className="btn btn-gold mt-4">
            Znajdź piekarnię
          </Link>
        </div>
      </section>
    </>
  );
}
