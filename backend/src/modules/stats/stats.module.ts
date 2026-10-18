import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

/** Globalny – licznik e-maili w MailService i zdarzenia ze strony */
@Global()
@Module({
  providers: [StatsService, PrismaService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
