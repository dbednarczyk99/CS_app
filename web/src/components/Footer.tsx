import Image from 'next/image';
import Link from 'next/link';
import { api, orFallback } from '@/lib/api';
import { telHref } from '@/lib/format';
import { NAV } from '@/lib/nav';
import { SocialLinks } from './SocialLinks';

export async function Footer() {
  const [locations, contact, media] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.contactInfo(), []),
    orFallback(api.media(), []),
  ]);
  const email = contact.find((c) => c.type === 'EMAIL')?.value;

  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image
            src="/images/logo-poziome-biale.png"
            alt="Chleba Smak"
            width={769}
            height={112}
            className="w-56"
          />
          <p className="mt-6 max-w-sm leading-relaxed text-stone">
            Rzemieślnicza piekarnia z Krakowa. Chleb na naturalnym zakwasie i słodkie wypieki
            przygotowywane każdego dnia od świtu.
          </p>
          <div className="mt-6">
            <SocialLinks media={media} size={22} />
          </div>
        </div>

        <div>
          <h2 className="eyebrow">Nasze piekarnie</h2>
          <ul className="mt-5 space-y-4 text-sm">
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
          <h2 className="eyebrow">Na skróty</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm lg:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-stone transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {email && (
            <>
              <h2 className="eyebrow mt-10">Napisz do nas</h2>
              <a href={`mailto:${email}`} className="mt-4 block text-sm text-cream transition-colors hover:text-gold">
                {email}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs tracking-wide text-stone sm:px-8">
          © {new Date().getFullYear()} Chleba Smak · Piekarnia Rzemieślnicza · Kraków
        </p>
      </div>
    </footer>
  );
}
