import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  providers: [ReservationsService, PrismaService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
