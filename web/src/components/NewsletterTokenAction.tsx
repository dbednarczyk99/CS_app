'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa6';

type Action = 'potwierdz' | 'wypisz';

const TEXT: Record<Action, { title: string; lead: string; button: string; done: string; doneLead: string }> = {
  potwierdz: {
    title: 'Potwierdź zapis do newslettera',
    lead: 'Kliknij przycisk, aby potwierdzić, że chcesz otrzymywać od nas wiadomości o nowościach, wypiekach sezonowych i promocjach.',
    button: 'Potwierdzam zapis',
    done: 'Gotowe – jesteś zapisany(-a)!',
    doneLead: 'Dziękujemy. Pierwsza wiadomość od nas wkrótce. Wypisać możesz się w każdej chwili linkiem z e-maila.',
  },
  wypisz: {
    title: 'Wypisz się z newslettera',
    lead: 'Kliknij przycisk, a nie będziemy już wysyłać Ci wiadomości. Szkoda, że nas opuszczasz!',
    button: 'Wypisz mnie',
    done: 'Wypisaliśmy Cię z newslettera',
    doneLead: 'Nie wyślemy Ci już żadnych wiadomości. Jeśli zmienisz zdanie, możesz zapisać się ponownie w stopce strony.',
  },
};

/**
 * Potwierdzenie / wypisanie – po kliknięciu przycisku (nie przy samym wejściu na stronę: skanery poczty
 * otwierają linki z e-maili i potwierdzałyby zapis bez wiedzy odbiorcy).
 */
export function NewsletterTokenAction({ action, token }: { action: Action; token: string }) {
  const t = TEXT[action];
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setStatus('sending');
    try {
      const res = await fetch(`/api/newsletter/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(body?.message ?? 'Link jest nieprawidłowy albo wygasł.');
        setStatus('error');
        return;
      }
      // zapis potwierdzony wcześniej / adres wypisany wcześniej
      if (body?.status === 'already-confirmed') setMessage('Ten adres był już potwierdzony – wszystko w porządku.');
      if (body?.status === 'unsubscribed' && action === 'potwierdz')
        setMessage('Ten adres został wcześniej wypisany. Aby znów otrzymywać newsletter, zapisz się ponownie w stopce strony.');
      setStatus('done');
    } catch {
      setMessage('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
      setStatus('error');
    }
  }

  return (
    <div className="border border-line border-t-2 border-t-gold bg-coal p-8 text-center sm:p-12">
      {status === 'done' ? (
        <>
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
            <FaCheck size={22} aria-hidden />
          </span>
          <h1 className="heading mt-6 text-2xl sm:text-3xl">{t.done}</h1>
          <p className="mt-4 leading-relaxed text-stone">{message ?? t.doneLead}</p>
          <Link href="/" className="btn btn-outline mt-8">
            Strona główna
          </Link>
        </>
      ) : (
        <>
          <p className="eyebrow">Newsletter</p>
          <h1 className="heading mt-3 text-2xl sm:text-3xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-stone">{t.lead}</p>
          {status === 'error' && message && (
            <p role="alert" className="mx-auto mt-6 max-w-md border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
              {message}
            </p>
          )}
          <button type="button" onClick={run} disabled={status === 'sending'} className="btn btn-gold mt-8">
            {status === 'sending' ? 'Chwileczkę…' : t.button}
          </button>
        </>
      )}
    </div>
  );
}
