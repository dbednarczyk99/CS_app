import { MediaName } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsEnum(MediaName)
  name: MediaName;
}
