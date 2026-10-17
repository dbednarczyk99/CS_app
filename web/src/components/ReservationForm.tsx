'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaBreadSlice, FaCheck, FaLocationDot, FaTrash, FaTruck } from 'react-icons/fa6';
import type { PublicReservation, ReservationOptions } from '@/lib/api';
import { formatDay, formatPrice } from '@/lib/format';
import { useReservationCart } from '@/lib/reservation-cart';
import { QuantityStepper } from './AddToReservation';
import { DropdownSelect } from './DropdownSelect';

type ReservableProduct = { id: string; name: string; price: number; image?: string };

const EMPTY_CART_REDIRECT_S = 10;

/**
 * Pusty koszyk: po kilku sekundach przejście do oferty. Subtelny pasek odlicza czas
 * (bez animacji przy prefers-reduced-motion – wtedy zostaje sam tekst); „Zostań” anuluje.
 */
function RedirectCountdown({ href, seconds }: { href: string; seconds: number }) {
  const router = useRouter();
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (cancelled) return;
    const timer = setTimeout(() => router.push(href), seconds * 1000);
    return () => clearTimeout(timer);
  }, [cancelled, href, router, seconds]);

  if (cancelled) return null;
  return (
    <div className="mx-auto mt-10 max-w-xs" role="status">
      <p className="text-xs text-stone">
        Za chwilę przeniesiemy Cię do oferty.{' '}
        <button
          type="button"
          onClick={() => setCancelled(true)}
          className="text-cream/70 underline underline-offset-4 transition-colors hover:text-gold"
        >
          Zostań na tej stronie
        </button>
      </p>
      <div className="mt-3 h-px overflow-hidden bg-line motion-reduce:hidden">
        <div
          className="h-full origin-left animate-hero-progress bg-gold/70 [animation-direction:reverse]"
          style={{ animationDuration: `${seconds}s` }}
        />
      </div>
    </div>
  );
}
type PickupType = 'STORE' | 'VAN';

const field =
  'w-full border border-line bg-coal px-4 py-3 text-cream placeholder:text-stone/70 transition-colors focus:border-gold focus:outline-none';
const choice = (selected: boolean) =>
  `border px-4 py-3 text-left transition-colors ${
    selected
      ? 'border-gold bg-gold/10 text-cream'
      : 'border-line text-cream/85 hover:border-gold/60'
  }`;
const chip = (selected: boolean) =>
  `min-h-11 border px-3 py-2 font-display text-[0.8rem] tracking-wider transition-colors ${
    selected
      ? 'border-gold bg-gold text-ink'
      : 'border-line text-cream/85 hover:border-gold hover:text-gold'
  }`;

const shortStreet = (address: string) => address.split(/,\s*(?=\d{2}-\d{3})/)[0];

