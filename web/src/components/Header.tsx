'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { NAV } from '@/lib/nav';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // zamknięcie menu po zmianie strony
  useEffect(() => setOpen(false), [pathname]);

  // blokada przewijania strony pod otwartym menu
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const solid = scrolled || open;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-line bg-ink/90 backdrop-blur-md' : 'bg-gradient-to-b from-ink/70 to-transparent'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
        <Link href="/" className="w-44 shrink-0 sm:w-56" aria-label="Chleba Smak – strona główna">
          <Image
            src="/images/logo-poziome-biale.png"
            alt="Chleba Smak – piekarnia rzemieślnicza"
            width={769}
            height={112}
            priority
          />
        </Link>

        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`font-display text-[0.8rem] uppercase tracking-[0.2em] transition-colors hover:text-gold ${
                    isActive(item.href) ? 'text-gold' : 'text-cream/85'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/oferta" className="btn btn-outline hidden min-h-0 px-5 py-2.5 text-[0.75rem] sm:inline-flex">
            Nasze wypieki
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobilne"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            className="grid size-11 place-items-center text-cream lg:hidden"
          >
            {open ? <FaXmark size={24} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobilne na pełny ekran */}
      <div
        id="menu-mobilne"
        hidden={!open}
        className="h-[calc(100svh-4.5rem)] overflow-y-auto border-t border-line bg-ink px-5 pb-10 sm:h-[calc(100svh-5rem)] lg:hidden"
      >
        <nav aria-label="Menu mobilne">
          <ul className="divide-y divide-line">
            {[{ href: '/', label: 'Strona główna' }, ...NAV].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`heading block py-5 text-2xl transition-colors hover:text-gold ${
                    (item.href === '/' ? pathname === '/' : isActive(item.href)) ? 'text-gold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
