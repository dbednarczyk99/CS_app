import { Module } from '@nestjs/common';
import { NewsletterModule } from '../newsletter/newsletter.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsJobs } from './reservations.jobs';
import { ReservationsService } from './reservations.service';

@Module({
  // zapis do newslettera z formularza rezerwacji
  imports: [NewsletterModule],
  providers: [ReservationsService, ReservationsJobs, PrismaService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
