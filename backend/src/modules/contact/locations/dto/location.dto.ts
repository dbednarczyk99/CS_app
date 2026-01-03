import { IsString, IsOptional, IsObject } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsString()
  address: string;

  @IsString()
  googleMapsUrl: string;

  @IsObject()
  openingHours: Record<string, { openFrom: string; openTo: string }>;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
