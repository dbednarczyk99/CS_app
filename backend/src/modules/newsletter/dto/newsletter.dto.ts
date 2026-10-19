import { Transform } from 'class-transformer';
import {
  Equals,
  IsBoolean,
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

/** Podgląd newslettera z formularza wpisu (bez zapisu) */
export class NewsletterPreviewDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(300)
  title: string;

  @IsString()
  @MaxLength(500)
  shortDescription: string;

  @IsString()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;
}
