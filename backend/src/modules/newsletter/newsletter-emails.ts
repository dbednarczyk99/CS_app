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
${paragraph('Dziękujemy za zapis do newslettera Chleba Smak! Aby zacząć otrzymywać wiadomości o nowościach, wypiekach sezonowych i promocjach, potwierdź swój adres e-mail.')}
<div style="margin-top:26px">${button(confirmUrl, 'Potwierdź zapis', 'gold')}</div>
${paragraph(
  `Jeśli to nie Ty zapisałeś(-aś) ten adres, po prostu zignoruj tę wiadomość – bez potwierdzenia nie wyślemy nic więcej, a dane usuniemy po 7 dniach.`,
  '#8f877b',
)}
${paragraph(`Link nie działa? Skopiuj go do przeglądarki:<br><span style="color:${C.cream};word-break:break-all">${esc(confirmUrl)}</span>`, '#8f877b')}`;

  return {
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
