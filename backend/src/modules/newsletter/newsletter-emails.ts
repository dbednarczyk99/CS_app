import type { MailMessage } from '../mail/mail.service';
import {
  button,
  C,
  esc,
  eyebrow,
  heading,
  layout,
  logoAttachment,
  paragraph,
  type EmailContext,
} from '../reservations/reservation-emails';
import {
  PRODUCT_TOKEN,
  productIdsIn,
  productTileHtml,
  productTileText,
  tileIdOf,
  type TileProduct,
} from './product-tiles';

const NOTE =
  'Otrzymujesz tę wiadomość, bo ktoś podał ten adres przy zapisie do newslettera Chleba Smak.';

/** Newsletter z nowym wpisem z bloga – osobny e-mail dla każdego odbiorcy (własny link do wypisania) */
export function newsletterArticleEmail(
  article: {
    id: string;
    /** adres wpisu na stronie (czytelny); brak – link po id (strona przekierowuje) */
    slug?: string | null;
    title: string;
    shortDescription: string;
    content: string;
    /** false = wpis tylko do newslettera – cała treść w e-mailu, bez linku do strony */
    isPublished: boolean;
    imageUrl?: string | null;
  },
  to: { email: string; token: string },
  ctx: EmailContext,
  /** produkty z kafelków w treści ([produkt:id]) – aktywne, z ceną w dniu wysyłki */
  products: Map<string, TileProduct> = new Map(),
): MailMessage {
  // znaczniki źródła i wysyłki – wejścia z tego newslettera (i kliknięte produkty) widać w panelu „Statystyki”
  const campaign = `utm_source=newsletter&utm_campaign=${article.id}`;
  // czytelne adresy w linkach; utm_content to zawsze id produktu (statystyki kliknięć)
  const articleUrl = `${ctx.webUrl}/aktualnosci/${article.slug ?? article.id}?${campaign}`;
  const productUrl = (id: string) =>
    `${ctx.webUrl}/oferta/${products.get(id)?.slug ?? id}?${campaign}&utm_content=${id}`;
  const unsubscribeUrl = `${ctx.webUrl}/newsletter/wypisz/${to.token}`;
  const img = article.imageUrl
    ? `<img src="${esc(article.imageUrl)}" width="520" alt="" style="display:block;width:100%;height:auto;margin:22px 0 4px;border:0">`
    : '';
  const paragraphs = article.content
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const tile = (id: string) => {
    const p = products.get(id);
    return p ? productTileHtml(p, productUrl(id)) : '';
  };
  // opublikowany: zajawka + kafelki produktów z wpisu + „Czytaj dalej”; tylko newsletter: pełna treść
  const body = article.isPublished
    ? `${img ? `<a href="${articleUrl}">${img}</a>` : ''}
${paragraph(esc(article.shortDescription), C.cream)}
${productIdsIn(article.content).map(tile).join('\n')}
<div style="margin-top:26px">${button(articleUrl, 'Czytaj dalej', 'gold')}</div>`
    : `${img}
${paragraph(esc(article.shortDescription), C.cream)}
${paragraphs
  .map((p) => {
    const id = tileIdOf(p);
    return id
      ? tile(id)
      : paragraph(esc(p.replace(PRODUCT_TOKEN, '')).replace(/\r?\n/g, '<br>'));
  })
  .join('\n')}`;
  const textTile = (id: string) => {
    const p = products.get(id);
    return p ? productTileText(p, productUrl(id)) : '';
  };
  const content = `
${eyebrow('Z piekarni Chleba Smak')}
${heading(article.title, 26)}
${body}
${paragraph(
  `Otrzymujesz tę wiadomość, bo zapisałeś(-aś) się do newslettera Chleba Smak. <a href="${unsubscribeUrl}" style="color:#8f877b;text-decoration:underline">Wypisz się</a>`,
  '#8f877b',
)}`;

  return {
    category: 'newsletter',
    to: to.email,
    subject: `${article.title} – Chleba Smak`,
    html: layout(
      article.shortDescription,
      content,
      ctx,
      'Newsletter Chleba Smak',
    ),
    text: [
      article.title,
      '',
      article.shortDescription,
      '',
      article.isPublished
        ? [
            ...productIdsIn(article.content).map(textTile).filter(Boolean),
            `Czytaj dalej: ${articleUrl}`,
          ].join('\n\n')
        : paragraphs
            .map((p) => {
              const id = tileIdOf(p);
              return id ? textTile(id) : p.replace(PRODUCT_TOKEN, '');
            })
            .filter(Boolean)
            .join('\n\n'),
      '',
      `Wypisz się z newslettera: ${unsubscribeUrl}`,
    ].join('\n'),
    // przycisk „Wypisz się” w programach pocztowych (Gmail, Outlook)
    headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
    attachments: [logoAttachment()],
  };
}

/** E-mail z linkiem potwierdzającym zapis (double opt-in) */
export function newsletterConfirmEmail(
  email: string,
  token: string,
  ctx: EmailContext,
): MailMessage {
  const confirmUrl = `${ctx.webUrl}/newsletter/potwierdz/${token}`;
  const content = `
${eyebrow('Newsletter')}
${heading('Potwierdź zapis')}
${paragraph('Dziękujemy za zapis do newslettera Chleba Smak! Aby zacząć otrzymywać wiadomości o nowościach, wypiekach sezonowych, promocjach i konkursach oraz o ważnych zmianach (np. przerwach w kursowaniu chlebowozu), potwierdź swój adres e-mail.')}
<div style="margin-top:26px">${button(confirmUrl, 'Potwierdź zapis', 'gold')}</div>
${paragraph(
  `Jeśli to nie Ty zapisałeś(-aś) ten adres, po prostu zignoruj tę wiadomość – bez potwierdzenia nie wyślemy nic więcej, a dane usuniemy po 7 dniach.`,
  '#8f877b',
)}
${paragraph(`Link nie działa? Skopiuj go do przeglądarki:<br><span style="color:${C.cream};word-break:break-all">${esc(confirmUrl)}</span>`, '#8f877b')}`;

  return {
    category: 'newsletter-zapis',
    to: email,
    subject: 'Potwierdź zapis do newslettera – Chleba Smak',
    html: layout(
      'Kliknij, aby potwierdzić zapis do newslettera',
      content,
      ctx,
      NOTE,
    ),
    text: [
      'Dziękujemy za zapis do newslettera Chleba Smak!',
      '',
      `Potwierdź zapis: ${confirmUrl}`,
      '',
      'Jeśli to nie Ty – zignoruj tę wiadomość; bez potwierdzenia nic więcej nie wyślemy, a dane usuniemy po 7 dniach.',
    ].join('\n'),
    attachments: [logoAttachment()],
  };
}
