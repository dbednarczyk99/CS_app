import type { Field, ImageValue } from './section-types';

const URL_RE = /^(\/[^\s]*|https?:\/\/[^\s]+)$/;

/**
 * Sprawdzenie i oczyszczenie danych sekcji według opisu pól: przycięte teksty w limitach, wymagane pola,
 * listy o dozwolonej długości, zdjęcia z poprawnym adresem. Nieznane pola są pomijane.
 * Zwraca oczyszczone dane albo listę błędów po polsku (z nazwą pola, np. „Wartość 2 → Tytuł”).
 */
export function validateFields(
  fields: Field[],
  input: unknown,
  path = '',
): { value: Record<string, unknown>; errors: string[] } {
  const data = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  const value: Record<string, unknown> = {};
  const errors: string[] = [];
  const at = (label: string) => `„${path}${label}”`;

  for (const field of fields) {
    const raw = data[field.name];
    switch (field.type) {
      case 'text':
      case 'textarea': {
        const text = typeof raw === 'string' ? raw.trim() : '';
        if (field.required && !text)
          errors.push(`${at(field.label)}: pole jest wymagane`);
        if (text.length > field.max)
          errors.push(
            `${at(field.label)}: najwyżej ${field.max} znaków (jest ${text.length})`,
          );
        value[field.name] = text;
        break;
      }
      case 'toggle':
        value[field.name] = raw === true;
        break;
      case 'image': {
        const image = (
          raw && typeof raw === 'object' ? raw : {}
        ) as Partial<ImageValue>;
        const url = typeof image.url === 'string' ? image.url.trim() : '';
        const alt = typeof image.alt === 'string' ? image.alt.trim() : '';
        if (field.required && !url)
          errors.push(`${at(field.label)}: wybierz zdjęcie`);
        if (url && (!URL_RE.test(url) || url.length > 500))
          errors.push(`${at(field.label)}: niepoprawny adres zdjęcia`);
        if (alt.length > 160)
          errors.push(`${at(field.label)} – opis zdjęcia: najwyżej 160 znaków`);
        value[field.name] = { url, alt };
        break;
      }
      case 'list': {
        const items = Array.isArray(raw) ? raw : [];
        if (items.length < field.min || items.length > field.max)
          errors.push(
            field.min === field.max
              ? `${at(field.label)}: wymagane dokładnie ${field.min}`
              : `${at(field.label)}: od ${field.min} do ${field.max} pozycji (jest ${items.length})`,
          );
        value[field.name] = items.slice(0, field.max).map((item, i) => {
          const result = validateFields(
            field.fields,
            item,
            `${path}${field.itemLabel} ${i + 1} → `,
          );
          errors.push(...result.errors);
          return result.value;
        });
        break;
      }
    }
  }
  return { value, errors };
}

/** Adresy wszystkich zdjęć w danych sekcji (do usunięcia nieużywanych wgranych plików) */
export function collectImageUrls(fields: Field[], input: unknown): string[] {
  const data = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  return fields.flatMap((field) => {
    const raw = data[field.name];
    if (field.type === 'image') {
      const url = (raw as Partial<ImageValue> | undefined)?.url;
      return typeof url === 'string' && url ? [url] : [];
    }
    if (field.type === 'list' && Array.isArray(raw))
      return raw.flatMap((item) => collectImageUrls(field.fields, item));
    return [];
  });
}
