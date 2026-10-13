import {
  api,
  type BreadVanStop,
  type Category,
  type ContactInfo,
  type Location,
  type Media,
  type OpeningHours,
  type Weekday,
} from '@/lib/api';

const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'MONDAY', label: 'Poniedziałek' },
  { key: 'TUESDAY', label: 'Wtorek' },
  { key: 'WEDNESDAY', label: 'Środa' },
  { key: 'THURSDAY', label: 'Czwartek' },
  { key: 'FRIDAY', label: 'Piątek' },
  { key: 'SATURDAY', label: 'Sobota' },
  { key: 'SUNDAY', label: 'Niedziela' },
];

const price = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

function hoursFor(hours: OpeningHours | null, day: Weekday): string {
  const value = hours?.[day.toLowerCase()] ?? hours?.[day];
  if (!value) return 'nieczynne';
  return typeof value === 'string' ? value : `${value.openFrom}–${value.openTo}`;
}

// Strona ma się wyświetlić nawet wtedy, gdy część API nie odpowiada
async function settled<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

export default async function HomePage() {
  const [categories, locations, vanStops, contact, media] = await Promise.all([
    settled<Category[]>(api.categories(), []),
    settled<Location[]>(api.locations(), []),
    settled<BreadVanStop[]>(api.breadVanStops(), []),
    settled<ContactInfo[]>(api.contactInfo(), []),
    settled<Media[]>(api.media(), []),
  ]);

  return (
    <>
      <section className="bg-wheat/60">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-crust sm:text-5xl">
            Chleb na zakwasie, wypiekany codziennie od świtu
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/80">
            Odwiedź jeden z naszych sklepów albo złap bus z pieczywem na swojej
            ulicy.
          </p>
        </div>
      </section>

      <Section id="oferta" title="Oferta">
        {categories.length === 0 && <Empty />}
        <div className="space-y-12">
          {categories.map((category) => {
            const products = category.products.filter((p) => p.isActive);
            if (products.length === 0) return null;
            return (
              <div key={category.id}>
                <h3 className="mb-4 font-serif text-xl font-semibold">
                  {category.name}
                </h3>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="flex flex-col rounded-xl border border-crust/15 bg-white p-5"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-semibold">{product.name}</h4>
                        <span className="whitespace-nowrap font-semibold text-crust">
                          {price.format(product.price)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-ink/70">
                        {product.description}
                      </p>
                      {product.isSeasonal && (
                        <span className="mt-3 self-start rounded-full bg-wheat px-2.5 py-0.5 text-xs font-medium">
                          sezonowy
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="sklepy" title="Nasze sklepy">
        {locations.length === 0 && <Empty />}
        <ul className="grid gap-4 md:grid-cols-3">
          {locations.map((location) => (
            <li
              key={location.id}
              className="rounded-xl border border-crust/15 bg-white p-5"
            >
              <h3 className="font-serif text-lg font-semibold">
                {location.name ?? location.address}
              </h3>
              <a
                href={location.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-sm text-crust underline-offset-2 hover:underline"
              >
                {location.address}
              </a>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {WEEKDAYS.map((day) => (
                  <div key={day.key} className="contents">
                    <dt className="text-ink/60">{day.label}</dt>
                    <dd className="tabular-nums">
                      {hoursFor(location.openingHours, day.key)}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="bus" title="Bus z pieczywem">
        {vanStops.length === 0 && <Empty />}
        <ul className="divide-y divide-crust/10 rounded-xl border border-crust/15 bg-white">
          {WEEKDAYS.flatMap((day) =>
            vanStops
              .filter((stop) => stop.dayOfTheWeek === day.key)
              .map((stop) => (
                <li
                  key={stop.id}
                  className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-3"
                >
                  <span className="w-32 font-semibold">{day.label}</span>
                  <span className="w-28 tabular-nums text-ink/70">
                    {stop.startTime}–{stop.endTime}
                  </span>
                  <a
                    href={stop.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-crust underline-offset-2 hover:underline"
                  >
                    {stop.address}
                  </a>
                </li>
              )),
          )}
        </ul>
      </Section>

      <Section id="kontakt" title="Kontakt">
        {contact.length === 0 && media.length === 0 && <Empty />}
        <ul className="space-y-1">
          {contact.map((item) => (
            <li key={item.id}>
              {item.label && <span className="text-ink/60">{item.label}: </span>}
              {item.type === 'EMAIL' ? (
                <a href={`mailto:${item.value}`} className="text-crust hover:underline">
                  {item.value}
                </a>
              ) : item.type === 'PHONE' ? (
                <a href={`tel:${item.value.replace(/\s/g, '')}`} className="text-crust hover:underline">
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </li>
          ))}
        </ul>
        {media.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-3">
            {media.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-crust/30 px-3 py-1 text-sm capitalize hover:bg-wheat"
                >
                  {item.name.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto mt-16 max-w-6xl px-4">
      <h2 className="mb-6 font-serif text-3xl font-semibold text-crust">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty() {
  return (
    <p className="text-ink/60">
      Brak danych – sprawdź, czy backend działa (http://localhost:3000).
    </p>
  );
}
