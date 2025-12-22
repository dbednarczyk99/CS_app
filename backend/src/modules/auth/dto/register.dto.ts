import { IsEnum, IsHash, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  login: string;

  @IsString()
  @MinLength(8)
  @IsHash('bcrypt')
  password: string;

  @IsEnum(Role)
  role: Role;
}
