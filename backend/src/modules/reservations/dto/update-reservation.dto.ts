import { IsEnum } from 'class-validator';
import { ReservationStatus } from '@prisma/client';

/** Panel admina zmienia tylko status rezerwacji */
export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
