import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { Reveal } from './Reveal';

/**
 * Sekcja-łącznik między /piekarnie a /chlebowoz („może masz bliżej do…”),
 * w tym samym stylu co „Usiądź na chwilę”. `reverse` = zdjęcie po prawej (desktop).
 */
export function CrossPromo({
  eyebrow,
  title,
  children,
  href,
  cta,
  image,
  imageAlt,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <Reveal className="grid items-center gap-10 border-t border-line pt-20 md:grid-cols-2 md:gap-16">
      <div className={`relative aspect-[4/5] overflow-hidden md:aspect-[3/4] ${reverse ? 'md:order-2' : ''}`}>
        <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
      </div>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="heading mt-3 text-3xl sm:text-4xl">{title}</h2>
        <div className="mt-5 h-px w-16 bg-gold" />
        <p className="mt-6 text-lg leading-relaxed text-stone">{children}</p>
        <Link href={href} className="link-arrow mt-10 inline-flex items-center gap-3">
          {cta} <FaArrowRight aria-hidden />
        </Link>
      </div>
    </Reveal>
  );
}
