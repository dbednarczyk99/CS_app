'use client';

import { useState } from 'react';
import type { Category } from '@/lib/api';

const price = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

// Kategorie po lewej, lista produktów po prawej (układ z pierwszej wersji strony)
export function ProductsBrowser({ categories }: { categories: Category[] }) {
  const visible = categories
    .map((c) => ({ ...c, products: c.products.filter((p) => p.isActive) }))
    .filter((c) => c.products.length > 0);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (visible.length === 0) {
    return <p className="text-center text-soft">Oferta pojawi się wkrótce.</p>;
  }

  const shown = activeId ? visible.filter((c) => c.id === activeId) : visible;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_3fr]">
      <ul className="flex flex-wrap gap-2 self-start md:flex-col md:gap-0">
        {[{ id: null, name: 'Wszystkie' }, ...visible].map((category) => {
          const active = activeId === category.id;
          return (
            <li key={category.id ?? 'all'}>
              <button
                type="button"
                onClick={() => setActiveId(category.id)}
                className={`w-full px-4 py-2 text-left transition-colors ${
                  active
                    ? 'bg-graphite text-white'
                    : 'bg-panel-strong text-muted hover:bg-graphite-darker hover:text-soft'
                }`}
              >
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-8">
        {shown.map((category) => (
          <div key={category.id}>
            <h3 className="mb-3 text-xl">{category.name}</h3>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {category.products.map((product) => {
                const image = product.images?.[0];
                return (
                  <li key={product.id} className="flex flex-col bg-panel-strong">
                    {image && (
                      // zdjęcia pochodzą z API (/uploads), więc zwykły <img>
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.imgUrl}
                        alt={product.name}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-bold">{product.name}</h4>
                        <span className="whitespace-nowrap">{price.format(product.price)}</span>
                      </div>
                      <p className="mt-2 text-sm text-soft">{product.description}</p>
                      {product.isSeasonal && (
                        <span className="mt-3 self-start border border-white/40 px-2 py-0.5 text-xs uppercase tracking-wider">
                          sezonowy
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
