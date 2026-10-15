import {
  IsString,
  IsOptional,
  IsObject,
  IsLatitude,
  IsLongitude,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  phone?: string;

  /** skrót do numerów rezerwacji (2–6 liter), np. WIL; puste = z adresu */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.trim()
      ? value.trim().toUpperCase()
      : null,
  )
  @IsOptional()
  @Matches(/^[A-Z]{2,6}$/, { message: 'Kod: 2–6 liter, np. WIL' })
  code?: string | null;

  @IsString()
  googleMapsUrl: string;

  @IsOptional()
  @IsLatitude()
  lat?: number;

  @IsOptional()
  @IsLongitude()
  lng?: number;

  @IsOptional()
  @IsObject()
  openingHours: Record<string, { openFrom: string; openTo: string }>;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
