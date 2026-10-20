import type { SiteContent } from './content';
// Komunikacja z API (NestJS). Wywoływane po stronie serwera Next.js.
const API_URL = process.env.API_URL ?? 'http://localhost:3000';

// Dane odświeżane co 60 s (ISR)
const REVALIDATE_SECONDS = 60;

async function get<T>(path: string, { fresh = false } = {}): Promise<T> {
  const res = await fetch(
    `${API_URL}${path}`,
    // fresh: dane zależne od bieżącej godziny (np. terminy rezerwacji) – bez cache
    fresh ? { cache: 'no-store' } : { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) {
    throw new Error(`API ${path}: ${res.status}`);
  }
  // API zwraca pustą odpowiedź (200) dla nieistniejącego rekordu
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export interface Image {
  id: string;
  imgUrl: string;
  order: number;
}

/** wygląd etykiety (style: lib/products.ts – BADGE_STYLE) */
export type LabelColor = 'gold' | 'cream' | 'dark' | 'green' | 'red';

export interface ProductLabel {
  id: string;
  name: string;
  /** w adresie filtra: /oferta?etykiety=nowosci */
  slug: string;
  color: LabelColor;
  order: number;
  /** etykieta z datami: widoczna dziś (liczone przez API); brak = widoczna */
  active?: boolean;
}

export interface Product {
  id: string;
  /** adres na stronie: /oferta/<slug> */
  slug: string | null;
  name: string;
  description: string;
  price: number;
  isSeasonal: boolean;
  /** sezonowy: false = poza sezonem (widoczny w sekcji „Wrócą w sezonie”, bez rezerwacji) */
  inSeason: boolean;
  /** etykiety z panelu (Nowość, Bestseller, własne) – w kolejności z panelu; brak w /products/categories */
  labels?: ProductLabel[];
  /** wygląd etykiety „Promocja” z panelu (nazwa, kolor, kolejność, adres filtra) */
  promoLabel?: ProductLabel | null;
  /** promocja włączona w panelu (okres od–do sprawdza API: promoActive) */
  isPromo: boolean;
  promoPrice: number | null;
  /** okres promocji (YYYY-MM-DD, czas polski); null = bez ograniczenia */
  promoFrom: string | null;
  promoTo: string | null;
  /** promocja trwa dziś (liczone przez API w czasie polskim) */
  promoActive?: boolean;
  /** cena do zapłaty dziś – promocyjna, gdy promocja trwa i ma niższą cenę */
  currentPrice?: number;
  isActive: boolean;
  isReservable: boolean;
  images?: Image[]; // brak w odpowiedzi /products/categories
  categoryId: string;
  category?: { id: string; name: string };
  /** data ostatniej zmiany (mapa strony) */
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

// Seed zapisuje godziny jako tekst ("06:30–18:00"), panel jako { openFrom, openTo }
export type OpeningHours = Record<
  string,
  string | { openFrom: string; openTo: string }
>;

export interface Location {
  id: string;
  name: string | null;
  address: string;
  phone: string | null;
  googleMapsUrl: string;
  lat: number | null;
  lng: number | null;
  openingHours: OpeningHours | null;
  images?: Image[]; // zdjęcia lokalu (karuzela na /piekarnie)
  /** Google: identyfikator miejsca (link „Wystaw opinię”) i ocena odświeżana raz dziennie */
  googlePlaceId?: string | null;
  googleRating?: number | null;
  googleRatingCount?: number | null;
}

export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface BreadVanStop {
  id: string;
  address: string;
  googleMapsUrl: string;
  lat: number | null;
  lng: number | null;
  dayOfTheWeek: Weekday;
  startTime: string;
  endTime: string;
}

export interface BreadVanDescription {
  shortDescription: string;
  longDescription: string;
  images: Image[];
}

export interface ContactInfo {
  id: string;
  type: 'PHONE' | 'EMAIL' | 'OTHER';
  label: string | null;
  value: string;
}

export type MediaName =
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TIKTOK'
  | 'LINKEDIN'
  | 'TWITTER'
  | 'PINTEREST'
  | 'YOUTUBE';

export interface Media {
  id: string;
  name: MediaName;
  url: string;
}

export interface Article {
  id: string;
  /** adres na stronie: /aktualnosci/<slug> */
  slug: string | null;
  title: string;
  shortDescription: string;
  content?: string;
  createdAt: string;
  /** data publikacji na stronie: zaplanowana albo dodania */
  publishedAt: string;
  /** zdjęcie w podglądzie linku (Facebook) – null = okładka */
  shareImageUrl?: string | null;
  images: Image[];
  tags: { tag: { id: string; name: string } }[];
}

/** Komunikat na banerze pod nawigacją (aktywny teraz, kolejność z panelu) */
export interface Announcement {
  id: string;
  message: string;
  linkUrl: string | null;
  linkLabel: string | null;
  updatedAt: string;
}

/** Zasady rezerwacji z panelu (Rezerwacje → Zasady rezerwacji) */
export interface ReservationRules {
  /** rezerwacja i anulowanie do tej godziny dnia poprzedzającego odbiór, „HH:MM” */
  cutoffTime: string;
  maxDaysAhead: number;
  maxActivePerPhone: number;
}

/** Dokument prawny (regulamin, polityka prywatności) – treść z panelu albo domyślna */
export interface LegalDocumentData {
  title: string;
  markdown: string;
  /** data ostatniej zmiany w panelu; null – wersja domyślna */
  updatedAt: string | null;
}

/** Terminy i punkty odbioru dostępne teraz do rezerwacji (liczone przez API w czasie polskim) */
export interface ReservationOptions {
  rules: ReservationRules;
  dates: string[];
  stores: {
    id: string;
    address: string;
    /** terminy odbioru co 30 min (ostatni 30 min przed zamknięciem) */
    slots: Record<string, string[]>;
    /** godziny otwarcia w danym dniu (z panelu) */
    hours: Record<string, { open: string; close: string }>;
    lat: number | null;
    lng: number | null;
  }[];
  vanStops: {
    id: string;
    address: string;
    date: string;
    startTime: string;
    endTime: string;
    /** szacowana godzina przyjścia – co 30 min w czasie postoju (ostatnia 30 min przed odjazdem) */
    slots: string[];
    lat: number | null;
    lng: number | null;
  }[];
}

/** Rezerwacja widoczna dla klienta (potwierdzenie, anulowanie) */
export interface PublicReservation {
  number: string;
  status: 'NEW' | 'CANCELLED';
  pickupType: 'STORE' | 'VAN';
  pickupLabel: string;
  pickupDate: string;
  pickupTime: string | null;
  customerName: string;
  customerEmail: string;
  total: string;
  items: { productName: string; unitPrice: string; quantity: number }[];
  canCancel: boolean;
  cancelDeadline: { date: string; hour: string };
}

/** Slajd karuzeli strony głównej z panelu (Strona → Strona główna → Karuzela) */
export interface HeroSlideData {
  id: string;
  /** CUSTOM – własny; VAN, BAKERIES, SEASONAL – z danymi z panelu (trasa, liczba piekarni, produkty sezonowe) */
  kind: 'CUSTOM' | 'VAN' | 'BAKERIES' | 'SEASONAL';
  name: string;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  text: string;
  cta1Label: string | null;
  cta1Href: string | null;
  cta2Label: string | null;
  cta2Href: string | null;
  imageUrl: string;
  imageAlt: string;
  imagePosition: string;
  mobileImageUrl: string | null;
  mobileImagePosition: string;
}

export const API_BASE_URL = API_URL;

export const api = {
  reservationOptions: () => get<ReservationOptions>('/reservations/options', { fresh: true }),
  reservationByToken: (token: string) =>
    get<PublicReservation>(`/reservations/cancel/${encodeURIComponent(token)}`, { fresh: true }),
  categories: () => get<Category[]>('/products/categories'),
  products: () => get<Product[]>('/products'),
  product: (id: string) => get<Product | null>(`/products/${encodeURIComponent(id)}`),
  locations: () => get<Location[]>('/contact/locations'),
  breadVanStops: () => get<BreadVanStop[]>('/bread-van/locations'),
  breadVanDescription: () =>
    get<BreadVanDescription | null>('/bread-van/description'),
  contactInfo: () => get<ContactInfo[]>('/contact/info'),
  media: () => get<Media[]>('/contact/media'),
  articles: () => get<Article[]>('/blog'),
  article: (id: string) => get<Article | null>(`/blog/${encodeURIComponent(id)}`),
  announcements: () => get<Announcement[]>('/announcements/active'),
  // treści edytowane w panelu („Strona”) – typy i wartości awaryjne w lib/content.ts
  content: () => get<Partial<SiteContent>>('/content'),
  heroSlides: () => get<HeroSlideData[]>('/content/hero'),
  reservationRules: () => get<ReservationRules>('/settings/reservations/public'),
  legal: (doc: string) => get<LegalDocumentData>(`/settings/legal/${encodeURIComponent(doc)}`),
};

// Strona ma się wyświetlić nawet wtedy, gdy część API nie odpowiada
export async function orFallback<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}
