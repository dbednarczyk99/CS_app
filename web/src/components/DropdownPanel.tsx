'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Rozwijany panel na <details> (działa bez JS); z JS zamyka się po kliknięciu poza nim i klawiszem Esc.
 * closeOnSelect: zamknięcie po kliknięciu linku w panelu (wybór jednej opcji); bez tego panel zostaje
 * otwarty – można zaznaczyć kilka opcji po kolei.
 */
export function DropdownPanel({
  summary,
  summaryClassName,
  children,
  className = '',
  closeOnSelect = false,
}: {
  summary: ReactNode;
  summaryClassName: string;
  children: ReactNode;
  className?: string;
  closeOnSelect?: boolean;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (event: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !el.contains(event.target as Node)) {
        el.open = false;
      }
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, []);

  return (
    <details
      ref={ref}
      className={`group relative ${className}`}
      onClick={(event) => {
        if (closeOnSelect && (event.target as HTMLElement).closest('a') && ref.current) ref.current.open = false;
      }}
    >
      <summary className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName}`}>{summary}</summary>
      {children}
    </details>
  );
}
