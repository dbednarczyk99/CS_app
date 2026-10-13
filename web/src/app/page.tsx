import Image from 'next/image';
import Link from 'next/link';
import { FaChevronDown, FaClock, FaEnvelope, FaLocationArrow, FaLocationDot, FaPhone } from 'react-icons/fa6';
import { ContactForm } from '@/components/ContactForm';
import { ProductsBrowser } from '@/components/ProductsBrowser';
import { Section } from '@/components/Section';
import { SocialLinks } from '@/components/SocialLinks';
import { api, orFallback, type OpeningHours, type Weekday } from '@/lib/api';

const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'MONDAY', label: 'Poniedziałek' },
  { key: 'TUESDAY', label: 'Wtorek' },
  { key: 'WEDNESDAY', label: 'Środa' },
  { key: 'THURSDAY', label: 'Czwartek' },
  { key: 'FRIDAY', label: 'Piątek' },
  { key: 'SATURDAY', label: 'Sobota' },
  { key: 'SUNDAY', label: 'Niedziela' },
];

function hoursFor(hours: OpeningHours, day: Weekday): string {
  const value = hours[day.toLowerCase()] ?? hours[day];
  if (!value) return 'nieczynne';
  return typeof value === 'string' ? value : `${value.openFrom}–${value.openTo}`;
}

