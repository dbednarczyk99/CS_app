'use client';

import { useState } from 'react';

const fieldClass =
  'w-full border-0 border-b-[3px] border-white bg-panel p-2 text-white placeholder:text-white focus:bg-panel-strong focus:outline-none';

// TODO: wysyłka wiadomości – API nie ma jeszcze endpointu kontaktowego
export function ContactForm({ email }: { email?: string }) {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="space-y-2"
    >
      <h3 className="text-2xl">Formularz kontaktowy</h3>
      <p className="pb-2 text-sm leading-relaxed">
        Wpadłeś na pomysł przepisu na nowy bochenek chleba? Chcesz zgłosić propozycję zmian
        w naszych lokalach? Jesteś zainteresowany współpracą z nami? Napisz do nas, korzystając
        z poniższego formularza kontaktowego.
      </p>
      <input className={fieldClass} type="text" name="name" placeholder="Twoje imię" required />
      <input className={fieldClass} type="email" name="email" placeholder="Twój adres email" required />
      <input className={fieldClass} type="text" name="subject" placeholder="Temat wiadomości" />
      <textarea className={fieldClass} name="message" placeholder="Treść wiadomości" rows={5} required />
      <div className="flex flex-wrap items-center justify-end gap-4 pt-2">
        {sent && (
          <p className="text-sm text-soft" role="status">
            Formularz jeszcze nie wysyła wiadomości
            {email ? (
              <>
                {' '}
                – napisz do nas na{' '}
                <a href={`mailto:${email}`} className="underline">
                  {email}
                </a>
              </>
            ) : null}
            .
          </p>
        )}
        <button
          type="submit"
          className="w-1/2 bg-graphite px-4 py-2 transition-colors hover:bg-graphite-darker"
        >
          Wyślij
        </button>
      </div>
    </form>
  );
}
