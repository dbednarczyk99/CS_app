import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsJobs } from './reservations.jobs';
import { ReservationsService } from './reservations.service';

@Module({
  providers: [ReservationsService, ReservationsJobs, PrismaService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
