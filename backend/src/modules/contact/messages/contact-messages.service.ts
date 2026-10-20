import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../mail/mail.service';
import { contactMessageEmail } from './contact-message-email';
import type { ContactMessageDto } from './dto/contact-message.dto';

const WINDOW_MS = 15 * 60 * 1000;
const PER_IP_LIMIT = 5; // wiadomości z jednego adresu IP w oknie 15 min
const GLOBAL_LIMIT = 60; // wszystkich wiadomości w oknie 15 min (ochrona skrzynki przed zalewem)

/**
 * Formularz kontaktowy → e-mail do piekarni. Odbiorca wyłącznie z CONTACT_EMAIL
 * (celowo bez zapasowego adresu z panelu). Nic nie jest zapisywane w bazie.
 */
@Injectable()
export class ContactMessagesService {
  private readonly logger = new Logger(ContactMessagesService.name);
  private readonly sent: { ip: string; at: number }[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async send(dto: ContactMessageDto, ip: string) {
    // bot wypełnił ukryte pole – udajemy sukces, nic nie wysyłamy
    if (dto.website) return { ok: true };

    // e-maile wyłączone w „Usługi i koszty” albo limit dzienny – formularz nie zadziała
    if (!(await this.mail.available()))
      throw new ServiceUnavailableException(
        'Formularz jest chwilowo niedostępny. Zadzwoń do nas albo napisz bezpośrednio na adres e-mail podany obok.',
      );

    const to = this.config.get<string>('CONTACT_EMAIL');
    if (!to) {
      this.logger.warn(
        'CONTACT_EMAIL nie jest ustawiony – wiadomość z formularza nie została wysłana',
      );
      throw new ServiceUnavailableException(
        'Formularz jest chwilowo niedostępny. Napisz do nas e-mailem lub zadzwoń.',
      );
    }

    const now = Date.now();
    while (this.sent.length && now - this.sent[0].at > WINDOW_MS)
      this.sent.shift();
    if (
      this.sent.length >= GLOBAL_LIMIT ||
      this.sent.filter((s) => s.ip === ip).length >= PER_IP_LIMIT
    ) {
      throw new HttpException(
        'Wysłano już kilka wiadomości. Spróbuj ponownie za kwadrans.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    this.sent.push({ ip, at: now });

    const webUrl =
      this.config.get<string>('WEB_URL') ?? 'http://localhost:3001';
    this.mail.send(contactMessageEmail(dto, to, webUrl));
    return { ok: true };
  }
}
