import { randomBytes } from 'crypto';
import { readFile } from 'fs/promises';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import type { EmailContext } from '../reservations/reservation-emails';
import type { SubscribeDto } from './dto/newsletter.dto';
import { logoAttachment } from '../reservations/reservation-emails';
import {
  newsletterArticleEmail,
  newsletterConfirmEmail,
} from './newsletter-emails';
import { productIdsIn, type TileProduct } from './product-tiles';
import { isLabelActive, isPromoActive, withPromo } from '../products/promo';

const WINDOW_MS = 15 * 60 * 1000;
const PER_IP_LIMIT = 5; // zapisów z jednego adresu IP w oknie 15 min
const PENDING_DAYS = 7; // niepotwierdzone zapisy usuwane po tylu dniach

/**
 * Newsletter z podwójnym potwierdzeniem (double opt-in): zapis → e-mail z linkiem → potwierdzenie.
 * Odpowiedź na zapis jest zawsze taka sama (nie zdradza, czy adres już jest na liście).
 */
@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);
  private readonly attempts: { ip: string; at: number }[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async subscribe(dto: SubscribeDto, ip: string) {
    if (dto.website) return { ok: true }; // bot – udajemy sukces

    const now = Date.now();
    while (this.attempts.length && now - this.attempts[0].at > WINDOW_MS)
      this.attempts.shift();
    if (this.attempts.filter((a) => a.ip === ip).length >= PER_IP_LIMIT) {
      throw new HttpException(
        'Zbyt wiele prób zapisu. Spróbuj ponownie za kwadrans.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    this.attempts.push({ ip, at: now });

    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email: dto.email },
    });
    if (existing?.status === 'CONFIRMED') return { ok: true };

    // nowy zapis albo ponowny (oczekujący / wypisany) – nowy token i świeża zgoda
    const token = randomBytes(24).toString('hex');
    await this.prisma.newsletterSubscriber.upsert({
      where: { email: dto.email },
      create: { email: dto.email, token, consentAt: new Date() },
      update: {
        status: 'PENDING',
        token,
        consentAt: new Date(),
        confirmedAt: null,
        unsubscribedAt: null,
      },
    });
    this.mail.send(
      newsletterConfirmEmail(dto.email, token, await this.emailContext()),
    );
    return { ok: true };
  }

  async confirm(token: string) {
    const subscriber = await this.byToken(token);
    if (subscriber.status === 'CONFIRMED')
      return { status: 'already-confirmed' as const };
    if (subscriber.status === 'UNSUBSCRIBED')
      return { status: 'unsubscribed' as const };
    await this.prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
    return { status: 'confirmed' as const };
  }

  async unsubscribe(token: string) {
    const subscriber = await this.byToken(token);
    if (subscriber.status !== 'UNSUBSCRIBED') {
      await this.prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { status: 'UNSUBSCRIBED', unsubscribedAt: new Date() },
      });
    }
    return { status: 'unsubscribed' as const };
  }

  /**
   * Wysyłka wpisu z bloga do potwierdzonych subskrybentów – tylko raz na artykuł (atomowe „zajęcie”
   * przez newsletterSentAt chroni przed podwójną wysyłką przy szybkich zapisach).
   */
  async sendArticle(articleId: string) {
    const claimed = await this.prisma.article.updateMany({
      // zaplanowany wpis – dopiero po czasie publikacji
      where: {
        id: articleId,
        sendAsNewsletter: true,
        newsletterSentAt: null,
        OR: [{ publishAt: null }, { publishAt: { lte: new Date() } }],
      },
      data: { newsletterSentAt: new Date() },
    });
    if (claimed.count === 0) return;

    const [article, subscribers, ctx] = await Promise.all([
      this.prisma.article.findUnique({
        where: { id: articleId },
        include: { images: { orderBy: { order: 'asc' }, take: 1 } },
      }),
      this.prisma.newsletterSubscriber.findMany({
        where: { status: 'CONFIRMED' },
        select: { email: true, token: true },
      }),
      this.emailContext(),
    ]);
    if (!article) return;
    const products = await this.tileProducts(article.content);

    for (const subscriber of subscribers) {
      this.mail.send(
        newsletterArticleEmail(
          { ...article, imageUrl: article.images[0]?.imgUrl },
          subscriber,
          ctx,
          products,
        ),
      );
    }
    await this.prisma.article.update({
      where: { id: articleId },
      data: { newsletterRecipients: subscribers.length },
    });
    this.logger.log(
      `Newsletter „${article.title}” – wysłano do ${subscribers.length} os.`,
    );
  }

  /**
   * Podgląd e-maila z wersji roboczej wpisu (panel, bez zapisu i wysyłki): HTML z logo wstawionym
   * bezpośrednio (w prawdziwej wysyłce logo jest załącznikiem).
   */
  async preview(draft: {
    id?: string;
    title: string;
    shortDescription: string;
    content: string;
    isPublished: boolean;
    imageUrl?: string | null;
  }) {
    const [ctx, products] = await Promise.all([
      this.emailContext(),
      this.tileProducts(draft.content),
    ]);
    const message = newsletterArticleEmail(
      { ...draft, id: draft.id ?? 'podglad' },
      { email: 'podglad@example.com', token: 'podglad' },
      ctx,
      products,
    );
    const logo = await readFile(logoAttachment().path)
      .then((b) => `data:image/png;base64,${b.toString('base64')}`)
      .catch(() => '');
    return {
      subject: message.subject,
      html: message.html.replace(/cid:logo@chlebasmak/g, logo),
    };
  }

  /** Produkty z kafelków w treści – aktywne, z ceną i etykietami z dnia wysyłki (jak na stronie) */
  private async tileProducts(content: string) {
    const ids = productIdsIn(content);
    if (ids.length === 0) return new Map<string, TileProduct>();
    const [products, promoLabel] = await Promise.all([
      this.prisma.product.findMany({
        where: { id: { in: ids }, isActive: true },
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          labels: { orderBy: [{ order: 'asc' }, { name: 'asc' }] },
        },
      }),
      this.prisma.productLabel.findUnique({ where: { system: 'promo' } }),
    ]);
    return new Map(
      products.map((p) => {
        const labels = p.labels.filter((l) => isLabelActive(l));
        if (isPromoActive(p))
          labels.push(
            promoLabel ??
              ({
                name: 'Promocja',
                color: 'red',
                order: 0,
              } as (typeof labels)[number]),
          );
        labels.sort((a, b) => a.order - b.order);
        return [
          p.id.toLowerCase(),
          {
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            price: p.price,
            currentPrice: withPromo(p).currentPrice,
            imageUrl: p.images[0]?.imgUrl ?? null,
            labels: labels.map((l) => ({ name: l.name, color: l.color })),
          } satisfies TileProduct,
        ];
      }),
    );
  }

  /* --- panel --- */

  async stats() {
    const [confirmed, pending] = await Promise.all([
      this.prisma.newsletterSubscriber.count({
        where: { status: 'CONFIRMED' },
      }),
      this.prisma.newsletterSubscriber.count({ where: { status: 'PENDING' } }),
    ]);
    return { confirmed, pending };
  }

  findAll() {
    return this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        consentAt: true,
        confirmedAt: true,
        unsubscribedAt: true,
        createdAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.newsletterSubscriber.delete({ where: { id } });
    return { id };
  }

  /** Codziennie o 3:30 – usunięcie niepotwierdzonych zapisów starszych niż 7 dni (minimalizacja danych) */
  @Cron('30 3 * * *', { timeZone: 'Europe/Warsaw' })
  async removeStalePending() {
    const { count } = await this.prisma.newsletterSubscriber.deleteMany({
      where: {
        status: 'PENDING',
        consentAt: {
          lt: new Date(Date.now() - PENDING_DAYS * 24 * 60 * 60 * 1000),
        },
      },
    });
    if (count)
      this.logger.log(
        `Usunięto niepotwierdzone zapisy do newslettera: ${count}`,
      );
  }

  private async byToken(token: string) {
    const subscriber = await this.prisma.newsletterSubscriber.findUnique({
      where: { token },
    });
    if (!subscriber)
      throw new NotFoundException('Link jest nieprawidłowy albo wygasł');
    return subscriber;
  }

  private async emailContext(): Promise<EmailContext> {
    const [contact, media] = await Promise.all([
      this.prisma.contactInfo.findFirst({ where: { type: 'EMAIL' } }),
      this.prisma.media.findMany(),
    ]);
    return {
      webUrl: this.config.get<string>('WEB_URL') ?? 'http://localhost:3001',
      contactEmail: contact?.value ?? null,
      social: media.map((m) => ({ name: m.name, url: m.url })),
    };
  }
}
