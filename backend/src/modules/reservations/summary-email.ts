import { join } from 'path';
import { emailFontFaces } from '../mail/email-fonts';
import type { MailMessage } from '../mail/mail.service';
import { formatPickupDate } from './reservation-emails';
import { formatPhone } from './reservation-rules';

/** Zestawienie z ReservationsService.summary() */
export interface DailySummary {
  date: string;
  reservationsCount: number;
  totals: { name: string; quantity: number }[];
  points: {
    pickupType: 'STORE' | 'VAN';
    label: string;
    products: { name: string; quantity: number }[];
    reservations: {
      number: string;
      pickupTime: string | null;
      customerName: string;
      customerPhone: string;
      notes: string | null;
      status: string;
      items: { productName: string; quantity: number }[];
    }[];
  }[];
}

/*
 * Mail dla piekarni – jasny, bo będzie drukowany (ciemne tło zużywa toner i źle się czyta na papierze).
 * Nagłówek w kolorach marki, reszta czarno-biała z drobnym złotym akcentem.
 */
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
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const label = (text: string) =>
  `<div style="font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.gold}">${esc(text)}</div>`;

function productsTable(
  products: { name: string; quantity: number }[],
  big = false,
) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">${products
    .map(
      (p) => `<tr>
  <td style="padding:7px 0;border-bottom:1px solid ${C.line};font-family:${BODY};font-size:${big ? 16 : 14}px;color:${C.text}">${esc(p.name)}</td>
  <td style="padding:7px 0;border-bottom:1px solid ${C.line};text-align:right;white-space:nowrap;font-family:${HEADING};font-size:${big ? 18 : 15}px;color:${C.text}">× ${p.quantity}</td>
</tr>`,
    )
    .join('')}</table>`;
}

function reservationsTable(
  rows: DailySummary['points'][number]['reservations'],
) {
  const th = `padding:6px 8px 6px 0;text-align:left;font-family:${BODY};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.muted};border-bottom:2px solid ${C.text}`;
  const td = `padding:9px 8px 9px 0;vertical-align:top;border-bottom:1px solid ${C.line};font-family:${BODY};font-size:13px;line-height:1.45;color:${C.text}`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px">
<tr><th style="${th}">Godz.</th><th style="${th}">Numer</th><th style="${th}">Klient</th><th style="${th}">Produkty</th><th style="${th};text-align:center">✓</th></tr>
${rows
  .map(
    (r) => `<tr>
  <td style="${td};white-space:nowrap;font-weight:700">${esc(r.pickupTime ?? '')}</td>
  <td style="${td};white-space:nowrap">${esc(r.number)}</td>
  <td style="${td}">${esc(r.customerName)}<br><span style="color:${C.muted};white-space:nowrap">${esc(formatPhone(r.customerPhone))}</span></td>
  <td style="${td}">${r.items.map((i) => `${esc(i.productName)}&nbsp;×&nbsp;${i.quantity}`).join('<br>')}${
    r.notes
      ? `<div style="margin-top:4px;color:${C.gold};font-weight:700">Uwagi: ${esc(r.notes)}</div>`
      : ''
  }</td>
  <td style="${td};text-align:center;font-size:18px;color:${C.line}">☐</td>
</tr>`,
  )
  .join('')}</table>`;
}

export function dailySummaryEmail(
  s: DailySummary,
  to: string,
  adminUrl: string,
  webUrl: string,
): MailMessage {
  const day = capitalize(formatPickupDate(s.date));
  const points = s.points
    .map(
      (p) => `<tr><td style="padding:28px 32px 0">
  ${label(p.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia')}
  <div style="margin-top:4px;font-family:${HEADING};font-size:20px;letter-spacing:1px;text-transform:uppercase;color:${C.text}">${esc(p.label)}</div>
  <div style="margin-top:2px;font-family:${BODY};font-size:13px;color:${C.muted}">Rezerwacji: ${p.reservations.length}</div>
  <div style="margin-top:14px;font-family:${BODY};font-size:13px;font-weight:700;color:${C.text}">Do przygotowania</div>
  ${productsTable(p.products)}
  <div style="margin-top:18px;font-family:${BODY};font-size:13px;font-weight:700;color:${C.text}">Rezerwacje</div>
  ${reservationsTable(p.reservations)}
</td></tr>`,
    )
    .join(
      `<tr><td style="padding:28px 32px 0"><div style="border-top:2px dashed ${C.line}"></div></td></tr>`,
    );

  const body =
    s.reservationsCount === 0
      ? `<tr><td style="padding:28px 32px;font-family:${BODY};font-size:16px;color:${C.text}">Na ten dzień nie ma rezerwacji.</td></tr>`
      : `<tr><td style="padding:28px 32px 0">
  ${label('Razem – wszystkie punkty')}
  ${productsTable(s.totals, true)}
</td></tr>
${points}`;

  const html = `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<style>${emailFontFaces(webUrl)}</style>
<title>Do przygotowania – ${esc(day)}</title></head>
<body style="margin:0;padding:0;background:${C.soft}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.soft}" style="background:${C.soft}">
<tr><td align="center" style="padding:24px 10px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="max-width:720px;background:#ffffff;border:1px solid ${C.line}">
<tr><td bgcolor="${C.ink}" style="background:${C.ink};padding:20px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td><img src="cid:${LOGO_CID}" width="190" alt="Chleba Smak" style="display:block;width:190px;height:auto;border:0;color:#f4efe6"></td>
    <td align="right" style="font-family:${HEADING};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#c9a36a">Zestawienie rezerwacji</td>
  </tr></table>
</td></tr>
<tr><td style="padding:28px 32px 0">
  ${label('Do przygotowania na')}
  <div style="margin-top:6px;font-family:${HEADING};font-weight:500;font-size:28px;letter-spacing:1.5px;text-transform:uppercase;color:${C.text}">${esc(day)}</div>
  <div style="margin-top:6px;font-family:${BODY};font-size:14px;color:${C.muted}">Rezerwacji łącznie: <strong style="color:${C.text}">${s.reservationsCount}</strong> · lista zamknięta o 18:00, bez anulowanych</div>
</td></tr>
${body}
<tr><td style="padding:32px;font-family:${BODY};font-size:12px;line-height:1.6;color:${C.muted}">
  Płatność przy odbiorze. Szczegóły i zmiana statusów: <a href="${esc(adminUrl)}" style="color:${C.gold}">panel administracyjny</a>.<br>
  Wiadomość wysłana automatycznie do ${esc(to)}.
</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `Do przygotowania na ${day} – rezerwacji: ${s.reservationsCount}`,
    '',
    'RAZEM:',
    ...s.totals.map((t) => `  ${t.name} × ${t.quantity}`),
    ...s.points.flatMap((p) => [
      '',
      `${p.pickupType === 'VAN' ? 'CHLEBOWÓZ' : 'PIEKARNIA'}: ${p.label}`,
      ...p.products.map((t) => `  ${t.name} × ${t.quantity}`),
      ...p.reservations.map(
        (r) =>
          `  - ${r.pickupTime ?? ''} ${r.number} ${r.customerName} ${formatPhone(r.customerPhone)}: ${r.items
            .map((i) => `${i.productName} × ${i.quantity}`)
            .join(', ')}${r.notes ? ` (uwagi: ${r.notes})` : ''}`,
      ),
    ]),
  ].join('\n');

  return {
    to,
    subject: `Do przygotowania: ${day} – ${s.reservationsCount} rez.`,
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
