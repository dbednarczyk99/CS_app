import { Role } from '@prisma/client';
import { StrongPassword } from '../password-policy';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';

// panel proponuje tylko dwie role: właściciel i treści strony
const PANEL_ROLES = [Role.ADMIN, Role.EDITOR];
const EMAIL_MSG = 'Podaj poprawny adres e-mail';
// pusty napis – usunięcie adresu
const hasEmail = (o: { email?: string }) => !!o.email;

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

  /** adres do odzyskiwania hasła */
  @IsOptional()
  @ValidateIf(hasEmail)
  @IsEmail({}, { message: EMAIL_MSG })
  @MaxLength(160)
  email?: string;

  @IsString()
  @StrongPassword()
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

  /** adres do odzyskiwania hasła; pusty – usunięcie */
  @IsOptional()
  @ValidateIf(hasEmail)
  @IsEmail({}, { message: EMAIL_MSG })
  @MaxLength(160)
  email?: string;

  /** nowe hasło ustawione przez właściciela (np. gdy ktoś zapomniał) */
  @IsOptional()
  @IsString()
  @StrongPassword()
  password?: string;
}

/** „Nie pamiętam hasła” – login albo adres e-mail konta */
export class ForgotPasswordDto {
  @IsString()
  @MaxLength(160)
  login: string;
}

/** Nowe hasło z linku w e-mailu */
export class ResetPasswordDto {
  @IsString()
  @Matches(/^[a-f0-9]{64}$/, { message: 'Nieprawidłowy link' })
  token: string;

  @IsString()
  @StrongPassword()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @StrongPassword()
  newPassword: string;
}
