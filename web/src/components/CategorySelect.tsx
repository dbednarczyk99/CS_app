'use client';

import { useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa6';

/** Wybór kategorii jako lista rozwijana (telefon/tablet) – mieści dowolnie wiele kategorii */
export function CategorySelect({
  categories,
  value,
  hrefFor,
}: {
  categories: { id: string; name: string }[];
  value: string;
  /** adres oferty dla wybranej kategorii ('' = wszystkie), z zachowaniem etykiet */
  hrefFor: Record<string, string>;
}) {
  const router = useRouter();
  return (
    <label className="relative min-w-0 flex-1 sm:flex-none">
      <span className="sr-only">Kategoria</span>
      <select
        value={value}
        onChange={(e) => router.push(hrefFor[e.target.value], { scroll: false })}
        className={`h-10 w-full appearance-none truncate border bg-ink py-0 pl-4 pr-9 font-display text-[0.75rem] uppercase tracking-[0.2em] focus:border-gold focus:outline-none ${
          value ? 'border-gold text-gold' : 'border-line text-cream'
        }`}
      >
        <option value="">Wszystkie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <FaChevronDown
        size={10}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-stone"
      />
    </label>
  );
}
