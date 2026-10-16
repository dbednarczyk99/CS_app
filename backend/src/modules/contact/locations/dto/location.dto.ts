import {
  IsString,
  IsOptional,
  IsObject,
  IsLatitude,
  IsLongitude,
  Matches,
  IsArray,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class LocationImageInlineDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
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

  /** pełny zestaw zdjęć lokalu (kolejność jak w tablicy) */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationImageInlineDto)
  images?: LocationImageInlineDto[];
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
