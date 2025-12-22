import { IsString, IsNumber, IsBoolean, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  isSeasonal: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsUUID()
  categoryId: string;
}
