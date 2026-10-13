import type { Metadata } from 'next';
import { Lato, Oswald } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { SocialLinks } from '@/components/SocialLinks';
import { api, orFallback } from '@/lib/api';
import './globals.css';

const lato = Lato({
  variable: '--font-lato',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'latin-ext'],
});

const oswald = Oswald({
  variable: '--font-oswald',
  weight: ['300', '500', '700'],
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Chleba Smak – piekarnia rzemieślnicza w Krakowie',
  description:
    'Piekarnia rzemieślnicza Chleba Smak – chleb na zakwasie i wypieki z czterech piekarni w Krakowie oraz z naszego chlebowozu.',
  icons: { icon: '/images/icon.png' },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const media = await orFallback(api.media(), []);

  return (
    <html lang="pl">
      <body className={`${lato.variable} ${oswald.variable} antialiased`}>
        {/* Nieruchome zdjęcie w tle (warstwa fixed – działa też na iOS, w przeciwieństwie do background-attachment) */}
        <div
          aria-hidden
          className="fixed inset-0 -z-10 bg-[url(/images/tlo.jpg)] bg-cover bg-center"
        />
        <Navbar />
        <main>{children}</main>
        <footer className="mx-auto max-w-[90%] bg-graphite px-4 py-2">
          <div className="flex flex-col items-center gap-1 md:flex-row-reverse md:justify-around">
            <SocialLinks media={media} size={20} />
            <p className="text-[11px]">
              Wszelkie prawa zastrzeżone © {new Date().getFullYear()} Chleba Smak
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
