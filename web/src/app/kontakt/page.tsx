import { FaEnvelope, FaInstagram, FaLocationArrow, FaPhone } from 'react-icons/fa6';
import { ContactForm } from '@/components/ContactForm';
import { NewsletterButton } from '@/components/Newsletter';
import { PageHeader } from '@/components/PageHeader';
import { SocialLinks } from '@/components/SocialLinks';
import { api, orFallback } from '@/lib/api';
import { instagramProfile, telHref } from '@/lib/format';
import { getContent, seoMetadata, type SiteContent } from '@/lib/content';

export const generateMetadata = () => seoMetadata('seo.contact', { path: '/kontakt' });

/** Teksty – z panelu (Strona → Podstrony → Kontakt); dane kontaktowe – z zakładek Kontakt i Piekarnie */
export default async function ContactPage() {
  const [locations, contact, media, content] = await Promise.all([
    orFallback(api.locations(), []),
    orFallback(api.contactInfo(), []),
    orFallback(api.media(), []),
    getContent(),
  ]);
  const header = content['contact.header'];
  const texts = content['contact.page'];
  const email = contact.find((c) => c.type === 'EMAIL')?.value;
  // główny telefon (z panelu: Contact info, typ PHONE) – oprócz numerów poszczególnych piekarni
  const phone = contact.find((c) => c.type === 'PHONE')?.value;
  const instagramUrl = media.find((m) => m.name === 'INSTAGRAM')?.url;
  const instagram = instagramUrl ? instagramProfile(instagramUrl) : null;

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} image={header.image.url}>
        {header.text || null}
      </PageHeader>

      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        <section aria-labelledby="formularz">
          <h2 id="formularz" className="heading text-2xl sm:text-3xl">
            {texts.formTitle}
          </h2>
          <div className="mt-5 h-px w-16 bg-gold" />
          <div className="mt-8">
            <ContactForm email={email} />
          </div>

          {/* komputer: newsletter pod formularzem */}
          <NewsletterSection texts={texts} className="mt-16 hidden border-t border-line pt-12 lg:block" />
        </section>

        <aside className="space-y-12">
          {instagram && (
            // nagłówek w tym samym stylu i na tej samej wysokości co „Napisz do nas” obok
            <section aria-labelledby="instagram" className="border-b border-line pb-12">
              <h2 id="instagram" className="heading text-2xl sm:text-3xl">
                {texts.instagramTitle}
              </h2>
              <div className="mt-5 h-px w-16 bg-gold" />
              <p className="mt-8 leading-relaxed text-stone">
                {/* {profil} → wyróżniona nazwa profilu */}
                {texts.instagramText.split('{profil}').map((part, i) => (
                  <span key={i}>
                    {i > 0 && <span className="text-cream">@{instagram.handle}</span>}
                    {part}
                  </span>
                ))}
              </p>
              <a
                href={instagram.dmUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold mt-6 w-full sm:w-auto"
              >
                <FaInstagram aria-hidden /> {texts.instagramButton}
              </a>
            </section>
          )}

          {/* telefon/tablet: newsletter pod sekcją Instagrama */}
          <NewsletterSection texts={texts} className="border-b border-line pb-12 lg:hidden" />

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
function NewsletterSection({ className, texts }: { className: string; texts: SiteContent['contact.page'] }) {
  return (
    <section aria-label="Newsletter" className={className}>
      <p className="eyebrow">{texts.newsletterEyebrow}</p>
      <h2 className="heading mt-3 text-2xl">{texts.newsletterTitle}</h2>
      <p className="mt-4 max-w-lg leading-relaxed text-stone">{texts.newsletterText}</p>
      <NewsletterButton className="btn btn-gold mt-6 w-full sm:w-auto">
        <FaEnvelope aria-hidden /> {texts.newsletterButton}
      </NewsletterButton>
    </section>
  );
}
