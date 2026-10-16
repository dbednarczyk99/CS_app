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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isSeasonal: boolean;
  isActive: boolean;
  isReservable: boolean;
  images?: Image[]; // brak w odpowiedzi /products/categories
  categoryId: string;
  category?: { id: string; name: string };
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
  title: string;
  shortDescription: string;
  content?: string;
  createdAt: string;
  images: Image[];
  tags: { tag: { id: string; name: string } }[];
}

/** Terminy i punkty odbioru dostępne teraz do rezerwacji (liczone przez API w czasie polskim) */
export interface ReservationOptions {
  cutoffHour: number;
  dates: string[];
  stores: { id: string; address: string; slots: Record<string, string[]> }[];
  vanStops: { id: string; address: string; date: string; startTime: string; endTime: string }[];
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
