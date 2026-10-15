import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  Equals,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PickupType } from '@prisma/client';

class ReservationItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(50)
  quantity: number;
}

export class CreateReservationDto {
  @IsEnum(PickupType)
  pickupType: PickupType;

  /** id piekarni (STORE) albo przystanku chlebowozu (VAN) */
  @IsString()
  pointId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Nieprawidłowa data odbioru' })
  pickupDate: string;

  /** wymagana dla piekarni, ignorowana dla chlebowozu */
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Nieprawidłowa godzina odbioru' })
  pickupTime?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  customerName: string;

  @IsString()
  @MaxLength(20)
  customerPhone: string;

  @IsEmail({}, { message: 'Nieprawidłowy adres e-mail' })
  @MaxLength(200)
  customerEmail: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @Equals(true, { message: 'Wymagana zgoda na przetwarzanie danych' })
  consent: boolean;

  /** pole-pułapka na boty – ukryte na stronie, musi zostać puste */
  @IsOptional()
  @IsString()
  website?: string;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Rezerwacja musi zawierać co najmniej jeden produkt',
  })
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ReservationItemDto)
  items: ReservationItemDto[];
}
