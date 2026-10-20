'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Pokazuje `children` (np. rząd zakładek), dopóki mieszczą się w dostępnej szerokości;
 * gdy przestają – zamiast nich `collapsed` (np. rozwijaną listę). Sprawdza przy każdej zmianie rozmiaru.
 */
export function FitOrCollapse({
  children,
  collapsed,
  className = '',
}: {
  children: ReactNode;
  collapsed: ReactNode;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const probe = useRef<HTMLDivElement>(null);
  const [fits, setFits] = useState(true);

  useEffect(() => {
    const el = box.current;
    const measured = probe.current;
    if (!el || !measured) return;
    // pierwsze wywołanie przychodzi od razu po observe()
    const observer = new ResizeObserver(() => setFits(measured.scrollWidth <= el.clientWidth));
    observer.observe(el);
    observer.observe(measured);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative min-w-0 ${className}`}>
      {/* niewidoczna kopia do pomiaru naturalnej szerokości */}
      <div ref={probe} aria-hidden inert className="pointer-events-none invisible absolute left-0 top-0 w-max">
        {children}
      </div>
      {fits ? children : collapsed}
    </div>
  );
}
