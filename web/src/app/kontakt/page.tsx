import type { Metadata } from 'next';
import { FaEnvelope, FaInstagram, FaLocationArrow, FaPhone } from 'react-icons/fa6';
import { ContactForm } from '@/components/ContactForm';
import { NewsletterButton } from '@/components/Newsletter';
import { PageHeader } from '@/components/PageHeader';
import { SocialLinks } from '@/components/SocialLinks';
import { api, orFallback } from '@/lib/api';
import { instagramProfile, telHref } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Skontaktuj się z piekarnią Chleba Smak – telefony do piekarni, e-mail i formularz kontaktowy.',
};

export default async function ContactPage() {
  const [locations, contact, media] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.contactInfo(), []),
    orFallback(api.media(), []),
  ]);
  const email = contact.find((c) => c.type === 'EMAIL')?.value;
  // główny telefon (z panelu: Contact info, typ PHONE) – oprócz numerów poszczególnych piekarni
  const phone = contact.find((c) => c.type === 'PHONE')?.value;
  const instagramUrl = media.find((m) => m.name === 'INSTAGRAM')?.url;
  const instagram = instagramUrl ? instagramProfile(instagramUrl) : null;

  return (
    <>
      <PageHeader eyebrow="Kontakt" title="Porozmawiajmy" image="/images/wnetrze.jpg">
        Masz pytanie o zamówienie, chcesz zaproponować współpracę albo podzielić się pomysłem na nowy
        bochenek? Napisz lub zadzwoń.
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        <section aria-labelledby="formularz">
          <h2 id="formularz" className="heading text-2xl sm:text-3xl">
            Napisz do nas
          </h2>
          <div className="mt-5 h-px w-16 bg-gold" />
          <div className="mt-8">
            <ContactForm email={email} />
          </div>

          {/* komputer: newsletter pod formularzem */}
          <NewsletterSection className="mt-16 hidden border-t border-line pt-12 lg:block" />
        </section>

        <aside className="space-y-12">
          {instagram && (
            // nagłówek w tym samym stylu i na tej samej wysokości co „Napisz do nas” obok
            <section aria-labelledby="instagram" className="border-b border-line pb-12">
              <h2 id="instagram" className="heading text-2xl sm:text-3xl">
                Wolisz Instagram?
              </h2>
              <div className="mt-5 h-px w-16 bg-gold" />
              <p className="mt-8 leading-relaxed text-stone">
                Napisz do nas wiadomość – link otworzy od razu rozmowę z{' '}
                <span className="text-cream">@{instagram.handle}</span>.
              </p>
              <a
                href={instagram.dmUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold mt-6 w-full sm:w-auto"
              >
                <FaInstagram aria-hidden /> Otwórz rozmowę
              </a>
            </section>
          )}

          {/* telefon/tablet: newsletter pod sekcją Instagrama */}
          <NewsletterSection className="border-b border-line pb-12 lg:hidden" />

          {phone && (
            <div>
              <h2 className="eyebrow">Telefon</h2>
              <a
                href={telHref(phone)}
                className="mt-3 inline-flex items-center gap-3 text-lg transition-colors hover:text-gold"
              >
                <FaPhone className="text-gold" aria-hidden /> {phone}
              </a>
            </div>
          )}

          {email && (
            <div>
              <h2 className="eyebrow">E-mail</h2>
              <a
                href={`mailto:${email}`}
                className="mt-3 inline-flex items-center gap-3 text-lg transition-colors hover:text-gold"
              >
                <FaEnvelope className="text-gold" aria-hidden /> {email}
              </a>
            </div>
          )}

          <div>
            <h2 className="eyebrow">Piekarnie</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {locations.map((location) => (
                <li key={location.id} className="py-4">
                  <p>{location.address}</p>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    {location.phone && (
                      <a
                        href={telHref(location.phone)}
                        className="inline-flex items-center gap-2 text-stone transition-colors hover:text-gold"
                      >
                        <FaPhone aria-hidden /> {location.phone}
                      </a>
                    )}
                    <a
                      href={location.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-stone transition-colors hover:text-gold"
                    >
                      <FaLocationArrow aria-hidden /> Mapa
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {media.length > 0 && (
            <div>
              <h2 className="eyebrow">Obserwuj nas</h2>
              <div className="mt-4">
                <SocialLinks media={media} size={26} />
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

/** Zapis do newslettera – na komputerze pod formularzem, na telefonie pod sekcją Instagrama */
function NewsletterSection({ className }: { className: string }) {
  return (
    <section aria-label="Newsletter" className={className}>
      <p className="eyebrow">Newsletter</p>
      <h2 className="heading mt-3 text-2xl">Bądź na bieżąco</h2>
      <p className="mt-4 max-w-lg leading-relaxed text-stone">
        Nowości, wypieki sezonowe, promocje i konkursy – a do tego ważne informacje, np. o przerwie w
        kursowaniu chlebowozu czy zmianie godzin piekarni. Bez spamu, wypiszesz się w każdej chwili.
      </p>
      <NewsletterButton className="btn btn-gold mt-6 w-full sm:w-auto">
        <FaEnvelope aria-hidden /> Zapisz się do newslettera
      </NewsletterButton>
    </section>
  );
}
