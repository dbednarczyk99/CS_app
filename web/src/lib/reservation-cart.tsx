'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContext {
  items: CartItem[];
  count: number;
  total: number;
  /** false do czasu odczytu z localStorage – zapobiega „mignięciu” pustego koszyka */
  ready: boolean;
  quantityOf: (productId: string) => number;
  setQuantity: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  replace: (items: CartItem[]) => void;
  clear: () => void;
}

export const MAX_QUANTITY = 50;
const STORAGE_KEY = 'chlebasmak-rezerwacja';

const Context = createContext<CartContext | null>(null);

/** Produkty wybrane do rezerwacji – zapamiętane w przeglądarce */
export function ReservationCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
      if (Array.isArray(saved)) setItems(saved.filter((i) => i.productId && i.quantity > 0));
    } catch {
      // brak dostępu do localStorage (tryb prywatny itp.) – koszyk tylko w pamięci
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // jw.
    }
  }, [items, ready]);

  const setQuantity = useCallback<CartContext['setQuantity']>((product, quantity) => {
    const q = Math.max(0, Math.min(MAX_QUANTITY, Math.round(quantity)));
    setItems((current) => {
      const exists = current.some((i) => i.productId === product.productId);
      if (q === 0) return current.filter((i) => i.productId !== product.productId);
      if (exists) return current.map((i) => (i.productId === product.productId ? { ...i, ...product, quantity: q } : i));
      return [...current, { ...product, quantity: q }];
    });
  }, []);

  const value = useMemo<CartContext>(
    () => ({
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      quantityOf: (id) => items.find((i) => i.productId === id)?.quantity ?? 0,
      setQuantity,
      replace: setItems,
      clear: () => setItems([]),
    }),
    [items, ready, setQuantity],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useReservationCart() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useReservationCart poza ReservationCartProvider');
  return ctx;
}
