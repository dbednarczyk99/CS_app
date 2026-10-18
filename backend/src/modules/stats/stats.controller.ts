import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Post,
  Query,
} from '@nestjs/common';
import { IsIn, IsString, MaxLength } from 'class-validator';
import { OWNER_ROLES, Public, Roles } from '../auth/auth.decorators';
import { MAP_KEYS, StatsService, VIEW_KEYS } from './stats.service';

class StatEventDto {
  @IsIn(['view', 'map'])
  type: 'view' | 'map';

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
    const allowed = dto.type === 'view' ? VIEW_KEYS : MAP_KEYS;
    if (!allowed.includes(dto.key)) return;

    const client = forwardedFor?.split(',')[0]?.trim() || ip;
    const now = Date.now();
    while (this.hits.length && now - this.hits[0].at > WINDOW_MS)
      this.hits.shift();
    if (this.hits.filter((h) => h.ip === client).length >= PER_IP_LIMIT) return;
    this.hits.push({ ip: client, at: now });

    this.service.increment(dto.type, dto.key);
  }

  /** Zestawienie dla panelu – tylko właściciel (koszty, rezerwacje) */
  @Roles(...OWNER_ROLES)
  @Get()
  summary(@Query('days') days?: string) {
    const n = Math.min(90, Math.max(7, Number(days) || 30));
    return this.service.summary(n);
  }
}
