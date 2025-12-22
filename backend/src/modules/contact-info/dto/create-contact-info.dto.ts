import { IsEmail, IsString } from 'class-validator';

export class CreateContactInfoDto {
  @IsString()
  phone: string;

  @IsEmail()
  email: string;
}
