import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  MinLength,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateProductImageInlineDto {
  @IsString()
  imgUrl: string;
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

  @IsBoolean()
  isActive: boolean; // wymagane

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageInlineDto)
  images: CreateProductImageInlineDto[]; // wymagane
}
