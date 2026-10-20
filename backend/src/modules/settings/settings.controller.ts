import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { OWNER_ROLES, Public, Roles } from '../auth/auth.decorators';
import type { StaffRequest } from '../auth/auth.guard';
import { SettingsService } from './settings.service';
import { ServicesService } from './services.service';

/** Ustawienia właściciela: zasady rezerwacji i dokumenty prawne (tylko ADMIN; dokumenty i zasady – też dla strony) */
@Roles(...OWNER_ROLES)
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly service: SettingsService,
    private readonly services: ServicesService,
  ) {}

  /* ---------- wyłączniki kosztów (usługi płatne) ---------- */

  /** Strona: które usługi działają teraz (mapa, e-maile, oceny) – do zamienników */
  @Public()
  @Get('services/public')
  servicesStatus() {
    return this.services.publicStatus();
  }

  @Get('services')
  servicesForPanel() {
    return this.services.forPanel();
  }

  @Get('services/revisions')
  servicesRevisions() {
    return this.services.revisions();
  }

  @Put('services')
  saveServices(@Body() body: unknown, @Req() req: StaffRequest) {
    return this.services.save(body, req.user?.sub);
  }

  /* ---------- zasady rezerwacji ---------- */

  /** Strona: zasady do tekstów (formularz, regulamin) – bez adresów e-mail zestawienia */
  @Public()
  @Get('reservations/public')
  publicRules() {
    return this.service.publicRules();
  }

  @Get('reservations')
  reservations() {
    return this.service.reservationsForPanel();
  }

  @Get('reservations/revisions')
  reservationRevisions() {
    return this.service.reservationRevisions();
  }

  @Put('reservations')
  saveReservations(@Body() body: unknown, @Req() req: StaffRequest) {
    return this.service.saveReservations(body, req.user?.sub);
  }

  /* ---------- dokumenty prawne ---------- */

  /** Strona: treść dokumentu (np. /settings/legal/regulamin) */
  @Public()
  @Get('legal/:doc')
  legal(@Param('doc') doc: string) {
    return this.service.legal(this.service.doc(doc));
  }

  @Get('legal/:doc/panel')
  legalForPanel(@Param('doc') doc: string) {
    return this.service.legalForPanel(this.service.doc(doc));
  }

  @Get('legal/:doc/revisions')
  legalRevisions(@Param('doc') doc: string) {
    return this.service.legalRevisions(this.service.doc(doc));
  }

  @Put('legal/:doc')
  saveLegal(
    @Param('doc') doc: string,
    @Body() body: unknown,
    @Req() req: StaffRequest,
  ) {
    return this.service.saveLegal(this.service.doc(doc), body, req.user?.sub);
  }
}
