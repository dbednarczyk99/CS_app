'use client';

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

// TODO: wysyłka wiadomości – API nie ma jeszcze endpointu kontaktowego
export function ContactForm({ email }: { email?: string }) {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Imię" required />
        <Field name="email" label="Adres e-mail" type="email" required />
      </div>
      <Field name="subject" label="Temat" />
      <Field name="message" label="Wiadomość" required multiline />
      <div className="flex flex-wrap items-center gap-6 pt-2">
        <button type="submit" className="btn btn-gold">
          Wyślij wiadomość
        </button>
        {sent && (
          <p className="text-sm text-stone" role="status">
            Formularz jeszcze nie wysyła wiadomości
            {email ? (
              <>
                {' '}
                – napisz do nas na{' '}
                <a href={`mailto:${email}`} className="text-gold underline-offset-4 hover:underline">
                  {email}
                </a>
              </>
            ) : null}
            .
          </p>
        )}
      </div>
    </form>
  );
}
