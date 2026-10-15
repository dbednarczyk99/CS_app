import { join } from 'path';
import type { MailMessage } from '../mail/mail.service';
import { cancelDeadline, formatPhone } from './reservation-rules';

export interface ReservationForEmail {
  number: string;
  pickupType: 'STORE' | 'VAN';
  pickupLabel: string;
  pickupDate: string;
  pickupTime: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  total: { toString(): string } | number;
  cancelToken: string;
  items: {
    productName: string;
    unitPrice: { toString(): string } | number;
    quantity: number;
  }[];
}

/** Dane spoza rezerwacji: kontakt, linki – z bazy (punkt odbioru, dane kontaktowe, social media) */
export interface EmailContext {
  webUrl: string;
  /** telefon punktu odbioru (piekarni); dla chlebowozu zwykle brak */
  pointPhone?: string | null;
  /** link do nawigacji do punktu odbioru */
  navigateUrl?: string | null;
  contactEmail?: string | null;
  social: { name: string; url: string }[];
}

/* ---------- identyfikacja wizualna (jak na stronie) ---------- */

const C = {
  ink: '#141618',
  coal: '#1a1d20',
  graphite: '#212529',
  line: '#2e3338',
  cream: '#f4efe6',
  stone: '#b9b1a4',
  gold: '#c9a36a',
};
const HEADING = "'Oswald','Arial Narrow','Helvetica Neue',Arial,sans-serif";
const BODY = "'Lato','Helvetica Neue',Helvetica,Arial,sans-serif";
const LOGO_CID = 'logo@chlebasmak';

const SOCIAL_LABELS: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  LINKEDIN: 'LinkedIn',
  TWITTER: 'X',
  PINTEREST: 'Pinterest',
};

