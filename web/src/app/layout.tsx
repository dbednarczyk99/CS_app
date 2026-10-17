import type { Metadata, Viewport } from 'next';
import { Lato, Oswald } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { NewsletterDialog } from '@/components/Newsletter';
import { Header } from '@/components/Header';
import { api, orFallback } from '@/lib/api';
import { ReservationCartProvider } from '@/lib/reservation-cart';
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
  title: {
    default: 'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
    template: '%s · Chleba Smak',
  },
  description:
    'Rzemieślnicza piekarnia z Krakowa: chleb na naturalnym zakwasie, słodkie wypieki i chlebowóz. Nasze piekarnie znajdziesz w różnych częściach Krakowa.',
  icons: { icon: '/images/icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#141618',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcements = await orFallback(api.announcements(), []);

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
        <ReservationCartProvider>
          <Header announcements={announcements} />
          <main id="tresc">{children}</main>
          <Footer />
          {/* okienko zapisu do newslettera – jedno dla całej strony */}
          <NewsletterDialog />
        </ReservationCartProvider>
      </body>
    </html>
  );
}
