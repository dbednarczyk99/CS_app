import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
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

  constructor(config: ConfigService) {
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

  /** Wysyłka „w tle” – błąd poczty nie może zablokować rezerwacji */
  send(message: MailMessage): void {
    if (!this.transporter) {
      this.logger.log(`[bez SMTP] ${message.to}: ${message.subject}`);
      return;
    }
    this.transporter
      .sendMail({ from: this.from, ...message })
      .then(() =>
        this.logger.log(`Wysłano: ${message.subject} → ${message.to}`),
      )
      .catch((error: unknown) =>
        this.logger.error(
          `Nie udało się wysłać „${message.subject}” do ${message.to}`,
          error as Error,
        ),
      );
  }
}
