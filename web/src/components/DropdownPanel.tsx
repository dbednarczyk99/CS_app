'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Rozwijany panel na <details> (działa bez JS); z JS zamyka się po kliknięciu poza nim i klawiszem Esc.
 * Po wyborze opcji zostaje otwarty – można zaznaczyć kilka etykiet po kolei.
 */
export function DropdownPanel({
  summary,
  summaryClassName,
  children,
  className = '',
}: {
  summary: ReactNode;
  summaryClassName: string;
  children: ReactNode;
  className?: string;
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
    <details ref={ref} className={`group relative ${className}`}>
      <summary className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName}`}>{summary}</summary>
      {children}
    </details>
  );
}
