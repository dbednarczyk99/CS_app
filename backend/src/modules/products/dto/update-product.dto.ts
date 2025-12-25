import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  MinLength,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateProductImageDto {
  @IsString()
  imgUrl: string;
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
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  @IsOptional()
  images?: UpdateProductImageDto[]; // pełny nowy zestaw zdjęć przy PATCH
}
