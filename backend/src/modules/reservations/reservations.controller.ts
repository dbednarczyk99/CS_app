import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Public, Roles, RESERVATION_ROLES } from '../auth/auth.decorators';
import { ClientIp } from '../auth/client-ip';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { SendSummaryDto } from './dto/send-summary.dto';
import { ReservationsService } from './reservations.service';

@Roles(...RESERVATION_ROLES)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  /* --- publiczne (strona) – trasy stałe przed ':id' --- */

  @Public()
  @Get('options')
  options() {
    return this.service.options();
  }

  @Public()
  @Post()
  create(@Body() dto: CreateReservationDto, @ClientIp() ip: string) {
    return this.service.create(dto, ip);
  }

  @Public()
  @Get('cancel/:token')
  byToken(@Param('token') token: string) {
    return this.service.publicByToken(token);
  }

  @Public()
  @Post('cancel/:token')
  cancel(@Param('token') token: string) {
    return this.service.cancelByToken(token);
  }

  /* --- panel admina --- */

  @Post('summary/send')
  sendSummary(@Body() dto: SendSummaryDto) {
    return this.service.sendDailySummary(dto.date, dto.to);
  }

  @Get('summary')
  summary(@Query('date') date: string) {
    return this.service.summary(date);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('pickupDate') pickupDate?: string,
    @Query('pickupType') pickupType?: string,
    @Query('q') q?: string,
  ) {
    return this.service.findAll({ status, pickupDate, pickupType, q });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  /** usunięcie danych klienta na jego żądanie (RODO) */
  @Post(':id/anonymize')
  anonymize(@Param('id') id: string) {
    return this.service.anonymize(id);
  }
}
