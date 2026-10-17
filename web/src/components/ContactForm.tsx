'use client';

import Link from 'next/link';
import { useState } from 'react';

const fieldClass =
  'peer w-full border-0 border-b border-cream/30 bg-transparent px-0 pb-2 pt-6 text-cream placeholder-transparent transition-colors focus:border-gold focus:outline-none focus:ring-0';
const labelClass =
  'pointer-events-none absolute left-0 top-1 font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:font-sans peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-1 peer-focus:font-display peer-focus:text-[0.7rem] peer-focus:uppercase peer-focus:tracking-[0.25em] peer-focus:text-gold';

function Field({
  name,
  label,
  type = 'text',
  required,
  multiline,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="relative">
      {multiline ? (
        <textarea id={name} name={name} placeholder={label} required={required} rows={5} className={`${fieldClass} resize-none`} />
      ) : (
        <input id={name} name={name} type={type} placeholder={label} required={required} className={fieldClass} />
      )}
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
    </div>
  );
}

/** Formularz kontaktowy – wysyłka przez /api/kontakt (API wysyła e-mail do piekarni) */
export function ContactForm({ email }: { email?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject || undefined,
          message: data.message,
          website: data.website || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
        setError(message ?? 'Nie udało się wysłać wiadomości. Spróbuj ponownie.');
        setStatus('idle');
        return;
      }
      form.reset();
      setStatus('sent');
    } catch {
      setError('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
      setStatus('idle');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="border-l-2 border-gold py-2 pl-6">
        <p className="heading text-xl">Dziękujemy za wiadomość</p>
        <p className="mt-3 leading-relaxed text-stone">
          Odpowiemy na podany adres e-mail najszybciej, jak to możliwe.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="link-arrow mt-6">
          Napisz kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Imię" required />
        <Field name="email" label="Adres e-mail" type="email" required />
      </div>
      <Field name="subject" label="Temat" />
      <Field name="message" label="Wiadomość" required multiline />

      {/* pułapka na boty – niewidoczna dla ludzi */}
      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Strona www</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-xs leading-relaxed text-stone">
        Dane z formularza wykorzystamy tylko do odpowiedzi na wiadomość. Więcej w{' '}
        <Link href="/polityka-prywatnosci" className="text-cream underline-offset-4 hover:text-gold hover:underline">
          polityce prywatności
        </Link>
        .
      </p>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" className="btn btn-gold" disabled={status === 'sending'}>
          {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
        </button>
        {error && (
          <p role="alert" className="basis-full border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {error}
            {email && (
              <>
                {' '}
                Możesz też napisać na{' '}
                <a href={`mailto:${email}`} className="text-gold underline-offset-4 hover:underline">
                  {email}
                </a>
                .
              </>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
