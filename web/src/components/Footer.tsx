import Image from 'next/image';
import Link from 'next/link';
import { FaEnvelope, FaStar } from 'react-icons/fa6';
import { api, orFallback } from '@/lib/api';
import { telHref } from '@/lib/format';
import { ratingFormat, ratingSummary } from '@/lib/google';
import { NAV } from '@/lib/nav';
import { NewsletterButton } from './Newsletter';
import { SocialLinks } from './SocialLinks';

export async function Footer() {
  const [locations, contact, media] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.contactInfo(), []),
    orFallback(api.media(), []),
  ]);
  const email = contact.find((c) => c.type === 'EMAIL')?.value;
  // główny telefon (z panelu: Contact info, typ PHONE) – oprócz numerów poszczególnych piekarni
  const phone = contact.find((c) => c.type === 'PHONE')?.value;
  // ocena zbiorcza z Google (średnia ważona liczbą opinii wszystkich piekarni)
  const rating = ratingSummary(locations);

  return (
    <footer className="border-t border-line bg-coal">
      {/* komputer: 4 kolumny; telefon/tablet bez „Na skróty” – te same linki są w menu */}
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 md:py-14 lg:grid-cols-[1.25fr_1.35fr_1fr_0.7fr] lg:gap-12">
        <div>
          <Image
            src="/images/logo-poziome-biale.png"
            alt="Chleba Smak"
            width={769}
            height={112}
            className="w-52"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone">
            Rzemieślnicza piekarnia z Krakowa. Chleb na naturalnym zakwasie i słodkie wypieki – codziennie od świtu.
          </p>
          {rating && (
            <Link href="/piekarnie" className="group mt-4 inline-flex items-center gap-2 text-sm">
              <FaStar aria-hidden className="text-gold" />
              <span className="font-display text-base text-cream">{ratingFormat.format(rating.rating)}</span>
              <span className="text-stone transition-colors group-hover:text-gold">
                średnio z {rating.count} opinii w Google
              </span>
            </Link>
          )}
          <div className="mt-5">
            <SocialLinks media={media} size={20} />
          </div>
        </div>

        <div>
          <h2 className="eyebrow">Nasze piekarnie</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {locations.map((location) => (
              <li key={location.id}>
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream transition-colors hover:text-gold"
                >
                  {location.address}
                </a>
                {location.phone && (
                  <a
                    href={telHref(location.phone)}
                    className="block text-stone transition-colors hover:text-gold"
                  >
                    {location.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {(phone || email) && (
            <>
              <h2 className="eyebrow">Kontakt</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {phone && (
                  <li>
                    <a href={telHref(phone)} className="text-cream transition-colors hover:text-gold">
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className="break-all text-cream transition-colors hover:text-gold">
                      {email}
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
          <h2 className={`eyebrow ${phone || email ? 'mt-8' : ''}`}>Newsletter</h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">Nowości, promocje i konkursy – prosto na skrzynkę.</p>
          <NewsletterButton className="btn btn-outline mt-4 min-h-10 px-4 py-2 text-[0.7rem]">
            <FaEnvelope size={11} aria-hidden /> Zapisz się
          </NewsletterButton>
        </div>

        <div className="hidden lg:block">
          <h2 className="eyebrow">Na skróty</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-stone transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-xs tracking-wide text-stone sm:px-8">
          <p>© {new Date().getFullYear()} Chleba Smak · Piekarnia Rzemieślnicza · Kraków</p>
          <nav aria-label="Dokumenty" className="flex gap-5">
            <Link href="/regulamin" className="transition-colors hover:text-gold">
              Regulamin rezerwacji
            </Link>
            <Link href="/polityka-prywatnosci" className="transition-colors hover:text-gold">
              Polityka prywatności
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
