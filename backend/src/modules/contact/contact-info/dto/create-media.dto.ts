import { MediaName } from '@prisma/client';
import { IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsString()
  name: MediaName;
}
