import { useEffect, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Liczba potwierdzonych subskrybentów newslettera – z /newsletter/stats, dostępnego dla obu ról
 * (sama lista adresów jest tylko dla właściciela). undefined = ładowanie, null = błąd.
 */
export function useSubscriberCount(): number | null | undefined {
  const [count, setCount] = useState<number | null | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    fetch(`${apiUrl}/newsletter/stats`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((s: { confirmed: number }) => !cancelled && setCount(s.confirmed))
      .catch(() => !cancelled && setCount(null));
    return () => {
      cancelled = true;
    };
  }, []);
  return count;
}
