import { readFileSync } from 'fs';
import { join } from 'path';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { addRevision, listRevisions } from '../content/revisions';
import {
  type PublicReservationRules,
  type ReservationSettings,
  validateReservationSettings,
} from './reservation-settings';

const RESERVATIONS_KEY = 'settings.reservations';
/** ustawień i dokumentów prawnych nie przycinamy – historia zmian zostaje cała (pokazujemy 50 ostatnich) */
const REVISIONS_SHOWN = 50;

/** Dokumenty prawne: adres na stronie → plik z wersją domyślną (backend/content/prawne) */
export const LEGAL_DOCS = {
  regulamin: { file: 'regulamin-rezerwacji.md', title: 'Regulamin rezerwacji' },
  'polityka-prywatnosci': {
    file: 'polityka-prywatnosci.md',
    title: 'Polityka prywatności',
  },
} as const;
export type LegalDoc = keyof typeof LEGAL_DOCS;

const legalKey = (doc: LegalDoc) => `legal.${doc}`;
const MAX_LEGAL_LENGTH = 100_000;

/** Wersja domyślna dokumentu (projekt z repozytorium – do weryfikacji przez prawnika) */
export function legalDefault(doc: LegalDoc): string {
  return readFileSync(
    join(process.cwd(), 'content', 'prawne', LEGAL_DOCS[doc].file),
    'utf8',
  ).replace(/\r\n/g, '\n');
}

/**
 * Ustawienia właściciela: zasady rezerwacji i dokumenty prawne. Trzymane w SiteContent (klucz → JSON) jak treści
 * strony, z pełną historią zmian w ContentRevision. Zasady rezerwacji są w pamięci (czytane przy każdej rezerwacji).
 */
@Injectable()
export class SettingsService {
  private cached: ReservationSettings | null = null;
  private listeners: ((s: ReservationSettings) => void)[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /* ---------- zasady rezerwacji ---------- */

  /** Wartości domyślne – dotychczasowe zasady (i zestawienie z .env) */
  reservationDefaults(): ReservationSettings {
    const email = this.config.get<string>('SUMMARY_EMAIL');
    return {
      cutoffTime: '18:00',
      maxDaysAhead: 5,
      maxActivePerPhone: 3,
      summaryEnabled:
        this.config.get<string>('DAILY_SUMMARY_ENABLED') === 'true',
      summaryTime: '18:30',
      summaryEmails: email ? [email] : [],
    };
  }

  async reservations(): Promise<ReservationSettings> {
    if (this.cached) return this.cached;
    const row = await this.prisma.siteContent.findUnique({
      where: { key: RESERVATIONS_KEY },
    });
    this.cached = {
      ...this.reservationDefaults(),
      ...((row?.data as Partial<ReservationSettings> | undefined) ?? {}),
    };
    return this.cached;
  }

  async publicRules(): Promise<PublicReservationRules> {
    const { cutoffTime, maxDaysAhead, maxActivePerPhone } =
      await this.reservations();
    return { cutoffTime, maxDaysAhead, maxActivePerPhone };
  }

  /** Dla panelu: wartości, domyślne i data zmiany */
  async reservationsForPanel() {
    const row = await this.prisma.siteContent.findUnique({
      where: { key: RESERVATIONS_KEY },
    });
    return {
      value: await this.reservations(),
      defaults: this.reservationDefaults(),
      updatedAt: row?.updatedAt ?? null,
    };
  }

  async saveReservations(input: unknown, userId?: string) {
    const { value, errors } = validateReservationSettings(input);
    if (errors.length) throw new BadRequestException(errors);
    const before = await this.reservations();
    if (JSON.stringify(before) === JSON.stringify(value)) return value;
    await addRevision(this.prisma, RESERVATIONS_KEY, before, userId);
    await this.prisma.siteContent.upsert({
      where: { key: RESERVATIONS_KEY },
      create: {
        key: RESERVATIONS_KEY,
        data: value as unknown as Prisma.InputJsonValue,
      },
      update: { data: value as unknown as Prisma.InputJsonValue },
    });
    this.cached = value;
    for (const listener of this.listeners) listener(value);
    return value;
  }

  reservationRevisions() {
    return listRevisions(this.prisma, RESERVATIONS_KEY, REVISIONS_SHOWN);
  }

  /** Powiadomienie o zmianie zasad (np. przestawienie godziny zestawienia) */
  onReservationsChange(listener: (s: ReservationSettings) => void) {
    this.listeners.push(listener);
  }

  /* ---------- dokumenty prawne ---------- */

  doc(doc: string): LegalDoc {
    if (!(doc in LEGAL_DOCS))
      throw new NotFoundException('Nie ma takiego dokumentu');
    return doc as LegalDoc;
  }

  /** Dla strony: treść (zapisana w panelu albo domyślna) i data ostatniej zmiany */
  async legal(doc: LegalDoc) {
    const row = await this.prisma.siteContent.findUnique({
      where: { key: legalKey(doc) },
    });
    const saved = (row?.data as { markdown?: string } | undefined)?.markdown;
    return {
      title: LEGAL_DOCS[doc].title,
      markdown: saved ?? legalDefault(doc),
      updatedAt: row?.updatedAt ?? null,
    };
  }

  /** Dla panelu: jak wyżej + wersja domyślna */
  async legalForPanel(doc: LegalDoc) {
    return {
      ...(await this.legal(doc)),
      defaults: legalDefault(doc),
      customized: !!(await this.prisma.siteContent.findUnique({
        where: { key: legalKey(doc) },
        select: { key: true },
      })),
    };
  }

  async saveLegal(doc: LegalDoc, input: unknown, userId?: string) {
    const markdown = (
      typeof (input as { markdown?: unknown })?.markdown === 'string'
        ? (input as { markdown: string }).markdown
        : ''
    )
      .replace(/\r\n/g, '\n')
      .trim();
    if (markdown.length < 50)
      throw new BadRequestException(['Dokument jest pusty albo za krótki']);
    if (markdown.length > MAX_LEGAL_LENGTH)
      throw new BadRequestException([
        `Dokument jest za długi (najwyżej ${MAX_LEGAL_LENGTH} znaków)`,
      ]);
    const before = (await this.legal(doc)).markdown;
    if (before.trim() === markdown) return this.legal(doc);
    await addRevision(this.prisma, legalKey(doc), { markdown: before }, userId);
    await this.prisma.siteContent.upsert({
      where: { key: legalKey(doc) },
      create: { key: legalKey(doc), data: { markdown } },
      update: { data: { markdown } },
    });
    return this.legal(doc);
  }

  legalRevisions(doc: LegalDoc) {
    return listRevisions(this.prisma, legalKey(doc), REVISIONS_SHOWN);
  }
}
