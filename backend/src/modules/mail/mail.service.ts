import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { StatsService } from '../stats/stats.service';
import { ServicesService } from '../settings/services.service';

/** Rodzaj wiadomości – do statystyk (licznik wysłanych e-maili w panelu) */
export type MailCategory =
  | 'rezerwacja'
  | 'anulowanie'
  | 'zestawienie'
  | 'kontakt'
  | 'newsletter'
  | 'newsletter-zapis'
  | 'konto';

export interface MailMessage {
  /** rodzaj wiadomości (statystyki); nie trafia do samego e-maila */
  category?: MailCategory;
  to: string;
  /** adres dla „Odpowiedz” (np. nadawca formularza kontaktowego) */
  replyTo?: string;
  /** dodatkowe nagłówki, np. List-Unsubscribe w newsletterze */
  headers?: Record<string, string>;
  subject: string;
  html: string;
  text: string;
  /** obrazki wbudowane w treść (np. logo), w HTML jako src="cid:<cid>" */
  attachments?: { filename: string; path: string; cid: string }[];
}

/**
 * Wysyłka e-maili przez SMTP. Lokalnie Mailpit (docker compose, podgląd http://localhost:8025),
 * na produkcji dowolny dostawca SMTP, np. Resend. Bez SMTP_HOST maile są tylko logowane.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(
    config: ConfigService,
    private readonly stats: StatsService,
    private readonly services: ServicesService,
  ) {
    const host = config.get<string>('SMTP_HOST');
    const port = Number(config.get<string>('SMTP_PORT') ?? 587);
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    this.from =
      config.get<string>('MAIL_FROM') ??
      'Chleba Smak <rezerwacje@chlebasmak.pl>';
    this.transporter = host
      ? createTransport({
          host,
          port,
          secure: port === 465,
          auth: user ? { user, pass } : undefined,
        })
      : null;
    if (!host)
      this.logger.warn(
        'SMTP_HOST nie jest ustawiony – e-maile nie będą wysyłane',
      );
  }

  /** Czy e-maile są teraz wysyłane (wyłącznik i limit dzienny w „Usługi i koszty”) – np. do komunikatów na stronie */
  async available(): Promise<boolean> {
    return (await this.services.state('emails')).available;
  }

  /**
   * Wysyłka „w tle” – błąd poczty nie może zablokować rezerwacji. Wyłączone e-maile albo wykorzystany limit
   * dzienny – wiadomość nie wychodzi (licznik „mail_blocked” w statystykach).
   */
  send(message: MailMessage): void {
    void this.services.consume('emails').then((allowed) => {
      if (allowed) this.deliver(message);
      else this.stats.increment('mail_blocked', message.category ?? 'inne');
    });
  }

  /**
   * Wiadomości o koncie (reset hasła) wychodzą także przy wyłączonych e-mailach i po limicie dziennym –
   * inaczej właściciel nie odzyskałby dostępu do panelu, w którym e-maile się włącza. Własne limity ma AuthService.
   */
  sendAccount(message: MailMessage): void {
    this.deliver(message);
  }

  private deliver(message: MailMessage): void {
    if (!this.transporter) {
      this.logger.log(`[bez SMTP] ${message.to}: ${message.subject}`);
      return;
    }
    const { category = 'inne', ...mail } = message;
    this.transporter
      .sendMail({ from: this.from, ...mail })
      .then(() => {
        this.logger.log(`Wysłano: ${message.subject} → ${message.to}`);
        // licznik do statystyk w panelu (limity planu dostawcy)
        this.stats.increment('mail', category);
      })
      .catch((error: unknown) => {
        this.logger.error(
          `Nie udało się wysłać „${message.subject}” do ${message.to}`,
          error as Error,
        );
        this.stats.increment('mail_failed', category);
      });
  }
}
