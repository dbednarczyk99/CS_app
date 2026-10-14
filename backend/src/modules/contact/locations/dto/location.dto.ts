import {
  IsString,
  IsOptional,
  IsObject,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
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
