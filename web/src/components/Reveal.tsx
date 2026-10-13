'use client';

import { useEffect, useRef, useState } from 'react';

type State = 'static' | 'hidden' | 'shown';

/**
 * Delikatne pojawienie się treści przy przewijaniu.
 * Treść jest widoczna w HTML z serwera – ukrywamy ją dopiero w przeglądarce i tylko wtedy,
 * gdy jest poniżej ekranu (bez JS lub przy prefers-reduced-motion nic nie znika).
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('static');

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState('hidden');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const motion =
    state === 'static'
      ? ''
      : `transition-all duration-700 ease-out ${state === 'shown' ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`;

  return (
    <div ref={ref} style={state === 'shown' ? { transitionDelay: `${delay}ms` } : undefined} className={`${motion} ${className}`}>
      {children}
    </div>
  );
}
