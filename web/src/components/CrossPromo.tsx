import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { Reveal } from './Reveal';

/** Kontener-łącznik między /piekarnie a /chlebowoz („może masz bliżej do…”) */
export function CrossPromo({
  eyebrow,
  title,
  children,
  href,
  cta,
  image,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <Reveal>
      <Link
        href={href}
        className="group grid overflow-hidden border border-line bg-coal transition-colors hover:border-gold/50 md:grid-cols-[1fr_1.1fr]"
      >
        <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-80">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="heading mt-3 text-3xl sm:text-4xl">{title}</h2>
          <div className="mt-5 h-px w-16 bg-gold" />
          <div className="mt-6 text-lg leading-relaxed text-stone">{children}</div>
          <span className="link-arrow mt-8 inline-flex items-center gap-3">
            {cta}
            <FaArrowRight aria-hidden className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
