import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

/** Zapis z okienka na stronie */
export class SubscribeDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'Podaj poprawny adres e-mail' })
  @MaxLength(200)
  email: string;

  @Equals(true, { message: 'Zaznacz zgodę na otrzymywanie newslettera' })
  consent: boolean;

  /** pole-pułapka na boty – ukryte na stronie, musi zostać puste */
  @IsOptional()
  @IsString()
  website?: string;
}

/** Potwierdzenie / wypisanie – token z linku w e-mailu */
export class TokenDto {
  @IsString()
  @Length(20, 64)
  token: string;
}
