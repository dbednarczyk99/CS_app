import type { Metadata, Viewport } from 'next';
import { Lato, Oswald } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { NewsletterDialog } from '@/components/Newsletter';
import { PageViewTracker } from '@/components/PageViewTracker';
import { Header } from '@/components/Header';
import { api, orFallback } from '@/lib/api';
import { ReservationCartProvider } from '@/lib/reservation-cart';
import { JsonLd } from '@/components/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { organizationLd, websiteLd } from '@/lib/structured-data';
import './globals.css';

const lato = Lato({
  variable: '--font-lato',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  weight: ['300', '400', '500'],
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  // adres strony – pełne adresy w metadanych (kanoniczne, podgląd linków); ścieżki w podstronach są względne
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // podgląd linku przy udostępnianiu (Facebook, Messenger, WhatsApp, LinkedIn) – domyślny dla wszystkich podstron
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: SITE_NAME,
    images: [{ url: '/images/og-domyslny.jpg', width: 1200, height: 630, alt: 'Chleba Smak – piekarnia rzemieślnicza w Krakowie' }],
  },
  twitter: { card: 'summary_large_image' },
  title: {
    default: 'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
    template: '%s · Chleba Smak',
  },
  description:
    'Rzemieślnicza piekarnia z Krakowa: chleb na naturalnym zakwasie, słodkie wypieki i chlebowóz. Nasze piekarnie znajdziesz w różnych częściach Krakowa.',
};

export const viewport: Viewport = {
  themeColor: '#141618',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, media] = await Promise.all([
    orFallback(api.announcements(), []),
    orFallback(api.media(), []),
  ]);

  return (
    // data-banner: miejsce na baner pod nawigacją (--banner-h w globals.css)
    <html lang="pl" data-banner={announcements.length > 0 ? '' : undefined}>
      <body className={`${lato.variable} ${oswald.variable}`}>
        <a
          href="#tresc"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
        >
          Przejdź do treści
        </a>
        {/* dane dla Google: firma (logo, profile społecznościowe) i strona */}
        <JsonLd data={[organizationLd(media), websiteLd()]} />
        <ReservationCartProvider>
          <Header announcements={announcements} />
          <main id="tresc">{children}</main>
          <Footer />
          {/* okienko zapisu do newslettera – jedno dla całej strony */}
          <NewsletterDialog />
          <PageViewTracker />
        </ReservationCartProvider>
      </body>
    </html>
  );
}
