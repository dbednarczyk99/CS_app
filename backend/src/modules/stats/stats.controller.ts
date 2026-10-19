import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { IsIn, IsString, MaxLength } from 'class-validator';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import type { StaffRequest } from '../auth/auth.guard';
import {
  MAP_KEYS,
  SOURCE_KEYS,
  StatsService,
  VIEW_KEYS,
} from './stats.service';

class StatEventDto {
  @IsIn(['view', 'map', 'source'])
  type: 'view' | 'map' | 'source';

  @IsString()
  @MaxLength(60)
  key: string;
}

// ochrona przed nabijaniem licznika: zdarzeń z jednego adresu w oknie 10 min
const PER_IP_LIMIT = 300;
const WINDOW_MS = 10 * 60 * 1000;
// roboty wyszukiwarek, podglądy linków, przeglądarki sterowane automatycznie
const BOT =
  /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|java\//i;

@Controller('stats')
export class StatsController {
  private readonly hits: { ip: string; at: number }[] = [];

  constructor(private readonly service: StatsService) {}

  /**
   * Odsłona podstrony / wczytanie mapy – wysyła strona (przez własny serwer, który przekazuje
   * adres klienta i przeglądarkę). Nie zapisujemy adresów IP – służą tylko do limitu w pamięci.
   */
  @Public()
  @Post('event')
  @HttpCode(204)
  event(
    @Body() dto: StatEventDto,
    @Ip() ip: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('user-agent') userAgent = '',
  ) {
    if (BOT.test(userAgent)) return;
    const allowed = { view: VIEW_KEYS, map: MAP_KEYS, source: SOURCE_KEYS }[
      dto.type
    ];
    if (!allowed.includes(dto.key)) return;

    const client = forwardedFor?.split(',')[0]?.trim() || ip;
    const now = Date.now();
    while (this.hits.length && now - this.hits[0].at > WINDOW_MS)
      this.hits.shift();
    if (this.hits.filter((h) => h.ip === client).length >= PER_IP_LIMIT) return;
    this.hits.push({ ip: client, at: now });

    this.service.increment(dto.type, dto.key);
  }

  /**
   * Zestawienie dla panelu. Właściciel – całość (limity, koszty, e-maile, rezerwacje);
   * treści strony (marketing) – tylko odwiedziny, źródła ruchu i najczęściej odwiedzane podstrony.
   */
  @Roles(...CONTENT_ROLES)
  @Get()
  async summary(
    @Query('days') days: string | undefined,
    @Req() req: StaffRequest,
  ) {
    const n = Math.min(90, Math.max(7, Number(days) || 30));
    const full = await this.service.summary(n);
    if (req.user?.role === 'ADMIN') return full;
    return {
      today: full.today,
      month: {
        start: full.month.start,
        dayOfMonth: full.month.dayOfMonth,
        daysInMonth: full.month.daysInMonth,
        views: full.month.views,
      },
      todayTotals: { views: full.todayTotals.views },
      series: full.series.map(({ date, views }) => ({ date, views })),
      pages: full.pages,
      sources: full.sources,
    };
  }
}
