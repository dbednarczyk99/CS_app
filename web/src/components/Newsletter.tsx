'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { FaEnvelopeOpenText, FaXmark } from 'react-icons/fa6';

const OPEN_EVENT = 'newsletter:open';

/** Otwiera okienko zapisu do newslettera (z dowolnego miejsca strony) */
export function openNewsletter() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/** Przycisk otwierający okienko – w stopce, na stronie Kontakt itd. */
export function NewsletterButton({ className, children }: { className: string; children: ReactNode }) {
  return (
    <button type="button" onClick={openNewsletter} className={className}>
      {children}
    </button>
  );
}

/**
 * Okienko zapisu do newslettera (natywny <dialog>: półprzezroczysta warstwa na stronie, Esc, fokus
 * w okienku). Otwiera się zdarzeniem openNewsletter(), kliknięciem w link „#newsletter” (np. na pasku
 * komunikatów) albo wejściem na adres z #newsletter. Zapis z podwójnym potwierdzeniem – po wysłaniu
 * prosi o kliknięcie linku z e-maila.
 */
export function NewsletterDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => {
    const el = dialog.current;
    if (!el || el.open) return;
    setStatus('idle');
    setError(null);
    el.showModal();
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    const onLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href="#newsletter"]');
      if (!link) return;
      e.preventDefault();
      open();
    };
    window.addEventListener(OPEN_EVENT, open);
    document.addEventListener('click', onLinkClick);
    if (window.location.hash === '#newsletter') open();
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      document.removeEventListener('click', onLinkClick);
    };
  }, [open]);

  const close = () => dialog.current?.close();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/newsletter/zapisz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, consent: data.consent === 'on', website: data.website || undefined }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError((Array.isArray(body?.message) ? body.message.join(' ') : body?.message) ?? 'Nie udało się zapisać. Spróbuj ponownie.');
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setError('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
      setStatus('idle');
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="newsletter-title"
      onClose={() => {
        document.body.style.overflow = '';
        if (window.location.hash === '#newsletter') history.replaceState(null, '', window.location.pathname + window.location.search);
      }}
      // kliknięcie w półprzezroczyste tło zamyka okienko
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="m-auto w-[calc(100%-2.5rem)] max-w-md border border-line border-t-2 border-t-gold bg-coal p-0 text-cream shadow-2xl shadow-black/60 backdrop:bg-ink/75 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-7 sm:p-9">
        <button
          type="button"
          onClick={close}
          aria-label="Zamknij"
          className="absolute right-3 top-3 grid size-10 place-items-center text-stone transition-colors hover:text-gold"
        >
          <FaXmark size={18} aria-hidden />
        </button>

        <FaEnvelopeOpenText size={26} className="text-gold" aria-hidden />
        <p className="eyebrow mt-5">Newsletter</p>
        <h2 id="newsletter-title" className="heading mt-2 text-2xl sm:text-3xl">
          {status === 'sent' ? 'Sprawdź skrzynkę' : 'Bądź na bieżąco'}
        </h2>
        <div className="mt-4 h-px w-12 bg-gold" />

        {status === 'sent' ? (
          <div role="status">
            <p className="mt-5 leading-relaxed text-stone">
              Wysłaliśmy Ci e-mail z linkiem potwierdzającym. Kliknij go, a zaczniemy wysyłać wiadomości –
              bez potwierdzenia nie wyślemy nic więcej.
            </p>
            <button type="button" onClick={close} className="btn btn-outline mt-7 w-full">
              Zamknij
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5">
            <p className="leading-relaxed text-stone">
              Nowości, wypieki sezonowe, promocje i konkursy, a także ważne informacje – np. o przerwie
              w kursowaniu chlebowozu czy zmianie godzin piekarni. Bez spamu, wypiszesz się w każdej chwili.
            </p>
            <label htmlFor="newsletter-email" className="mt-6 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone">
              Adres e-mail
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="twoj@email.pl"
              className="mt-2 w-full border border-line bg-ink px-4 py-3 text-cream placeholder:text-stone/60 transition-colors focus:border-gold focus:outline-none"
            />
            {/* pułapka na boty – niewidoczna dla ludzi */}
            <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="newsletter-website">Strona www</label>
              <input id="newsletter-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone">
              <input name="consent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[var(--color-gold)]" />
              <span>
                Chcę otrzymywać newsletter Chleba Smak na podany adres e-mail. Zgodę mogę wycofać w każdej chwili –
                link do wypisania jest w każdej wiadomości. Więcej w{' '}
                <Link href="/polityka-prywatnosci" className="text-cream underline underline-offset-4 hover:text-gold">
                  polityce prywatności
                </Link>
                .
              </span>
            </label>
            {error && (
              <p role="alert" className="mt-4 border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
            <button type="submit" disabled={status === 'sending'} className="btn btn-gold mt-6 w-full">
              {status === 'sending' ? 'Zapisywanie…' : 'Zapisz się'}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
