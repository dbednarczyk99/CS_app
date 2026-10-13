'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaChevronDown, FaXmark } from 'react-icons/fa6';

const ABOUT_LINKS = [
  { href: '/#chlebowoz', label: 'Chlebowóz' },
  { href: '/#kontakt', label: 'Nasze lokalizacje' },
  { href: '/#o-nas', label: 'Nasz zespół' },
];

const LINKS = [
  { href: '/#aktualnosci', label: 'Aktualności' },
  { href: '/#produkty', label: 'Nasze produkty' },
  { href: '/#kontakt', label: 'Kontakt' },
];

const linkClass = 'block px-3 py-2 text-muted transition-colors hover:text-soft';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 mx-auto max-w-[90%] bg-graphite px-3 md:px-8">
      <div className="flex items-center justify-between gap-4 py-2">
        <Link href="/#start" onClick={close} className="w-56 shrink-0 sm:w-72 lg:w-80">
          <Image
            src="/images/logo-poziome-biale.png"
            alt="Chleba Smak – piekarnia rzemieślnicza"
            width={769}
            height={112}
            priority
          />
        </Link>

        <button
          type="button"
          className="rounded border border-white/20 p-2 text-muted md:hidden"
          aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FaXmark size={22} /> : <FaBars size={22} />}
        </button>

        <ul className="hidden items-center md:flex">
          <li>
            <Link href="/#start" className={linkClass}>
              Strona główna
            </Link>
          </li>
          <li className="group relative">
            <button type="button" className={`${linkClass} flex items-center gap-1`}>
              O nas <FaChevronDown size={10} />
            </button>
            <ul className="invisible absolute left-0 top-full min-w-48 bg-graphite py-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <ul className="pb-3 md:hidden">
          <li>
            <Link href="/#start" onClick={close} className={linkClass}>
              Strona główna
            </Link>
          </li>
          <li className="px-3 pt-2 text-xs uppercase tracking-widest text-white/40">O nas</li>
          {ABOUT_LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} onClick={close} className={`${linkClass} pl-6`}>
                {link.label}
              </Link>
            </li>
          ))}
          {LINKS.map((link) => (
            <li key={link.label}>
              <Link href={link.href} onClick={close} className={linkClass}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
