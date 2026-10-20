'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa6';
import type { PublicReservation, ReservationOptions } from '@/lib/api';
import type { ReservationFormTexts } from '@/lib/content';
import { formatDay, formatDayMonth, formatPrice, plural } from '@/lib/format';
import { inPromoWindow, priceOn, type PromoWindow } from '@/lib/products';
import { useReservationCart } from '@/lib/reservation-cart';
import { fill, ruleTokens } from '@/lib/text';
import { QuantityStepper } from './AddToReservation';
import { DropdownSelect } from './DropdownSelect';
import { PickupPointPicker, type PickupPoint } from './PickupPointPicker';

// price – cena regularna; promo – promocja obniżająca cenę (płaci się cenę z dnia odbioru)
type ReservableProduct = { id: string; name: string; price: number; promo?: PromoWindow | null; image?: string };

/**
 * Uwaga o promocji przy produkcie, gdy cena zależy od dnia odbioru (promocja nie obejmuje wszystkich
 * dostępnych dni). `date` – wybrany dzień odbioru (null – jeszcze nie wybrany).
 */
function promoNote(promo: PromoWindow | null | undefined, days: string[], date: string | null) {
  if (!promo || days.every((d) => inPromoWindow(promo, d)) || !days.some((d) => inPromoWindow(promo, d)))
    return null;
  const startsLater = promo.from !== null && days.some((d) => d < promo.from!);
  const endsEarlier = promo.to !== null && days.some((d) => d > promo.to!);
  const range = [
    startsLater && `od ${formatDayMonth(promo.from!)}`,
    endsEarlier && `do ${formatDayMonth(promo.to!)}`,
  ]
    .filter(Boolean)
    .join(' ');
  // warn – wybrany dzień odbioru jest poza promocją (zapłaci cenę regularną)
  return { warn: date !== null && !inPromoWindow(promo, date), range, promoPrice: formatPrice(promo.price) };
}

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
type DayPoint = PickupPoint & { id: string; slots: string[] };

/** Punkty odbioru czynne danego dnia: piekarnie i postoje chlebowozu */
function pointsOn(options: ReservationOptions, date: string): DayPoint[] {
  return [
    ...options.stores
      .filter((s) => s.slots[date])
      .map((s) => ({
        key: `STORE:${s.id}`,
        id: s.id,
        kind: 'STORE' as const,
        address: s.address,
        hours: s.hours[date] ? `${s.hours[date].open}–${s.hours[date].close}` : '',
        lat: s.lat,
        lng: s.lng,
        slots: s.slots[date],
      })),
    ...options.vanStops
      .filter((v) => v.date === date)
      .map((v) => ({
        key: `VAN:${v.id}`,
        id: v.id,
        kind: 'VAN' as const,
        address: v.address,
        hours: `${v.startTime}–${v.endTime}`,
        lat: v.lat,
        lng: v.lng,
        slots: v.slots,
      })),
  ];
}

/** Kafelek dnia na telefonie: „pon” nad „19.10” */
const weekdayShort = (date: string) =>
  new Intl.DateTimeFormat('pl-PL', { weekday: 'short', timeZone: 'UTC' })
    .format(new Date(`${date}T12:00:00Z`))
    .replace('.', '');
const dayMonth = (date: string) => `${date.slice(8, 10)}.${date.slice(5, 7)}`;

/** „Poniedziałek, 19 października: 4 piekarnie i 1 postój chlebowozu” */
function dayHeading(date: string, points: DayPoint[]) {
  const stores = points.filter((p) => p.kind === 'STORE').length;
  const stops = points.length - stores;
  const parts = [
    stores > 0 && `${stores} ${plural(stores, ['piekarnia', 'piekarnie', 'piekarni'])}`,
    stops > 0 && `${stops} ${plural(stops, ['postój', 'postoje', 'postojów'])} chlebowozu`,
  ].filter(Boolean);
  return `${formatDay(date)}: ${parts.join(' i ')}`;
}

// ostatni punkt odbioru – zapamiętany w przeglądarce klienta, zaznaczany przy kolejnej rezerwacji
const LAST_POINT_KEY = 'chlebasmak-punkt-odbioru';
function readRememberedPoint() {
  try {
    return localStorage.getItem(LAST_POINT_KEY);
  } catch {
    return null;
  }
}
function rememberPoint(key: string) {
  try {
    localStorage.setItem(LAST_POINT_KEY, key);
  } catch {
    // brak dostępu do pamięci przeglądarki – bez zapamiętywania
  }
}

