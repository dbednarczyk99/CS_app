const webUrl = import.meta.env.VITE_WEB_URL || 'http://localhost:3001';

/** Adres zdjęcia do podglądu w panelu: zdjęcia strony (/images/…) leżą na stronie, wgrane mają pełny adres */
export const previewImageUrl = (url: string) => (url.startsWith('/') ? `${webUrl}${url}` : url);
