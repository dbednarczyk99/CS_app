import type { Metadata } from 'next';
import { api, orFallback } from './api';
import { CONTENT_DEFAULTS } from './content-defaults';
import { pageMetadata } from './site';

/**
 * Treści strony edytowane w panelu („Strona”). API zwraca sekcje uzupełnione wartościami domyślnymi;
 * content-defaults.ts to te same wartości (wygenerowane z backend/src/modules/content/sections.ts:
 * `npm run content:defaults` w backend) – używane tylko awaryjnie, gdy API nie odpowiada (strona nigdy nie jest
 * pusta). Opis pól i limity: sections.ts i sections-pages.ts w backend.
 */

export type ContentImage = { url: string; alt: string };

/** Tytuł i opis w Google, zdjęcie w podglądzie linku (puste url = domyślne) */
export type SeoContent = { title: string; description: string; image: ContentImage };

type Header = { eyebrow: string; title: string; image: ContentImage };
type HeaderWithText = Header & { text: string };
type Promo = { eyebrow: string; title: string; text: string; cta: string; image: ContentImage };

export interface SiteContent {
  'seo.home': SeoContent;
  'home.values': { items: { title: string; text: string }[] };
  'home.featured': { eyebrow: string; title: string; linkLabel: string };
  'home.rating': { visible: boolean; eyebrow: string; cta: string };
  'home.about': {
    eyebrow: string;
    title: string;
    text: string;
    image: ContentImage;
    showCount: boolean;
    linkLabel: string;
  };
  'home.quote': {
    visible: boolean;
    eyebrow: string;
    line1: string;
    highlight: string;
    text: string;
    image: ContentImage;
  };
  'home.locations': { eyebrow: string; title: string; linkLabel: string };
  'home.van': { eyebrow: string; title: string; text: string; image: ContentImage; buttonLabel: string };
  'home.news': { eyebrow: string; title: string; linkLabel: string };
  'home.gallery': {
    visible: boolean;
    eyebrow: string;
    title: string;
    instagramLabel: string;
    images: { image: ContentImage }[];
  };

  'seo.about': SeoContent;
  'about.header': Header;
  'about.story': { eyebrow: string; title: string; text: string; image: ContentImage };
  'about.principles': { eyebrow: string; title: string; items: { title: string; text: string }[] };
  'about.gallery': { images: { image: ContentImage }[]; title: string; buttonLabel: string };

  'seo.offer': SeoContent;
  'offer.header': HeaderWithText;

  'seo.locations': SeoContent;
  'locations.header': HeaderWithText;
  'locations.onsite': { eyebrow: string; title: string; text: string; image: ContentImage };
  'locations.van': Promo;

  'seo.van': SeoContent;
  'van.header': Header;
  'van.schedule': { eyebrow: string; title: string; scheduleTitle: string; mapTitle: string };
  'van.locations': Promo;

  'seo.news': SeoContent;
  'news.header': Header;
  'news.list': { readMore: string; empty: string };

  'seo.contact': SeoContent;
  'contact.header': HeaderWithText;
  'contact.page': {
    formTitle: string;
    instagramTitle: string;
    instagramText: string;
    instagramButton: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterText: string;
    newsletterButton: string;
  };

  'seo.reservation': SeoContent;
  'reservation.header': { eyebrow: string; title: string; text: string; unavailable: string };
  'reservation.form': {
    stepProducts: string;
    addMore: string;
    stepPickup: string;
    rulesNote: string;
    noDates: string;
    stepDetails: string;
    namePlaceholder: string;
    emailLabel: string;
    summaryTitle: string;
    submit: string;
    paymentNote: string;
    successTitle: string;
    howItWorksTitle: string;
    howItWorks: string;
  };

  'seo.default': { image: ContentImage };
  'common.footer': { about: string; newsletterText: string; newsletterButton: string; copyright: string };
  'common.newsletter': {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
    sentTitle: string;
    sentText: string;
  };
  'common.notFound': { eyebrow: string; title: string; text: string; homeButton: string; offerButton: string };
}

/** Teksty formularza rezerwacji (komponent kliencki dostaje je ze strony) */
export type ReservationFormTexts = SiteContent['reservation.form'];

/** Teksty okienka newslettera (komponent kliencki dostaje je z układu strony) */
export type NewsletterTexts = SiteContent['common.newsletter'];

const DEFAULTS: SiteContent = CONTENT_DEFAULTS;

/** Wszystkie treści: z API, a każda brakująca sekcja – awaryjnie z wartości domyślnych */
export async function getContent(): Promise<SiteContent> {
  const fromApi = await orFallback(api.content(), {} as Partial<SiteContent>);
  return Object.fromEntries(
    (Object.keys(DEFAULTS) as (keyof SiteContent)[]).map((key) => [key, { ...DEFAULTS[key], ...(fromApi[key] ?? {}) }]),
  ) as unknown as SiteContent;
}

type SeoKey = { [K in keyof SiteContent]: K extends `seo.${string}` ? (K extends 'seo.default' ? never : K) : never }[keyof SiteContent];

/**
 * Metadane podstrony z panelu (Strona → … → „Wyszukiwarka i udostępnianie”): tytuł, opis i zdjęcie podglądu linku;
 * bez własnego zdjęcia – domyślne z „Elementy wspólne”.
 */
export async function seoMetadata(
  key: SeoKey,
  options: { path: string; noindex?: boolean },
): Promise<Metadata> {
  const content = await getContent();
  const seo = content[key];
  const image = seo.image.url ? seo.image : content['seo.default'].image;
  return pageMetadata({
    title: key === 'seo.home' ? null : seo.title,
    homeTitle: key === 'seo.home' ? seo.title : undefined,
    description: seo.description,
    path: options.path,
    noindex: options.noindex,
    image: { url: image.url, alt: image.alt || seo.title },
  });
}

/** Zdjęcie podglądu linku domyślne (dla produktów i wpisów bez zdjęcia) */
export async function defaultShareImage() {
  const { image } = (await getContent())['seo.default'];
  return { url: image.url, alt: image.alt };
}

/** Tekst z akapitami oddzielonymi pustą linią → lista akapitów */
export const paragraphs = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Znaczniki w tekstach – w lib/text.ts (lekki plik, także dla komponentów klienckich) */
export { fill } from './text';
