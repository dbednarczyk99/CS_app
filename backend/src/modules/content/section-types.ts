/** Typy opisu sekcji treści strony (sections.ts, sections-pages.ts) */

export type Field =
  | {
      name: string;
      label: string;
      type: 'text';
      max: number;
      /** zalecana długość (np. tytuł w Google) – panel ostrzega po przekroczeniu */
      recommended?: number;
      required?: boolean;
      help?: string;
    }
  | {
      name: string;
      label: string;
      type: 'textarea';
      max: number;
      recommended?: number;
      required?: boolean;
      help?: string;
      rows?: number;
    }
  | {
      name: string;
      label: string;
      type: 'image';
      help?: string;
      required?: boolean;
      /** proporcje podglądu w panelu, np. „1.91 / 1” */
      aspect?: string;
    }
  | { name: string; label: string; type: 'toggle'; help?: string }
  | {
      name: string;
      label: string;
      type: 'list';
      help?: string;
      min: number;
      max: number;
      /** nazwa pojedynczego elementu w panelu, np. „Zdjęcie” */
      itemLabel: string;
      fields: Field[];
    };

/** Zdjęcie w treści: adres (wgrany plik albo zdjęcie strony) i opis dla niewidomych / Google */
export type ImageValue = { url: string; alt: string };

export type Section = {
  key: string;
  /** strona w panelu (grupa ekranów), np. „home” */
  page: string;
  title: string;
  description?: string;
  /** sekcja SEO: panel pokazuje podgląd wyniku w Google i linku na Facebooku */
  seo?: {
    /** adres podstrony, np. „/o-nas” */
    path: string;
    /** czy do tytułu dopisywane jest „ · Chleba Smak” */
    suffix: boolean;
  };
  fields: Field[];
  defaults: Record<string, unknown>;
};

export const img = (url: string, alt: string): ImageValue => ({ url, alt });
