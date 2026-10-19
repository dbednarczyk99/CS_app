import { Role } from '@prisma/client';
import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// panel proponuje tylko dwie role: właściciel i treści strony
const PANEL_ROLES = [Role.ADMIN, Role.EDITOR];
const PASSWORD_MIN = 10;
const PASSWORD_MSG = `Hasło musi mieć co najmniej ${PASSWORD_MIN} znaków`;

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-z0-9._-]{3,30}$/, {
    message:
      'Login: 3–30 znaków – małe litery bez polskich znaków, cyfry, kropka, myślnik',
  })
  login: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @IsIn(PANEL_ROLES, { message: 'Nieprawidłowa rola' })
  role: Role;

  @IsString()
  @MinLength(PASSWORD_MIN, { message: PASSWORD_MSG })
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsIn(PANEL_ROLES, { message: 'Nieprawidłowa rola' })
  role?: Role;

  /** nowe hasło ustawione przez właściciela (np. gdy ktoś zapomniał) */
  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_MIN, { message: PASSWORD_MSG })
  password?: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(PASSWORD_MIN, { message: PASSWORD_MSG })
  newPassword: string;
}
