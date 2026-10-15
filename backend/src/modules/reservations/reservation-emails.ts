import type { MailMessage } from '../mail/mail.service';
import { cancelDeadline } from './reservation-rules';

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

const C = {
  ink: '#141618',
  cream: '#f4efe6',
  gold: '#c9a36a',
  stone: '#6f6a62',
  line: '#e4dccd',
};

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:${C.cream};font-family:Arial,Helvetica,sans-serif;color:${C.ink}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${C.line}">
<tr><td style="background:${C.ink};padding:22px 28px;text-align:center">
  <div style="font-size:22px;letter-spacing:6px;color:${C.cream};font-weight:bold">CHLEBA SMAK</div>
  <div style="font-size:11px;letter-spacing:5px;color:${C.gold};margin-top:4px">PIEKARNIA RZEMIEŚLNICZA</div>
</td></tr>
<tr><td style="padding:28px">${body}</td></tr>
<tr><td style="border-top:1px solid ${C.line};padding:16px 28px;font-size:12px;color:${C.stone};text-align:center">
  Wiadomość wygenerowana automatycznie – prosimy na nią nie odpowiadać.<br>Chleba Smak · Kraków
</td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(r: ReservationForEmail): string {
  const rows = r.items
    .map(
      (i) => `<tr>
  <td style="padding:8px 0;border-bottom:1px solid ${C.line}">${esc(i.productName)}</td>
  <td style="padding:8px 0;border-bottom:1px solid ${C.line};text-align:center;white-space:nowrap">× ${i.quantity}</td>
  <td style="padding:8px 0;border-bottom:1px solid ${C.line};text-align:right;white-space:nowrap">${money(Number(i.unitPrice.toString()) * i.quantity)}</td>
</tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:8px">${rows}
<tr><td style="padding:12px 0 0;font-weight:bold">Razem do zapłaty przy odbiorze</td><td></td>
<td style="padding:12px 0 0;text-align:right;font-weight:bold;white-space:nowrap">${money(r.total)}</td></tr></table>`;
}

function pickupBlock(r: ReservationForEmail): string {
  const where = r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};margin:20px 0;font-size:14px">
<tr><td style="padding:16px 18px">
  <div style="font-size:11px;letter-spacing:3px;color:${C.stone}">ODBIÓR</div>
  <div style="font-size:17px;font-weight:bold;margin-top:6px">${esc(formatPickupDate(r.pickupDate))}${r.pickupTime ? `, ${esc(r.pickupTime)}` : ''}</div>
  <div style="margin-top:4px">${where}: ${esc(r.pickupLabel)}</div>
</td></tr></table>`;
}

export function reservationConfirmationEmail(
  r: ReservationForEmail,
  webUrl: string,
): MailMessage {
  const cancelUrl = `${webUrl}/rezerwacja/anuluj/${r.cancelToken}`;
  const deadline = cancelDeadline(r.pickupDate);
  const deadlineText = `${formatPickupDate(deadline.date)}, ${deadline.hour}`;

  const html = layout(
    `Rezerwacja ${r.number}`,
    `<h1 style="font-size:22px;margin:0">Dziękujemy, ${esc(r.customerName.split(' ')[0])}!</h1>
<p style="font-size:15px;line-height:1.6;margin:12px 0 0">Twoja rezerwacja została przyjęta. Pieczywo będzie na Ciebie czekać – płatność przy odbiorze.</p>
<p style="font-size:13px;color:${C.stone};margin:16px 0 0">Numer rezerwacji</p>
<p style="font-size:24px;letter-spacing:3px;font-weight:bold;color:${C.gold};margin:2px 0 0">${esc(r.number)}</p>
${pickupBlock(r)}
${itemsTable(r)}
${r.notes ? `<p style="font-size:14px;margin:20px 0 0"><strong>Uwagi:</strong> ${esc(r.notes)}</p>` : ''}
<p style="font-size:14px;line-height:1.6;margin:24px 0 0">Zmiana planów? Rezerwację możesz anulować do <strong>${esc(deadlineText)}</strong>.</p>
<p style="margin:16px 0 0"><a href="${cancelUrl}" style="display:inline-block;border:1px solid ${C.ink};color:${C.ink};text-decoration:none;padding:10px 20px;font-size:13px;letter-spacing:2px">ANULUJ REZERWACJĘ</a></p>`,
  );

  const text = [
    `Dziękujemy! Rezerwacja ${r.number} została przyjęta.`,
    '',
    `Odbiór: ${formatPickupDate(r.pickupDate)}${r.pickupTime ? `, ${r.pickupTime}` : ''}`,
    `${r.pickupType === 'VAN' ? 'Chlebowóz' : 'Piekarnia'}: ${r.pickupLabel}`,
    '',
    ...r.items.map((i) => `- ${i.productName} × ${i.quantity}`),
    `Razem do zapłaty przy odbiorze: ${money(r.total)}`,
    r.notes ? `Uwagi: ${r.notes}` : '',
    '',
    `Anulowanie (do ${deadlineText}): ${cancelUrl}`,
  ].join('\n');

  return {
    to: r.customerEmail,
    subject: `Rezerwacja ${r.number} przyjęta – Chleba Smak`,
    html,
    text,
  };
}

export function reservationCancelledEmail(r: ReservationForEmail): MailMessage {
  const html = layout(
    `Rezerwacja ${r.number} anulowana`,
    `<h1 style="font-size:22px;margin:0">Rezerwacja anulowana</h1>
<p style="font-size:15px;line-height:1.6;margin:12px 0 0">Rezerwacja <strong>${esc(r.number)}</strong> na ${esc(formatPickupDate(r.pickupDate))} została anulowana. Do zobaczenia następnym razem!</p>
${pickupBlock(r)}
${itemsTable(r)}`,
  );
  const text = `Rezerwacja ${r.number} na ${formatPickupDate(r.pickupDate)} została anulowana.`;
  return {
    to: r.customerEmail,
    subject: `Rezerwacja ${r.number} anulowana – Chleba Smak`,
    html,
    text,
  };
}
