import type { Article, Location, Media, Product } from './api';
import { WEEKDAYS, hoursFor } from './format';
import { isOnPromo, isOutOfSeason, isAvailable, priceOf } from './products';
import { SITE_NAME, SITE_URL, absoluteUrl, articlePath, productPath } from './site';

/**
 * Dane strukturalne dla Google (schema.org, JSON-LD) – niewidoczny opis strony: firma, piekarnie z adresem
 * i godzinami, produkty z ceną, wpisy, okruszki. Celowo BEZ ocen z Google (aggregateRating): Google traktuje
 * oceny firmy umieszczone na jej własnej stronie jako niedozwolone „autoreklamujące” opinie.
 */

const ORGANIZATION_ID = `${SITE_URL}/#firma`;
const LOGO = absoluteUrl('/images/logo-poziome-biale.png');

const DAY_NAMES: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

/** Firma: nazwa, logo, profile w mediach społecznościowych */
export const organizationLd = (media: Media[]) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  alternateName: 'Piekarnia Rzemieślnicza Chleba Smak',
  url: SITE_URL,
  logo: LOGO,
  sameAs: media.map((m) => m.url),
});

/** Strona jako całość (nazwa w wynikach wyszukiwania) */
export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'pl-PL',
  publisher: { '@id': ORGANIZATION_ID },
});

/** „ul. Wileńska 4, 31-413 Kraków” → ulica, kod, miejscowość */
function postalAddress(address: string) {
  const match = /^(.*?),\s*(\d{2}-\d{3})\s+(.+)$/.exec(address.trim());
  return {
    '@type': 'PostalAddress',
    streetAddress: match ? match[1] : address,
    ...(match ? { postalCode: match[2], addressLocality: match[3] } : { addressLocality: 'Kraków' }),
    addressCountry: 'PL',
  };
}

/** Piekarnia (lokal): adres, położenie, telefon, godziny otwarcia, zdjęcia */
export const bakeryLd = (location: Location) => {
  const hours = WEEKDAYS.map((d) => [d.key, hoursFor(location.openingHours, d.key)] as const).filter(
    (entry): entry is readonly [(typeof WEEKDAYS)[number]['key'], [string, string]] => entry[1] !== null,
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    '@id': `${SITE_URL}/piekarnie#${location.id}`,
    name: `${SITE_NAME} – ${location.address.split(',')[0].replace(/^ul\.\s*/i, '')}`,
    url: absoluteUrl('/piekarnie'),
    parentOrganization: { '@id': ORGANIZATION_ID },
    address: postalAddress(location.address),
    ...(location.lat != null && location.lng != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: location.lat, longitude: location.lng } }
      : {}),
    ...(location.phone ? { telephone: location.phone } : {}),
    ...(location.images?.length ? { image: location.images.map((i) => absoluteUrl(i.imgUrl)) } : { image: LOGO }),
    hasMap: location.googleMapsUrl,
    servesCuisine: 'Pieczywo rzemieślnicze',
    ...(hours.length
      ? {
          openingHoursSpecification: hours.map(([day, [opens, closes]]) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: DAY_NAMES[day],
            opens,
            closes,
          })),
        }
      : {}),
  };
};

/** Produkt: nazwa, opis, zdjęcia, cena dziś (promocyjna, gdy trwa) i dostępność */
export const productLd = (product: Product) => {
  const url = absoluteUrl(productPath(product));
  const available = isAvailable(product) && !isOutOfSeason(product);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url,
    ...(product.images?.length ? { image: product.images.map((i) => absoluteUrl(i.imgUrl)) } : {}),
    ...(product.category ? { category: product.category.name } : {}),
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PLN',
      price: priceOf(product).toFixed(2),
      ...(isOnPromo(product) && product.promoTo ? { priceValidUntil: product.promoTo } : {}),
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': ORGANIZATION_ID },
    },
  };
};

/** Wpis na blogu */
export const articleLd = (article: Article) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.title,
  description: article.shortDescription,
  url: absoluteUrl(articlePath(article)),
  datePublished: article.publishedAt,
  ...(article.images?.length ? { image: article.images.map((i) => absoluteUrl(i.imgUrl)) } : {}),
  inLanguage: 'pl-PL',
  author: { '@id': ORGANIZATION_ID },
  publisher: { '@id': ORGANIZATION_ID },
  mainEntityOfPage: absoluteUrl(articlePath(article)),
});

/** Okruszki: Strona główna › Oferta › Jagodzianka */
export const breadcrumbsLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Strona główna', path: '/' }, ...items].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
