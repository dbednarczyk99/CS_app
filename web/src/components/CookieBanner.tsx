'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onOpenConsentSettings, openConsentSettings, saveConsent, useConsent } from '@/lib/consent';
import type { SiteContent } from '@/lib/content';

/**
 * Baner o plikach cookie na dole strony – przy pierwszej wizycie i po kliknięciu „Ustawienia plików cookie”
 * w stopce. Z wymaganą zgodą na mapę: „Akceptuję” / „Tylko niezbędne”; bez – sama informacja („Rozumiem”).
 * Treść i włączniki: panel → Podstrony → Elementy wspólne → „Pliki cookie”.
 */
export function CookieBanner({ texts }: { texts: SiteContent['common.cookies'] }) {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenConsentSettings(() => setReopened(true)), []);

  // undefined – przed odczytem decyzji (serwer), null – brak decyzji
  const open = texts.visible && (reopened || consent === null);
  if (!open) return null;

  const choose = (maps: boolean) => {
    saveConsent(maps);
    setReopened(false);
  };

  return (
    // pasek na całą szerokość, przyklejony do dołu ekranu; treść w szerokości strony
    <div
      role="region"
      aria-label={texts.title}
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-gold bg-ink/95 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[0.7rem]">{texts.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            {texts.text}{' '}
            <Link
              href="/polityka-prywatnosci"
              className="whitespace-nowrap text-cream underline underline-offset-2 hover:text-gold"
            >
              {texts.policyLabel}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button type="button" className="btn btn-gold sm:min-w-44" onClick={() => choose(true)}>
            {texts.acceptLabel}
          </button>
          {texts.requireMapConsent && (
            <button type="button" className="btn btn-outline sm:min-w-44" onClick={() => choose(false)}>
              {texts.rejectLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** Link w stopce – ponowne otwarcie banera (zmiana decyzji) */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {label}
    </button>
  );
}
