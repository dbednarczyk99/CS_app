import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  MinLength,
  IsOptional,
  ValidateNested,
  IsArray,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateProductImageDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateProductDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @MinLength(5)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isSeasonal?: boolean;

  @IsBoolean()
  @IsOptional()
  inSeason?: boolean;

  @IsBoolean()
  @IsOptional()
  isBestseller?: boolean;

  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isReservable?: boolean;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  @IsOptional()
  images?: UpdateProductImageDto[]; // pełny nowy zestaw zdjęć przy PATCH
}