const dateFormat = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function HomePage() {
  const [categories, locations, vanStops, vanDescription, contact, media, articles] =
    await Promise.all([
      orFallback(api.categories(), []),
      orFallback(api.locations(), []),
      orFallback(api.breadVanStops(), []),
      orFallback(api.breadVanDescription(), null),
      orFallback(api.contactInfo(), []),
      orFallback(api.media(), []),
      orFallback(api.articles(), []),
    ]);

  const email = contact.find((c) => c.type === 'EMAIL')?.value;
  const latestArticles = [...articles]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);

  const aboutCards = [
    {
      title: 'Nasz zespół',
      image: '/images/o-nas-zespol.jpg',
      text: 'Piekarze, którzy każdej nocy wyrabiają ciasto ręcznie i pieką chleb na naturalnym zakwasie – bez polepszaczy i na długiej fermentacji.',
      href: null,
    },
    {
      title: 'Nasze lokalizacje',
      image: '/images/o-nas-lokalizacje.jpg',
      text: `Znajdziesz nas w ${locations.length || 'kilku'} ${locations.length === 1 ? 'piekarni' : 'piekarniach'} w Krakowie. Wpadnij po świeże pieczywo i wypieki prosto z pieca.`,
      href: '#kontakt',
    },
    {
      title: 'Chlebowóz',
      image: '/images/o-nas-chlebowoz.jpg',
      text:
        vanDescription?.shortDescription ??
        'Nasz chlebowóz dowozi świeże pieczywo w kolejne punkty miasta według stałego harmonogramu.',
      href: '#chlebowoz',
    },
  ];

  return (
    <>
      {/* HERO */}
      <header id="start" className="flex min-h-svh items-center justify-center px-4 pt-24 pb-8">
        <div className="w-full max-w-[90%] bg-panel px-4 py-10 text-center">
          <Image
            src="/images/logo-biale.png"
            alt="Chleba Smak – piekarnia"
            width={800}
            height={512}
            priority
            className="mx-auto h-auto w-3/4 max-w-xl md:w-1/2"
          />
          <div className="bar my-6" />
          {/* TODO: hasło reklamowe od właściciela */}
          <p className="text-lg">Chleb na naturalnym zakwasie, wypiekany codziennie w Krakowie.</p>
        </div>
      </header>

      {/* O PIEKARNI */}
      <Section id="o-nas" title="O piekarni Chleba Smak">
        <ul className="grid gap-4 lg:grid-cols-3">
          {aboutCards.map((card) => (
            <li key={card.title} className="flex flex-col text-center">
              <Image
                src={card.image}
                alt={card.title}
                width={900}
                height={600}
                className="h-[300px] w-full object-cover"
              />
              <div className="flex flex-1 flex-col bg-panel-strong p-4">
                <h3 className="mb-2 text-3xl">{card.title}</h3>
                <p className="flex-1 leading-relaxed">{card.text}</p>
                {card.href && (
                  <Link
                    href={card.href}
                    className="mt-4 block bg-graphite py-2 transition-colors hover:bg-graphite-darker"
                  >
                    Zobacz więcej
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* AKTUALNOŚCI */}
      {latestArticles.length > 0 && (
        <Section id="aktualnosci" title="Aktualności">
          <ul className="grid gap-4 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <li key={article.id} className="flex flex-col bg-panel-strong">
                {article.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.images[0].imgUrl}
                    alt=""
                    className="h-48 w-full object-cover"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col p-4">
                  <time className="text-xs uppercase tracking-wider text-muted" dateTime={article.createdAt}>
                    {dateFormat.format(new Date(article.createdAt))}
                  </time>
                  <h3 className="mt-1 text-xl">{article.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-soft">{article.shortDescription}</p>
                  {article.tags.length > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {article.tags.map(({ tag }) => (
                        <li key={tag.id} className="border border-white/40 px-2 py-0.5 text-xs">
                          {tag.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* PRODUKTY */}
      <Section id="produkty" title="Nasze produkty">
        <ProductsBrowser categories={categories} />
      </Section>

      {/* CHLEBOWÓZ */}
      {(vanDescription || vanStops.length > 0) && (
        <Section id="chlebowoz" title="Chlebowóz">
          <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
            <div>
              {vanDescription && (
                <>
                  <p className="text-xl">{vanDescription.shortDescription}</p>
                  <p className="mt-3 leading-relaxed text-soft">{vanDescription.longDescription}</p>
                </>
              )}
            </div>
            {vanStops.length > 0 && (
              <div>
                <h3 className="mb-3 text-2xl">Harmonogram</h3>
                <ul className="divide-y divide-white/10 bg-panel-strong">
                  {WEEKDAYS.flatMap((day) =>
                    vanStops
                      .filter((stop) => stop.dayOfTheWeek === day.key)
                      .map((stop) => (
                        <li key={stop.id} className="px-4 py-3">
                          <div className="flex justify-between gap-3">
                            <span className="font-bold">{day.label}</span>
                            <span className="tabular-nums text-soft">
                              {stop.startTime}–{stop.endTime}
                            </span>
                          </div>
                          <a
                            href={stop.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 flex items-center gap-2 text-sm text-muted transition-colors hover:text-soft"
                          >
                            <FaLocationDot /> {stop.address}
                          </a>
                        </li>
                      )),
                  )}
                </ul>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* KONTAKT */}
      <Section id="kontakt" title="Kontakt">
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr]">
          <ContactForm email={email} />

          <div>
            <h3 className="text-2xl">Dane kontaktowe</h3>
            <p className="pb-3 pt-2 text-sm leading-relaxed">
              Zapraszamy do odwiedzenia naszych punktów. Poniżej znajdziesz aktualne dane kontaktowe.
            </p>

            <div className="space-y-px">
              {locations.map((location, index) => (
                // name="lokale" – otwarta jest tylko jedna zakładka naraz
                <details key={location.id} name="lokale" open={index === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-3 bg-graphite px-4 py-3 transition-colors hover:bg-graphite-darker">
                    <FaLocationDot className="shrink-0" />
                    <span className="flex-1 text-sm">{location.address}</span>
                    <FaChevronDown className="shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-3 bg-panel px-4 py-3 text-sm">
                    <div className="flex flex-wrap justify-around gap-3">
                      {location.phone && (
                        <a
                          href={`tel:${location.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 transition-colors hover:text-soft"
                        >
                          <FaPhone /> {location.phone}
                        </a>
                      )}
                      <a
                        href={location.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 transition-colors hover:text-soft"
                      >
                        <FaLocationArrow /> Przejdź do Google Maps
                      </a>
                    </div>
                    {location.openingHours && (
                      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-soft">
                        <dt className="col-span-2 mb-1 flex items-center gap-2 text-white">
                          <FaClock /> Godziny otwarcia
                        </dt>
                        {WEEKDAYS.map((day) => (
                          <div key={day.key} className="contents">
                            <dt>{day.label}</dt>
                            <dd className="tabular-nums">{hoursFor(location.openingHours!, day.key)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </details>
              ))}
            </div>

            {email && (
              <a
                href={`mailto:${email}`}
                className="mt-4 flex items-center gap-2 transition-colors hover:text-soft"
              >
                <FaEnvelope /> {email}
              </a>
            )}
            <div className="mt-3">
              <SocialLinks media={media} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
