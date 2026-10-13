// Komunikacja z API (NestJS). Wywoływane po stronie serwera Next.js.
const API_URL = process.env.API_URL ?? 'http://localhost:3000';

// Dane odświeżane co 60 s (ISR)
const REVALIDATE_SECONDS = 60;

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`API ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
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
  images?: Image[]; // brak w odpowiedzi /products/categories
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
  createdAt: string;
  images: Image[];
  tags: { tag: { id: string; name: string } }[];
}

export const api = {
  categories: () => get<Category[]>('/products/categories'),
  locations: () => get<Location[]>('/contact/locations'),
  breadVanStops: () => get<BreadVanStop[]>('/bread-van/locations'),
  breadVanDescription: () =>
    get<BreadVanDescription | null>('/bread-van/description'),
  contactInfo: () => get<ContactInfo[]>('/contact/info'),
  media: () => get<Media[]>('/contact/media'),
  articles: () => get<Article[]>('/blog'),
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