const field =
  'w-full border border-line bg-coal px-4 py-3 text-cream placeholder:text-stone/70 transition-colors focus:border-gold focus:outline-none';
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
  texts,
}: {
  options: ReservationOptions;
  reservable: ReservableProduct[];
  /** teksty z panelu (Strona → Podstrony → Rezerwacja → Formularz rezerwacji) */
  texts: ReservationFormTexts;
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

  // odbiór: najpierw dzień, potem punkt (piekarnia lub postój chlebowozu), na końcu szacowana godzina
  const [date, setDate] = useState<string | null>(null);
  const [pointKey, setPointKey] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [pointNotice, setPointNotice] = useState<string | null>(null);
  const [rememberedKey, setRememberedKey] = useState<string | null>(null);
  useEffect(() => setRememberedKey(readRememberedPoint()), []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [consent, setConsent] = useState(false);
  // nieobowiązkowy zapis do newslettera na adres z rezerwacji (z potwierdzeniem linkiem z e-maila)
  const [newsletter, setNewsletter] = useState(false);
  const [website, setWebsite] = useState(''); // pułapka na boty

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicReservation | null>(null);

  const days = useMemo(() => options.dates.filter((d) => pointsOn(options, d).length > 0), [options]);
  const points = useMemo(() => (date ? pointsOn(options, date) : []), [options, date]);
  const point = points.find((p) => p.key === pointKey) ?? null;

  // ceny na dzień odbioru (tak liczy je API): przed wyborem dnia – na najbliższy dostępny dzień
  const productById = useMemo(() => new Map(reservable.map((p) => [p.id, p])), [reservable]);
  const priceDate = date ?? days[0] ?? null;
  const lines = cart.items.map((item) => {
    const product = productById.get(item.productId);
    const regular = product?.price ?? item.price;
    const unit = priceDate ? priceOn({ price: regular, promo: product?.promo }, priceDate) : item.price;
    return { ...item, regular, unit, note: promoNote(product?.promo, days, date) };
  });
  const total = lines.reduce((sum, l) => sum + l.unit * l.quantity, 0);
  // produkty, których promocja nie obejmuje wybranego dnia odbioru
  const outsidePromo = lines.filter((l) => l.note?.warn);

  function pickDate(d: string) {
    setDate(d);
    const next = pointsOn(options, d);
    const current = pointKey ? (next.find((p) => p.key === pointKey) ?? null) : null;
    if (pointKey && !current) {
      // wybrany punkt nie działa w nowym dniu – informacja zamiast cichego odznaczenia
      const previous = point ?? pointsOn(options, date!).find((p) => p.key === pointKey);
      setPointNotice(
        `${previous ? `${shortStreet(previous.address)}: ` : ''}${
          previous?.kind === 'VAN' ? 'w tym dniu chlebowóz tu nie stoi' : 'w tym dniu piekarnia jest nieczynna'
        }. Wybierz inny punkt odbioru.`,
      );
      setPointKey(null);
      setTime(null);
    } else if (!pointKey && rememberedKey && next.some((p) => p.key === rememberedKey)) {
      // stały klient: ostatni punkt odbioru od razu zaznaczony, jeśli działa tego dnia
      setPointKey(rememberedKey);
      setPointNotice(null);
    } else {
      setPointNotice(null);
      if (current && time && !current.slots.includes(time)) setTime(null);
    }
  }

  function pickPoint(key: string) {
    const next = points.find((p) => p.key === key);
    setPointKey(key);
    setPointNotice(null);
    if (time && !next?.slots.includes(time)) setTime(null);
  }

  const pickupSummary =
    point && date && time
      ? {
          where: `${point.kind === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: ${shortStreet(point.address)}`,
          when: `${formatDay(date)}, ${time}`,
        }
      : null;

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
          pickupType: point!.kind,
          pointId: point!.id,
          pickupDate: date,
          pickupTime: time,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          notes: notes || undefined,
          consent,
          newsletter,
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
      rememberPoint(point!.key);
      cart.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <ReservationSuccess reservation={result} title={texts.successTitle} newsletter={newsletter} />;

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
        <Step number={1} title={texts.stepProducts}>
          {removedNames.length > 0 && (
            <p className="mb-4 border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
              Usunęliśmy produkty niedostępne już do rezerwacji: {removedNames.join(', ')}.
            </p>
          )}
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((item) => (
              <li key={item.productId} className="flex items-center gap-4 py-4">
                <div className="relative size-16 shrink-0 overflow-hidden bg-graphite">
                  {item.image && (
                    <Image src={item.image} alt="" fill sizes="4rem" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display uppercase tracking-wide">{item.name}</p>
                  <p className="text-sm text-stone">
                    {item.unit < item.regular && (
                      <>
                        <s>
                          <span className="sr-only">Cena regularna: </span>
                          {formatPrice(item.regular)}
                        </s>{' '}
                        <span className="text-gold">{formatPrice(item.unit)}</span>
                      </>
                    )}
                    {item.unit >= item.regular && formatPrice(item.unit)} / szt.
                  </p>
                  {item.note && (
                    <p className={`mt-0.5 text-xs ${item.note.warn ? 'text-gold' : 'text-stone'}`}>
                      {item.note.warn
                        ? `Promocja (${item.note.promoPrice}) tylko przy odbiorze ${item.note.range} – w wybranym dniu cena regularna.`
                        : `Cena promocyjna przy odbiorze ${item.note.range}.`}
                    </p>
                  )}
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
            {texts.addMore}
          </Link>
        </Step>

        {/* 2. ODBIÓR */}
        <Step number={2} title={texts.stepPickup}>
          {texts.rulesNote && (
            <p className="mb-5 text-sm text-stone">{fill(texts.rulesNote, ruleTokens(options.rules))}</p>
          )}
          {days.length === 0 ? (
            <p className="text-stone">{fill(texts.noDates, ruleTokens(options.rules))}</p>
          ) : (
            <div className="space-y-8">
              <Fieldset legend="Dzień odbioru" required>
                {/* telefon: jeden rząd kafelków (dzień tygodnia nad datą – najwyżej 5 dni); od tabletu – przyciski w linii */}
                <div
                  className="grid gap-1.5 sm:flex sm:flex-wrap sm:gap-2"
                  style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
                >
                  {days.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => pickDate(d)}
                      className={`${chip(date === d)} flex flex-col items-center max-sm:px-1 max-sm:py-1.5 sm:block`}
                      aria-pressed={date === d}
                      aria-label={formatDay(d)}
                    >
                      <span className="text-[0.7rem] uppercase sm:hidden">{weekdayShort(d)}</span>
                      <span className="text-[0.9rem] tabular-nums sm:hidden">{dayMonth(d)}</span>
                      <span className="hidden sm:inline">{formatDay(d, 'short')}</span>
                    </button>
                  ))}
                </div>
                {outsidePromo.length > 0 && (
                  <div role="status" className="mt-4 border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed">
                    <p>Cenę liczymy z dnia odbioru – w wybranym dniu promocja nie obowiązuje:</p>
                    <ul className="mt-2 space-y-1">
                      {outsidePromo.map((l) => (
                        <li key={l.productId}>
                          <span className="font-semibold">{l.name}</span> – zapłacisz {formatPrice(l.regular)} / szt.
                          zamiast {l.note!.promoPrice} (promocja przy odbiorze {l.note!.range}).
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Fieldset>

              {date && (
                <Fieldset legend="Punkt odbioru" required>
                  {pointNotice && (
                    <p role="status" className="mb-3 border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
                      {pointNotice}
                    </p>
                  )}
                  <PickupPointPicker
                    points={points}
                    value={pointKey}
                    onChange={pickPoint}
                    rememberedKey={rememberedKey}
                    heading={dayHeading(date, points)}
                  />
                </Fieldset>
              )}

              {date && point && (
                <Fieldset legend="Godzina odbioru" required>
                  <PickupTimeSelect
                    slots={point.slots}
                    hint={
                      point.kind === 'VAN'
                        ? `Podaj szacowaną godzinę odbioru – chlebowóz stoi w godzinach ${point.hours}.`
                        : `Podaj szacowaną godzinę odbioru – piekarnia jest czynna w godzinach ${point.hours}.`
                    }
                    value={time}
                    onChange={setTime}
                  />
                </Fieldset>
              )}
            </div>
          )}
        </Step>

        {/* 3. DANE */}
        <Step number={3} title={texts.stepDetails}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text="Imię" htmlFor="name" required>
              <input
                id="name"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
                maxLength={50}
                placeholder={texts.namePlaceholder}
                required
              />
            </Label>
            <Label text="Telefon" htmlFor="phone" required>
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
            <Label text={texts.emailLabel} htmlFor="email" wide required>
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
              .<Required />
            </span>
          </label>

          <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-stone">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-1 size-4 shrink-0 accent-gold"
            />
            <span>
              {/* ta sama treść zgody co w okienku zapisu do newslettera */}
              Chcę otrzymywać newsletter Chleba Smak na podany adres e-mail. Zgodę mogę wycofać w każdej chwili – link
              do wypisania jest w każdej wiadomości. Więcej w{' '}
              <a href="/polityka-prywatnosci" target="_blank" className="text-gold underline-offset-2 hover:underline">
                polityce prywatności
              </a>
              .
            </span>
          </label>

          <p className="mt-4 text-xs text-stone">
            <span className="text-gold">*</span> – pole obowiązkowe
          </p>
        </Step>
      </div>

      {/* PODSUMOWANIE */}
      <aside className="lg:sticky lg:top-[calc(7rem+var(--banner-h))] lg:self-start">
        <div className="border border-line bg-coal p-6">
          <h2 className="heading text-xl">{texts.summaryTitle}</h2>
          <ul className="mt-5 space-y-2 text-sm">
            {lines.map((i) => (
              <li key={i.productId} className="flex justify-between gap-4">
                <span className="text-cream/90">
                  {i.name} <span className="text-stone">× {i.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(i.unit * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-stone">Do zapłaty przy odbiorze</span>
            <span className="font-display text-2xl text-gold">{formatPrice(total)}</span>
          </div>
          {!date && lines.some((l) => l.note) && (
            <p className="mt-2 text-xs text-stone">Kwota może się zmienić po wyborze dnia odbioru (promocje).</p>
          )}

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
            {submitting ? 'Wysyłanie…' : texts.submit}
          </button>
          {texts.paymentNote && <p className="mt-3 text-center text-xs text-stone">{texts.paymentNote}</p>}
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

/**
 * Szacowana godzina odbioru: tylko terminy z API (piekarnia co 30 min, ostatni 30 min przed zamknięciem;
 * chlebowóz tak samo w czasie postoju) + podpowiedź z godzinami punktu
 */
function PickupTimeSelect({
  slots,
  hint,
  value,
  onChange,
}: {
  slots: string[];
  hint: string;
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
      <p id="pickup-time-hint" className="mt-2 text-sm text-stone">
        {hint}
      </p>
    </div>
  );
}

/** Gwiazdka pola obowiązkowego (objaśnienie pod zgodami) */
function Required() {
  return (
    <span aria-hidden className="ml-0.5 text-gold">
      *
    </span>
  );
}

function Fieldset({ legend, children, required }: { legend: string; children: React.ReactNode; required?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone">
        {legend}
        {required && <Required />}
      </legend>
      {children}
    </fieldset>
  );
}

function Label({
  text,
  htmlFor,
  wide,
  required,
  children,
}: {
  text: string;
  htmlFor: string;
  wide?: boolean;
  /** pole obowiązkowe – gwiazdka */
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block font-display text-[0.7rem] uppercase tracking-[0.25em] text-stone"
      >
        {text}
        {required && <Required />}
      </label>
      {children}
    </div>
  );
}

function ReservationSuccess({
  reservation: r,
  title,
  newsletter,
}: {
  reservation: PublicReservation;
  title: string;
  /** zaznaczono zapis do newslettera – przypomnienie o potwierdzeniu */
  newsletter: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl border border-line bg-coal p-8 text-center sm:p-12">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-ink">
        <FaCheck size={24} />
      </span>
      <h2 className="heading mt-6 text-3xl">{title}</h2>
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

      {newsletter && (
        <p className="mt-6 border border-gold/40 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-cream/90">
          Zapis do newslettera: wysłaliśmy osobny e-mail z linkiem potwierdzającym – kliknij go, a zaczniemy wysyłać
          wiadomości. Bez potwierdzenia nie wyślemy nic więcej.
        </p>
      )}
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
