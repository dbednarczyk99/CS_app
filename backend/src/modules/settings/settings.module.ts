import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { ServicesService } from './services.service';

/** Globalny – zasady rezerwacji czytają rezerwacje (formularz, anulowanie, e-maile, zestawienie) */
@Global()
@Module({
  providers: [SettingsService, ServicesService, PrismaService],
  controllers: [SettingsController],
  exports: [SettingsService, ServicesService],
})
export class SettingsModule {}
