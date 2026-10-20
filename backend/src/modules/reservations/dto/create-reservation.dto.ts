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
  IsBoolean,
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

  /** szacowana godzina odbioru – z listy terminów piekarni lub postoju chlebowozu */
  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Nieprawidłowa godzina odbioru' })
  pickupTime?: string;

  /** samo imię – minimalizacja danych (RODO), wystarczy do zawołania klienta przy odbiorze */
  @IsString()
  @MinLength(2, { message: 'Podaj imię' })
  @MaxLength(50)
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

  @Equals(true, {
    message: 'Wymagana akceptacja regulaminu rezerwacji',
  })
  consent: boolean;

  /** opcjonalnie: zapis do newslettera na adres z rezerwacji (z potwierdzeniem linkiem z e-maila) */
  @IsOptional()
  @IsBoolean()
  newsletter?: boolean;

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
