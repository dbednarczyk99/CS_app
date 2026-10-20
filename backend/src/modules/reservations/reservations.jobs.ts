import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SettingsService } from '../settings/settings.service';
import type { ReservationSettings } from '../settings/reservation-settings';
import { addDays, warsawNow } from './reservation-rules';
import { ReservationsService } from './reservations.service';

const SUMMARY_JOB = 'daily-summary';

/** Zadania cykliczne rezerwacji (czas polski) */
@Injectable()
export class ReservationsJobs implements OnModuleInit {
  private readonly logger = new Logger(ReservationsJobs.name);

  constructor(
    private readonly reservations: ReservationsService,
    private readonly settings: SettingsService,
    private readonly scheduler: SchedulerRegistry,
  ) {}

  async onModuleInit() {
    this.scheduleSummary(await this.settings.reservations());
    // zmiana godziny w panelu – nowy termin od razu, bez restartu serwera
    this.settings.onReservationsChange((s) => this.scheduleSummary(s));
  }

  /**
   * Codziennie o godzinie z ustawień (domyślnie 18:30, po zamknięciu listy) – zestawienie na jutro.
   * Wyłączone w ustawieniach – zadanie istnieje, ale nic nie wysyła.
   */
  private scheduleSummary({ summaryTime }: ReservationSettings) {
    if (this.scheduler.doesExist('cron', SUMMARY_JOB))
      this.scheduler.deleteCronJob(SUMMARY_JOB);
    const [hour, minute] = summaryTime.split(':').map(Number);
    const job = CronJob.from({
      cronTime: `${minute} ${hour} * * *`,
      timeZone: 'Europe/Warsaw',
      onTick: () => void this.dailySummary(),
    });
    this.scheduler.addCronJob(SUMMARY_JOB, job);
    job.start();
  }

  private async dailySummary() {
    const settings = await this.settings.reservations();
    if (!settings.summaryEnabled) return;
    const tomorrow = addDays(warsawNow().date, 1);
    try {
      const result = await this.reservations.sendDailySummary(tomorrow);
      this.logger.log(
        `Wysłano zestawienie na ${tomorrow} do ${result.sentTo} (${result.reservationsCount} rez.)`,
      );
    } catch (error) {
      this.logger.error(
        `Nie udało się wysłać zestawienia na ${tomorrow}`,
        error,
      );
    }
  }

  /** Codziennie o 3:00 – anonimizacja danych klientów w rezerwacjach złożonych ponad 6 miesięcy temu */
  @Cron('0 3 * * *', { timeZone: 'Europe/Warsaw' })
  async purge() {
    const result = await this.reservations.anonymizeOld();
    if (result.anonymized > 0) {
      this.logger.log(
        `Zanonimizowano ${result.anonymized} rezerwacji złożonych przed ${result.createdBefore}`,
      );
    }
  }
}
