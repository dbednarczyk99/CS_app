import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { addDays, warsawNow } from './reservation-rules';
import { ReservationsService } from './reservations.service';

/** Zadania cykliczne rezerwacji (czas polski) */
@Injectable()
export class ReservationsJobs {
  private readonly logger = new Logger(ReservationsJobs.name);

  constructor(
    private readonly reservations: ReservationsService,
    private readonly config: ConfigService,
  ) {}

  /** Codziennie o 18:30 – zestawienie na jutro (lista jest już zamknięta). Włączane DAILY_SUMMARY_ENABLED=true */
  @Cron('30 18 * * *', { timeZone: 'Europe/Warsaw' })
  async dailySummary() {
    if (this.config.get<string>('DAILY_SUMMARY_ENABLED') !== 'true') return;
    const tomorrow = addDays(warsawNow().date, 1);
    const result = await this.reservations.sendDailySummary(tomorrow);
    this.logger.log(
      `Wysłano zestawienie na ${tomorrow} do ${result.sentTo} (${result.reservationsCount} rez.)`,
    );
  }

  /** Codziennie o 3:00 – usuwanie rezerwacji starszych niż okres przechowywania */
  @Cron('0 3 * * *', { timeZone: 'Europe/Warsaw' })
  async purge() {
    const result = await this.reservations.purgeOld();
    if (result.deleted > 0) {
      this.logger.log(
        `Usunięto ${result.deleted} rezerwacji z odbiorem przed ${result.olderThan}`,
      );
    }
  }
}
