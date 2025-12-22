import { IsString, IsUUID } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsString()
  name: string;

  @IsUUID()
  contactId: string;
}
