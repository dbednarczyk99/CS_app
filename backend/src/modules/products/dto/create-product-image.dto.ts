import { IsString, IsUUID } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  imgUrl: string;

  @IsUUID()
  productId: string;
}