export function ReservationForm({
  options,
  reservable,
}: {
  options: ReservationOptions;
  reservable: ReservableProduct[];
}) {
  const cart = useReservationCart();
  const [removedNames, setRemovedNames] = useState<string[]>([]);
  const synced = useRef(false);

  // odświeżenie zapamiętanych produktów: aktualne ceny, usunięcie niedostępnych
  useEffect(() => {
    if (!cart.ready || synced.current) return;
    synced.current = true;
    const byId = new Map(reservable.map((p) => [p.id, p]));
    const removed = cart.items.filter((i) => !byId.has(i.productId)).map((i) => i.name);
    if (removed.length) setRemovedNames(removed);
    cart.replace(
      cart.items
        .filter((i) => byId.has(i.productId))
        .map((i) => {
          const p = byId.get(i.productId)!;
          return { ...i, name: p.name, price: p.price, image: p.image };
        }),
    );
  }, [cart, reservable]);

  const [pickupType, setPickupType] = useState<PickupType>('STORE');
  const [storeId, setStoreId] = useState<string | null>(
    options.stores.length === 1 ? options.stores[0].id : null,
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [vanKey, setVanKey] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // pułapka na boty

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicReservation | null>(null);

  const store = options.stores.find((s) => s.id === storeId) ?? null;
  const storeDates = store ? options.dates.filter((d) => store.slots[d]) : [];
  const slots = store && date ? (store.slots[date] ?? []) : [];
  const vanStop = options.vanStops.find((s) => `${s.id}|${s.date}` === vanKey) ?? null;

  const pickupSummary = useMemo(() => {
    if (pickupType === 'STORE' && store && date && time) {
      return {
        where: `Piekarnia: ${shortStreet(store.address)}`,
        when: `${formatDay(date)}, ${time}`,
      };
    }
    if (pickupType === 'VAN' && vanStop) {
      return {
        where: `Chlebowóz: ${vanStop.address}`,
        when: `${formatDay(vanStop.date)}, ${vanStop.startTime}–${vanStop.endTime}`,
      };
    }
    return null;
  }, [pickupType, store, date, time, vanStop]);

  const phoneDigits = phone.replace(/\D/g, '').replace(/^48(?=\d{9}$)/, '');
  const missing = [
    cart.items.length === 0 && 'produkty',
    !pickupSummary && 'termin odbioru',
    name.trim().length < 2 && 'imię',
    phoneDigits.length !== 9 && 'telefon (9 cyfr)',
    !/^\S+@\S+\.\S+$/.test(email) && 'e-mail',
    !consent && 'akceptacja regulaminu',
  ].filter(Boolean) as string[];

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (missing.length) {
      setError(`Uzupełnij: ${missing.join(', ')}.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/rezerwacje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupType,
          pointId: pickupType === 'STORE' ? storeId : vanStop!.id,
          pickupDate: pickupType === 'STORE' ? date : vanStop!.date,
          pickupTime: pickupType === 'STORE' ? time : undefined,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          notes: notes || undefined,
          consent,
          website: website || undefined,
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
        setError(message ?? 'Nie udało się złożyć rezerwacji. Spróbuj ponownie.');
        return;
      }
      setResult(body as PublicReservation);
      cart.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <ReservationSuccess reservation={result} />;

  if (cart.ready && cart.items.length === 0) {
    return (
      <div className="border border-line bg-coal p-8 text-center sm:p-12">
        {removedNames.length > 0 && (
          <p className="mb-6 text-sm text-stone">
            Usunęliśmy produkty niedostępne już do rezerwacji: {removedNames.join(', ')}.
          </p>
        )}
        <p className="heading text-2xl">Nie wybrano jeszcze żadnych produktów</p>
        <p className="mt-3 text-stone">Dodaj wypieki z oferty przyciskiem „Zarezerwuj”.</p>
        <Link href="/oferta" className="btn btn-gold mt-8">
          Przejdź do oferty
        </Link>
        <RedirectCountdown href="/oferta" seconds={EMPTY_CART_REDIRECT_S} />
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      <div className="space-y-14">
        {/* 1. PRODUKTY */}
        <Step number={1} title="Produkty">
          {removedNames.length > 0 && (
            <p className="mb-4 border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
              Usunęliśmy produkty niedostępne już do rezerwacji: {removedNames.join(', ')}.
            </p>
          )}
          <ul className="divide-y divide-line border-y border-line">
            {cart.items.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden bg-graphite">
                  {item.image && (
                    <Image src={item.image} alt="" fill sizes="4rem" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display uppercase tracking-wide">{item.name}</p>
                  <p className="text-sm text-stone">{formatPrice(item.price)} / szt.</p>
                </div>
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => cart.setQuantity(item, q)}
                  label={item.name}
                />
                <button
                  type="button"
                  onClick={() => cart.setQuantity(item, 0)}
                  aria-label={`Usuń ${item.name}`}
                  className="grid size-10 place-items-center text-stone transition-colors hover:text-gold"
                >
                  <FaTrash size={14} />
                </button>
              </li>
            ))}
          </ul>
          <Link href="/oferta" className="link-arrow mt-4 inline-block text-[0.75rem]">
            + Dodaj kolejne produkty
          </Link>
        </Step>

        {/* 2. ODBIÓR */}
        <Step number={2} title="Odbiór">
          <p className="mb-5 text-sm text-stone">
            Rezerwacje przyjmujemy do {options.cutoffHour}:00 dnia poprzedzającego odbiór,
            maksymalnie 5 dni do przodu.
          </p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Miejsce odbioru">
            {(
              [
                ['STORE', 'Piekarnia', <FaBreadSlice key="s" aria-hidden />],
                ['VAN', 'Chlebowóz', <FaTruck key="v" aria-hidden />],
              ] as const
            ).map(([value, label, icon]) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={pickupType === value}
                onClick={() => setPickupType(value)}
                className={`${chip(pickupType === value)} inline-flex items-center justify-center gap-2 uppercase`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {pickupType === 'STORE' ? (
            <div className="mt-6 space-y-6">
              <Fieldset legend="Piekarnia">
                {/* rozwijana lista – wygodna także przy większej liczbie piekarni */}
                <DropdownSelect
                  id="pickup-store"
                  label="Piekarnia"
                  placeholder="Wybierz piekarnię"
                  icon={<FaLocationDot size={13} aria-hidden className="shrink-0 text-gold" />}
                  options={options.stores.map((s) => ({
                    value: s.id,
                    label: shortStreet(s.address),
                    detail: s.address.split(/,\s*/).slice(1).join(', '),
                  }))}
                  value={storeId}
                  onChange={(id) => {
                    const s = options.stores.find((x) => x.id === id);
                    setStoreId(id);
                    if (date && !s?.slots[date]) setDate(null);
                    setTime(null);
                  }}
                  className="max-w-md"
                  buttonClassName={field}
                />
              </Fieldset>

              {store && (
                <Fieldset legend="Dzień odbioru">
                  <div className="flex flex-wrap gap-2">
                    {storeDates.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDate(d);
                          setTime(null);
                        }}
                        className={chip(date === d)}
                        aria-pressed={date === d}
                      >
                        {formatDay(d, 'short')}
                      </button>
                    ))}
                  </div>
                </Fieldset>
              )}

              {store && date && (
                <Fieldset legend="Godzina odbioru">
                  <PickupTimeSelect
                    slots={slots}
                    hours={store.hours?.[date]}
                    value={time}
                    onChange={setTime}
                  />
                </Fieldset>
              )}
            </div>
          ) : (
            <div className="mt-6">
              {options.vanStops.length === 0 ? (
                <p className="text-stone">
                  W najbliższych dniach chlebowóz nie ma postojów dostępnych do rezerwacji.
                </p>
              ) : (
                <Fieldset legend="Przystanek i termin">
                  <div className="grid gap-2">
                    {options.vanStops.map((s) => {
                      const key = `${s.id}|${s.date}`;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setVanKey(key)}
                          className={`${choice(vanKey === key)} grid gap-1 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-4`}
                          aria-pressed={vanKey === key}
                        >
                          <span className="font-display uppercase tracking-wide first-letter:uppercase">
                            {formatDay(s.date, 'short')}
                          </span>
                          <span>{s.address}</span>
                          <span className="font-display tabular-nums text-gold">
                            {s.startTime}–{s.endTime}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Fieldset>
              )}
            </div>
          )}
        </Step>

        {/* 3. DANE */}
        <Step number={3} title="Twoje dane">
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text="Imię" htmlFor="name">
              <input
                id="name"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
                maxLength={50}
                placeholder="Zawołamy Cię przy odbiorze"
                required
              />
            </Label>
            <Label text="Telefon" htmlFor="phone">
              <input
                id="phone"
                className={field}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="np. 600 700 800"
                required
              />
            </Label>
            <Label text="E-mail – wyślemy na niego potwierdzenie" htmlFor="email" wide>
              <input
                id="email"
                type="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Label>
            <Label text="Uwagi (opcjonalnie)" htmlFor="notes" wide>
              <textarea
                id="notes"
                className={`${field} resize-none`}
                rows={3}
                maxLength={500}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="np. prośba o pokrojenie chleba"
              />
            </Label>
          </div>

          {/* pułapka na boty – niewidoczna dla ludzi */}
          <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Strona www</label>
            <input
              id="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-gold"
            />
            <span>
              Akceptuję{' '}
              <a
                href="/regulamin"
                target="_blank"
                className="text-gold underline-offset-2 hover:underline"
              >
                regulamin rezerwacji
              </a>{' '}
              i zapoznałem/-am się z{' '}
              <a
                href="/polityka-prywatnosci"
                target="_blank"
                className="text-gold underline-offset-2 hover:underline"
              >
                polityką prywatności
              </a>
              .
            </span>
          </label>
        </Step>
      </div>

      {/* PODSUMOWANIE */}
      <aside className="lg:sticky lg:top-[calc(7rem+var(--banner-h))] lg:self-start">
        <div className="border border-line bg-coal p-6">
          <h2 className="heading text-xl">Podsumowanie</h2>
          <ul className="mt-5 space-y-2 text-sm">
            {cart.items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-4">
                <span className="text-cream/90">
                  {i.name} <span className="text-stone">× {i.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-stone">Do zapłaty przy odbiorze</span>
            <span className="font-display text-2xl text-gold">{formatPrice(cart.total)}</span>
          </div>

          <div className="mt-5 border-t border-line pt-4 text-sm">
            <p className="eyebrow text-[0.65rem]">Odbiór</p>
            {pickupSummary ? (
              <>
                <p className="mt-2 first-letter:uppercase">{pickupSummary.when}</p>
                <p className="text-stone">{pickupSummary.where}</p>
              </>
            ) : (
              <p className="mt-2 text-stone">Wybierz miejsce i termin</p>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-gold mt-6 w-full disabled:opacity-60"
          >
            {submitting ? 'Wysyłanie…' : 'Zarezerwuj'}
          </button>
          <p className="mt-3 text-center text-xs text-stone">
            Płatność gotówką lub kartą przy odbiorze.
          </p>
        </div>
      </aside>
    </form>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`krok-${number}`} className="relative">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="font-display text-sm tracking-[0.3em] text-gold">0{number}</span>
        <h2 id={`krok-${number}`} className="heading text-2xl sm:text-3xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** Godzina odbioru: tylko terminy z API (co 30 min, ostatni 30 min przed zamknięciem) + godziny otwarcia */
function PickupTimeSelect({
  slots,
  hours,
  value,
  onChange,
}: {
  slots: string[];
  hours?: { open: string; close: string };
  value: string | null;
  onChange: (time: string) => void;
}) {
  if (slots.length === 0) return <p className="text-stone">Brak wolnych terminów odbioru w tym dniu.</p>;
  return (
    <div>
      <DropdownSelect
        id="pickup-time"
        label="Godzina odbioru"
        placeholder="Wybierz godzinę"
        options={slots.map((t) => ({ value: t, label: t }))}
        value={value}
        onChange={onChange}
        describedBy="pickup-time-hint"
        className="max-w-60"
        buttonClassName={field}
      />
      {hours && (
        <p id="pickup-time-hint" className="mt-2 text-sm text-stone">
          Odbiór między {hours.open} a {hours.close}
        </p>
      )}
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function Label({
  text,
  htmlFor,
  wide,
  children,
}: {
  text: string;
  htmlFor: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone"
      >
        {text}
      </label>
      {children}
    </div>
  );
}

function ReservationSuccess({ reservation: r }: { reservation: PublicReservation }) {
  return (
    <div className="mx-auto max-w-2xl border border-line bg-coal p-8 text-center sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
        <FaCheck size={24} />
      </span>
      <h2 className="heading mt-6 text-3xl">Rezerwacja przyjęta</h2>
      <p className="mt-3 text-stone">
        Dziękujemy, {r.customerName.split(' ')[0]}! Potwierdzenie wysłaliśmy na{' '}
        <strong className="text-cream">{r.customerEmail}</strong>.
      </p>
      <p className="mt-8 text-sm text-stone">Numer rezerwacji</p>
      <p className="font-display text-3xl tracking-[0.2em] text-gold">{r.number}</p>

      <div className="mt-8 border-y border-line py-6 text-left">
        <p className="eyebrow text-[0.65rem]">Odbiór</p>
        <p className="mt-2 text-lg first-letter:uppercase">
          {formatDay(r.pickupDate)}
          {r.pickupTime ? `, ${r.pickupTime}` : ''}
        </p>
        <p className="text-stone">
          {r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: {r.pickupLabel}
        </p>
        <ul className="mt-5 space-y-1 text-sm">
          {r.items.map((i) => (
            <li key={i.productName} className="flex justify-between gap-4">
              <span>
                {i.productName} <span className="text-stone">× {i.quantity}</span>
              </span>
              <span className="tabular-nums">{formatPrice(Number(i.unitPrice) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-3">
          <span className="text-stone">Do zapłaty przy odbiorze</span>
          <span className="font-display text-xl text-gold">{formatPrice(Number(r.total))}</span>
        </p>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-stone">
        Rezerwację możesz anulować do {formatDay(r.cancelDeadline.date)}, {r.cancelDeadline.hour} –
        link znajdziesz w e-mailu.
      </p>
      <Link href="/" className="btn btn-outline mt-8">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
