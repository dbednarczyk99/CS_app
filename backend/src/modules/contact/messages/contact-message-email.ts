import { join } from 'path';
import { emailFontFaces } from '../../mail/email-fonts';
import type { MailMessage } from '../../mail/mail.service';
import type { ContactMessageDto } from './dto/contact-message.dto';

/* Mail dla piekarni z formularza kontaktowego – jasny, w stylu zestawienia rezerwacji */
const C = {
  ink: '#141618',
  text: '#1d1f22',
  muted: '#6f6a62',
  line: '#e2dccf',
  soft: '#f6f2ea',
  gold: '#a8833f',
};
const HEADING = "'Oswald','Helvetica Neue',Helvetica,Arial,sans-serif";
const BODY = "'Lato','Helvetica Neue',Helvetica,Arial,sans-serif";
const LOGO_CID = 'logo@chlebasmak';

const esc = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

const label = (text: string) =>
  `<div style="font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.gold}">${esc(text)}</div>`;

export function contactMessageEmail(
  m: ContactMessageDto,
  to: string,
  webUrl: string,
): MailMessage {
  const subject = m.subject ? `Kontakt: ${m.subject}` : `Kontakt: wiadomość od ${m.name}`;

  const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<style>${emailFontFaces(webUrl)}</style>
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.soft}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.soft}" style="background:${C.soft}">
<tr><td align="center" style="padding:24px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:640px;background:#ffffff;border:1px solid ${C.line}">
<tr><td bgcolor="${C.ink}" style="background:${C.ink};padding:20px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td><img src="cid:${LOGO_CID}" width="190" alt="Chleba Smak" style="display:block;width:190px;height:auto;border:0;color:#f4efe6"></td>
    <td align="right" style="font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a36a">Formularz kontaktowy</td>
  </tr></table>
</td></tr>
<tr><td style="padding:28px 32px 0">
  ${label('Od')}
  <div style="margin-top:6px;font-family:${HEADING};font-weight:500;font-size:24px;letter-spacing:1px;text-transform:uppercase;color:${C.text}">${esc(m.name)}</div>
  <div style="margin-top:4px;font-family:${BODY};font-size:15px"><a href="mailto:${esc(m.email)}" style="color:${C.gold}">${esc(m.email)}</a></div>
</td></tr>
${
  m.subject
    ? `<tr><td style="padding:22px 32px 0">${label('Temat')}<div style="margin-top:6px;font-family:${BODY};font-size:16px;font-weight:700;color:${C.text}">${esc(m.subject)}</div></td></tr>`
    : ''
}
<tr><td style="padding:22px 32px 0">
  ${label('Wiadomość')}
  <div style="margin-top:8px;padding:18px 20px;background:${C.soft};border-left:3px solid ${C.gold};font-family:${BODY};font-size:15px;line-height:1.6;color:${C.text};white-space:pre-wrap">${esc(m.message)}</div>
</td></tr>
<tr><td style="padding:28px 32px 32px;font-family:${BODY};font-size:12px;line-height:1.6;color:${C.muted}">
  Aby odpowiedzieć, użyj „Odpowiedz” – wiadomość trafi bezpośrednio do nadawcy.<br>
  Wysłano automatycznie z formularza na stronie do ${esc(to)}.
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `Formularz kontaktowy – wiadomość od ${m.name} <${m.email}>`,
    m.subject ? `Temat: ${m.subject}` : null,
    '',
    m.message,
    '',
    '— Aby odpowiedzieć, użyj „Odpowiedz”.',
  ]
    .filter((line) => line !== null)
    .join('\n');

  return {
    category: 'kontakt',
    to,
    replyTo: `${m.name.replace(/[<>"]/g, '')} <${m.email}>`,
    subject,
    html,
    text,
    attachments: [
      {
        filename: 'chleba-smak.png',
        path: join(process.cwd(), 'assets', 'email', 'logo.png'),
        cid: LOGO_CID,
      },
    ],
  };
}