const money = (value: { toString(): string } | number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(
    Number(value.toString()),
  );

export const formatPickupDate = (date: string) =>
  new Intl.DateTimeFormat('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));

const esc = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- elementy ---------- */

const eyebrow = (text: string) =>
  `<div style="font-family:${HEADING};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.gold}">${esc(text)}</div>`;

const heading = (text: string, size = 26) =>
  `<h1 style="margin:10px 0 0;font-family:${HEADING};font-weight:500;font-size:${size}px;line-height:1.2;letter-spacing:1px;text-transform:uppercase;color:${C.cream}">${esc(text)}</h1>`;

const paragraph = (html: string, color = C.stone) =>
  `<p style="margin:14px 0 0;font-family:${BODY};font-size:15px;line-height:1.65;color:${color}">${html}</p>`;

function button(href: string, label: string, variant: 'gold' | 'outline') {
  const gold = variant === 'gold';
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;margin:6px 8px 0 0"><tr>
<td bgcolor="${gold ? C.gold : C.coal}" style="background:${gold ? C.gold : C.coal};border:1px solid ${gold ? C.gold : C.stone}">
<a href="${href}" style="display:inline-block;padding:12px 22px;font-family:${HEADING};font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;color:${gold ? C.ink : C.cream}">${esc(label)}</a>
</td></tr></table>`;
}

/** Ramka strony: logo, panel z treścią, stopka z kontaktem i social media */
function layout(preheader: string, content: string, ctx: EmailContext): string {
  const site = ctx.webUrl.replace(/^https?:\/\//, '');
  const links = [
    `<a href="${ctx.webUrl}" style="color:${C.cream};text-decoration:none">${esc(site)}</a>`,
    ctx.contactEmail
      ? `<a href="mailto:${esc(ctx.contactEmail)}" style="color:${C.cream};text-decoration:none">${esc(ctx.contactEmail)}</a>`
      : '',
  ].filter(Boolean);
  const social = ctx.social
    .map(
      (s) =>
        `<a href="${esc(s.url)}" style="color:${C.gold};text-decoration:none;font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase">${esc(SOCIAL_LABELS[s.name] ?? s.name)}</a>`,
    )
    .join('<span style="color:#4d4a45">&nbsp;&nbsp;·&nbsp;&nbsp;</span>');

  return `<!doctype html>
<html lang="pl" style="color-scheme:dark;supported-color-schemes:dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Oswald:wght@400;500&display=swap" rel="stylesheet">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Oswald:wght@400;500&display=swap');
  :root { color-scheme: dark; supported-color-schemes: dark; }
  a { color: ${C.gold}; }
  @media (max-width: 620px) { .px { padding-left: 22px !important; padding-right: 22px !important; } }
</style>
</head>
<body bgcolor="${C.ink}" style="margin:0;padding:0;background:${C.ink}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.ink}" style="background:${C.ink}">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">

<tr><td align="center" style="padding:8px 0 26px">
  <a href="${ctx.webUrl}"><img src="cid:${LOGO_CID}" width="260" alt="Chleba Smak – piekarnia rzemieślnicza" style="display:block;width:260px;max-width:70%;height:auto;border:0;color:${C.cream};font-family:${HEADING};font-size:20px;letter-spacing:4px"></a>
</td></tr>

<tr><td bgcolor="${C.coal}" class="px" style="background:${C.coal};border:1px solid ${C.line};border-top:2px solid ${C.gold};padding:36px 40px">
${content}
</td></tr>

<tr><td align="center" style="padding:28px 16px 8px;font-family:${BODY};font-size:13px;line-height:1.8;color:${C.stone}">
  ${links.join('<span style="color:#4d4a45">&nbsp;&nbsp;|&nbsp;&nbsp;</span>')}
  ${social ? `<div style="margin-top:10px">${social}</div>` : ''}
  <div style="margin-top:16px;font-size:11px;color:#77716a">Chleba Smak · Piekarnia Rzemieślnicza · Kraków<br>Wiadomość wysłana automatycznie – w sprawie rezerwacji skontaktuj się z piekarnią.</div>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

function pickupBlock(r: ReservationForEmail, ctx: EmailContext): string {
  const where = r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia';
  const when = `${capitalize(formatPickupDate(r.pickupDate))}${r.pickupTime ? `, ${r.pickupTime}` : ''}`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0">
<tr><td bgcolor="${C.graphite}" style="background:${C.graphite};border-left:3px solid ${C.gold};padding:20px 22px">
  ${eyebrow('Odbiór')}
  <div style="margin-top:8px;font-family:${HEADING};font-size:20px;letter-spacing:1px;color:${C.cream}">${esc(when)}</div>
  <div style="margin-top:6px;font-family:${BODY};font-size:15px;line-height:1.5;color:${C.stone}">${where}: <span style="color:${C.cream}">${esc(r.pickupLabel)}</span></div>
  ${
    ctx.pointPhone
      ? `<div style="margin-top:6px;font-family:${BODY};font-size:15px;color:${C.stone}">Telefon: <a href="tel:${ctx.pointPhone.replace(/\s/g, '')}" style="color:${C.cream};text-decoration:none">${esc(formatPhone(ctx.pointPhone.replace(/\s/g, '').replace(/^(\+48)?/, '+48')))}</a></div>`
      : ''
  }
  ${ctx.navigateUrl ? `<div style="margin-top:14px">${button(ctx.navigateUrl, 'Nawiguj', 'gold')}</div>` : ''}
</td></tr></table>`;
}

function itemsTable(r: ReservationForEmail): string {
  const cell = `font-family:${BODY};font-size:15px;color:${C.cream};padding:12px 0;border-bottom:1px solid ${C.line}`;
  const rows = r.items
    .map(
      (i) => `<tr>
  <td style="${cell}">${esc(i.productName)}</td>
  <td style="${cell};text-align:center;white-space:nowrap;color:${C.stone}">× ${i.quantity}</td>
  <td style="${cell};text-align:right;white-space:nowrap">${money(Number(i.unitPrice.toString()) * i.quantity)}</td>
</tr>`,
    )
    .join('');
  return `<div style="margin-top:30px">${eyebrow('Produkty')}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px">${rows}
<tr>
  <td colspan="2" style="padding:16px 0 0;font-family:${BODY};font-size:14px;color:${C.stone}">Do zapłaty przy odbiorze</td>
  <td style="padding:16px 0 0;text-align:right;white-space:nowrap;font-family:${HEADING};font-size:22px;color:${C.gold}">${money(r.total)}</td>
</tr></table>`;
}

/* ---------- wiadomości ---------- */

export function reservationConfirmationEmail(
  r: ReservationForEmail,
  ctx: EmailContext,
): MailMessage {
  const cancelUrl = `${ctx.webUrl}/rezerwacja/anuluj/${r.cancelToken}`;
  const deadline = cancelDeadline(r.pickupDate);
  const deadlineText = `${formatPickupDate(deadline.date)}, ${deadline.hour}`;
  const firstName = r.customerName.trim().split(/\s+/)[0];

  const content = `
${eyebrow('Rezerwacja przyjęta')}
${heading(`Dziękujemy, ${firstName}!`)}
${paragraph('Twoje pieczywo będzie na Ciebie czekać. Płacisz na miejscu, przy odbiorze – gotówką lub kartą.')}

<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0"><tr>
<td style="border:1px solid ${C.gold};padding:14px 22px">
  <div style="font-family:${BODY};font-size:12px;color:${C.stone}">Numer rezerwacji</div>
  <div style="margin-top:4px;font-family:${HEADING};font-size:26px;letter-spacing:5px;color:${C.gold}">${esc(r.number)}</div>
</td></tr></table>
${paragraph('Podaj ten numer przy odbiorze.', C.stone)}

${pickupBlock(r, ctx)}
${itemsTable(r)}
${r.notes ? `<div style="margin-top:22px">${eyebrow('Twoje uwagi')}</div>${paragraph(esc(r.notes), C.cream)}` : ''}

<div style="margin-top:34px;padding-top:24px;border-top:1px solid ${C.line}">
  ${eyebrow('Zmiana planów?')}
  ${paragraph(`Rezerwację możesz anulować do <strong style="color:${C.cream}">${esc(deadlineText)}</strong>. Później prosimy o kontakt telefoniczny z piekarnią.`)}
  <div style="margin-top:16px">${button(cancelUrl, 'Anuluj rezerwację', 'outline')}</div>
</div>`;

  const text = [
    `Dziękujemy, ${firstName}! Rezerwacja ${r.number} została przyjęta.`,
    'Podaj numer rezerwacji przy odbiorze. Płatność przy odbiorze (gotówka lub karta).',
    '',
    `Odbiór: ${formatPickupDate(r.pickupDate)}${r.pickupTime ? `, ${r.pickupTime}` : ''}`,
    `${r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: ${r.pickupLabel}`,
    ctx.pointPhone ? `Telefon: ${ctx.pointPhone}` : '',
    ctx.navigateUrl ? `Nawigacja: ${ctx.navigateUrl}` : '',
    '',
    ...r.items.map((i) => `- ${i.productName} × ${i.quantity}`),
    `Do zapłaty przy odbiorze: ${money(r.total)}`,
    r.notes ? `Uwagi: ${r.notes}` : '',
    '',
    `Anulowanie (do ${deadlineText}): ${cancelUrl}`,
    '',
    `Chleba Smak · ${ctx.webUrl}${ctx.contactEmail ? ` · ${ctx.contactEmail}` : ''}`,
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n');

  return {
    to: r.customerEmail,
    subject: `Rezerwacja ${r.number} przyjęta – Chleba Smak`,
    html: layout(
      `Odbiór: ${formatPickupDate(r.pickupDate)}, ${r.pickupLabel}`,
      content,
      ctx,
    ),
    text,
    attachments: [logoAttachment()],
  };
}

export function reservationCancelledEmail(
  r: ReservationForEmail,
  ctx: EmailContext,
): MailMessage {
  const content = `
${eyebrow('Rezerwacja anulowana')}
${heading('Do zobaczenia następnym razem')}
${paragraph(`Rezerwacja <strong style="color:${C.gold}">${esc(r.number)}</strong> na ${esc(formatPickupDate(r.pickupDate))} została anulowana. Nic nie musisz już robić.`)}
${pickupBlock(r, { ...ctx, navigateUrl: null })}
${itemsTable(r)}
<div style="margin-top:30px">${button(`${ctx.webUrl}/oferta`, 'Zarezerwuj ponownie', 'gold')}</div>`;

  return {
    to: r.customerEmail,
    subject: `Rezerwacja ${r.number} anulowana – Chleba Smak`,
    html: layout(`Rezerwacja ${r.number} została anulowana`, content, ctx),
    text: `Rezerwacja ${r.number} na ${formatPickupDate(r.pickupDate)} została anulowana.\n\nChleba Smak · ${ctx.webUrl}`,
    attachments: [logoAttachment()],
  };
}

// logo w treści maila (cid) – działa bez publicznego adresu i nie jest blokowane jak obrazki z internetu
function logoAttachment() {
  return {
    filename: 'chleba-smak.png',
    path: join(process.cwd(), 'assets', 'email', 'logo.png'),
    cid: LOGO_CID,
  };
}
