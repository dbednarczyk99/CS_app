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

const NOTE =
  'Otrzymujesz tę wiadomość, bo ktoś podał ten adres przy zapisie do newslettera Chleba Smak.';

/** Newsletter z nowym wpisem z bloga – osobny e-mail dla każdego odbiorcy (własny link do wypisania) */
export function newsletterArticleEmail(
  article: {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    /** false = wpis tylko do newslettera – cała treść w e-mailu, bez linku do strony */
    isPublished: boolean;
    imageUrl?: string | null;
  },
  to: { email: string; token: string },
  ctx: EmailContext,
): MailMessage {
  const articleUrl = `${ctx.webUrl}/aktualnosci/${article.id}`;
  const unsubscribeUrl = `${ctx.webUrl}/newsletter/wypisz/${to.token}`;
  const img = article.imageUrl
    ? `<img src="${esc(article.imageUrl)}" width="520" alt="" style="display:block;width:100%;height:auto;margin:22px 0 4px;border:0">`
    : '';
  // opublikowany: zajawka + „Czytaj dalej”; tylko newsletter: pełna treść (akapity)
  const body = article.isPublished
    ? `${img ? `<a href="${articleUrl}">${img}</a>` : ''}
${paragraph(esc(article.shortDescription), C.cream)}
<div style="margin-top:26px">${button(articleUrl, 'Czytaj dalej', 'gold')}</div>`
    : `${img}
${paragraph(esc(article.shortDescription), C.cream)}
${article.content
  .split(/\n{2,}/)
  .map((p) => paragraph(esc(p.trim()).replace(/\n/g, '<br>')))
  .join('\n')}`;
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
      article.isPublished ? `Czytaj dalej: ${articleUrl}` : article.content,
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
