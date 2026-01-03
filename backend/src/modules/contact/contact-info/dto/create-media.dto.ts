import { IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsString()
  icon: string;
}
