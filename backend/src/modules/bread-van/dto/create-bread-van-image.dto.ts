import { IsBoolean, IsString } from 'class-validator';

export class CreateBreadVanImageDto {
  @IsString()
  imgUrl: string;

  @IsBoolean()
  IsMain: boolean;

  @IsString()
  descriptionId: string;
}
