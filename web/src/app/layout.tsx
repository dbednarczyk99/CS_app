import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const serif = Lora({
  variable: '--font-serif',
  subsets: ['latin', 'latin-ext'],
});

const sans = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Chleba Smak – piekarnia',
  description:
    'Chleb na zakwasie, bułki i wypieki prosto z pieca. Sprawdź nasze sklepy i trasę busa z pieczywem.',
};

const NAV = [
  { href: '/#oferta', label: 'Oferta' },
  { href: '/#sklepy', label: 'Nasze sklepy' },
  { href: '/#bus', label: 'Bus z pieczywem' },
  { href: '/#kontakt', label: 'Kontakt' },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        <header className="sticky top-0 z-10 border-b border-crust/15 bg-flour/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <Link href="/" className="font-serif text-2xl font-semibold text-crust">
              Chleba Smak
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink/80 hover:text-crust"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-24 border-t border-crust/15 py-8 text-center text-sm text-ink/60">
          © {new Date().getFullYear()} Chleba Smak
        </footer>
      </body>
    </html>
  );
}
