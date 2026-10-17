import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  MinLength,
  ValidateNested,
  IsArray,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateProductImageInlineDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @MinLength(5)
  description: string;

  @IsBoolean()
  isSeasonal: boolean; // wymagane

  /** sezonowy: czy teraz dostępny (domyślnie tak) */
  @IsOptional()
  @IsBoolean()
  inSeason?: boolean;

  /** etykieta „Bestseller” */
  @IsOptional()
  @IsBoolean()
  isBestseller?: boolean;

  /** etykieta „Nowość” */
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsBoolean()
  isActive: boolean; // wymagane

  @IsOptional()
  @IsBoolean()
  isReservable?: boolean;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageInlineDto)
  images: CreateProductImageInlineDto[]; // wymagane
}
