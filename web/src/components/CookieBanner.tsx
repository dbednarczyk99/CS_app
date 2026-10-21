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
    <div
      role="region"
      aria-label={texts.title}
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:p-0"
    >
      <div className="border border-line border-t-gold bg-ink/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-6">
        <p className="eyebrow text-[0.7rem]">{texts.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-stone">
          {texts.text}{' '}
          <Link
            href="/polityka-prywatnosci"
            className="whitespace-nowrap text-cream underline underline-offset-2 hover:text-gold"
          >
            {texts.policyLabel}
          </Link>
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn btn-gold sm:flex-1" onClick={() => choose(true)}>
            {texts.acceptLabel}
          </button>
          {texts.requireMapConsent && (
            <button
              type="button"
              className="btn btn-outline sm:flex-1"
              onClick={() => choose(false)}
            >
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
