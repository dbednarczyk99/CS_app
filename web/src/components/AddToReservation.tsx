'use client';

import Link from 'next/link';
import { FaArrowRight, FaMinus, FaPlus } from 'react-icons/fa6';
import type { Product } from '@/lib/api';
import { MAX_QUANTITY, useReservationCart } from '@/lib/reservation-cart';

function toCartProduct(product: Product) {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0]?.imgUrl,
  };
}

export function QuantityStepper({
  value,
  onChange,
  size = 'sm',
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'lg';
  label: string;
}) {
  const btn = size === 'lg' ? 'size-12' : 'size-10';
  return (
    <div className="inline-flex items-center border border-gold/60" role="group" aria-label={`Ilość: ${label}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label="Mniej"
        className={`${btn} grid place-items-center text-gold transition-colors hover:bg-gold hover:text-ink`}
      >
        <FaMinus size={12} />
      </button>
      <span className={`min-w-10 text-center font-display tabular-nums ${size === 'lg' ? 'text-lg' : ''}`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
        aria-label="Więcej"
        className={`${btn} grid place-items-center text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-40`}
      >
        <FaPlus size={12} />
      </button>
    </div>
  );
}

/** Kompaktowy przycisk na karcie produktu */
export function AddToReservationCompact({ product }: { product: Product }) {
  const { quantityOf, setQuantity, ready } = useReservationCart();
  const quantity = ready ? quantityOf(product.id) : 0;

  if (product.isReservable === false) {
    return <p className="font-display text-[0.7rem] uppercase tracking-[0.2em] text-stone">Tylko na miejscu</p>;
  }
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => setQuantity(toCartProduct(product), 1)}
        className="btn btn-outline min-h-10 w-full px-3 py-2 text-[0.7rem] sm:w-auto"
      >
        <FaPlus size={10} aria-hidden /> Zarezerwuj
      </button>
    );
  }
  return <QuantityStepper value={quantity} onChange={(q) => setQuantity(toCartProduct(product), q)} label={product.name} />;
}

/** Pełny wybór ilości na stronie produktu */
export function AddToReservation({ product }: { product: Product }) {
  const { quantityOf, setQuantity, ready } = useReservationCart();
  const quantity = ready ? quantityOf(product.id) : 0;

  if (product.isReservable === false) {
    return (
      <p className="text-stone">
        Ten produkt jest dostępny tylko na miejscu – nie można go zarezerwować online.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      {quantity === 0 ? (
        <button type="button" onClick={() => setQuantity(toCartProduct(product), 1)} className="btn btn-gold">
          <FaPlus size={12} aria-hidden /> Dodaj do rezerwacji
        </button>
      ) : (
        <>
          <QuantityStepper
            value={quantity}
            onChange={(q) => setQuantity(toCartProduct(product), q)}
            size="lg"
            label={product.name}
          />
          <Link href="/rezerwacja" className="btn btn-gold">
            Przejdź do rezerwacji <FaArrowRight aria-hidden />
          </Link>
        </>
      )}
    </div>
  );
}
