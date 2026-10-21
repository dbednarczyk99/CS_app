import { join } from 'path';
import { emailFontFaces } from '../mail/email-fonts';
import type { MailMessage } from '../mail/mail.service';

/* E-maile do pracowników o haśle do panelu – jasne, w stylu formularza kontaktowego */
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

function frame(
  webUrl: string,
  subject: string,
  title: string,
  body: string,
): string {
  return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<style>${emailFontFaces(webUrl)}</style>
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.soft}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.soft}" style="background:${C.soft}">
<tr><td align="center" style="padding:24px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:560px;background:#ffffff;border:1px solid ${C.line}">
<tr><td bgcolor="${C.ink}" style="background:${C.ink};padding:20px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td><img src="cid:${LOGO_CID}" width="170" alt="Chleba Smak" style="display:block;width:170px;height:auto;border:0;color:#f4efe6"></td>
    <td align="right" style="font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a36a">Panel</td>
  </tr></table>
</td></tr>
<tr><td style="padding:28px 32px 0;font-family:${HEADING};font-weight:500;font-size:22px;letter-spacing:1px;text-transform:uppercase;color:${C.text}">${esc(title)}</td></tr>
<tr><td style="padding:14px 32px 32px;font-family:${BODY};font-size:15px;line-height:1.6;color:${C.text}">${body}</td></tr>
</table></td></tr></table></body></html>`;
}

const logo = [
  {
    filename: 'chleba-smak.png',
    path: join(process.cwd(), 'assets', 'email', 'logo.png'),
    cid: LOGO_CID,
  },
];

/** Link do ustawienia nowego hasła („Nie pamiętam hasła”) */
export function passwordResetEmail(
  to: string,
  login: string,
  link: string,
  minutes: number,
  webUrl: string,
): MailMessage {
  const subject = 'Ustaw nowe hasło do panelu Chleba Smak';
  const body = `
<p style="margin:0 0 14px">Ktoś (pewnie Ty) poprosił o zmianę hasła do konta <strong>${esc(login)}</strong> w panelu strony.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px"><tr>
<td bgcolor="${C.gold}" style="background:${C.gold}">
<a href="${esc(link)}" style="display:inline-block;padding:13px 24px;font-family:${HEADING};font-size:13px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;color:${C.ink}">Ustaw nowe hasło</a>
</td></tr></table>
<p style="margin:0 0 14px;color:${C.muted};font-size:13px">Link działa przez ${minutes} minut i tylko raz. Jeśli to nie Ty – zignoruj tę wiadomość, hasło się nie zmieni.</p>`;
  return {
    category: 'konto',
    to,
    subject,
    html: frame(webUrl, subject, 'Nowe hasło', body),
    text: [
      `Ktoś (pewnie Ty) poprosił o zmianę hasła do konta ${login} w panelu strony Chleba Smak.`,
      '',
      `Ustaw nowe hasło: ${link}`,
      '',
      `Link działa przez ${minutes} minut i tylko raz. Jeśli to nie Ty – zignoruj tę wiadomość.`,
    ].join('\n'),
    attachments: logo,
  };
}

/** Powiadomienie po zmianie hasła linkiem z e-maila – gdyby to nie był właściciel konta */
export function passwordChangedEmail(
  to: string,
  login: string,
  webUrl: string,
): MailMessage {
  const subject = 'Hasło do panelu Chleba Smak zostało zmienione';
  const when = new Date().toLocaleString('pl-PL', {
    timeZone: 'Europe/Warsaw',
  });
  const body = `
<p style="margin:0 0 14px">Hasło do konta <strong>${esc(login)}</strong> zostało zmienione (${esc(when)}). Wszystkie wcześniejsze logowania wygasły.</p>
<p style="margin:0;color:${C.muted};font-size:13px">Jeśli to nie Ty – od razu użyj „Nie pamiętam hasła” na stronie logowania albo skontaktuj się z osobą, która opiekuje się stroną.</p>`;
  return {
    category: 'konto',
    to,
    subject,
    html: frame(webUrl, subject, 'Hasło zmienione', body),
    text: `Hasło do konta ${login} w panelu Chleba Smak zostało zmienione (${when}). Jeśli to nie Ty – użyj „Nie pamiętam hasła” albo skontaktuj się z osobą, która opiekuje się stroną.`,
    attachments: logo,
  };
}
