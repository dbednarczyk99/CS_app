import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
// puste pole w panelu = brak (np. bez drugiego przycisku, bez osobnego zdjęcia na telefon)
const emptyToNull = ({ value }: { value: unknown }) =>
  typeof value === 'string' && !value.trim()
    ? null
    : typeof value === 'string'
      ? value.trim()
      : value;
const LINK = /^(\/\S*|https?:\/\/\S+|#newsletter)$/;
const IMAGE = /^(\/\S*|https?:\/\/\S+)$/;
const POSITION = /^[a-z0-9% .]{1,30}$/i;

/** Slajd karuzeli na stronie głównej (rodzaj slajdu – kind – ustalany przy tworzeniu: zawsze CUSTOM) */
export class CreateHeroSlideDto {
  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Nazwa slajdu: co najmniej 2 znaki' })
  @MaxLength(20, { message: 'Nazwa slajdu: najwyżej 20 znaków' })
  name: string;

  @Transform(trim)
  @IsString()
  @MaxLength(50, { message: 'Nadtytuł: najwyżej 50 znaków' })
  eyebrow: string;

  @Transform(trim)
  @IsString()
  @MinLength(1, { message: 'Tytuł – pierwsza linia jest wymagana' })
  @MaxLength(30, { message: 'Tytuł – pierwsza linia: najwyżej 30 znaków' })
  titleLine1: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(30, { message: 'Tytuł – druga linia: najwyżej 30 znaków' })
  titleLine2?: string;

  @Transform(trim)
  @IsString()
  @MaxLength(220, { message: 'Opis: najwyżej 220 znaków' })
  text: string;

  @IsOptional()
  @Transform(emptyToNull)
  @MaxLength(30, { message: 'Napis pierwszego przycisku: najwyżej 30 znaków' })
  cta1Label?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @Matches(LINK, {
    message:
      'Link pierwszego przycisku musi zaczynać się od „/” albo „https://”',
  })
  cta1Href?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @MaxLength(30, { message: 'Napis drugiego przycisku: najwyżej 30 znaków' })
  cta2Label?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @Matches(LINK, {
    message: 'Link drugiego przycisku musi zaczynać się od „/” albo „https://”',
  })
  cta2Href?: string | null;

  @Transform(trim)
  // brak, pusty albo niepoprawny adres – jeden komunikat (zdjęcie wybiera się w panelu)
  @Matches(IMAGE, { message: 'Wybierz zdjęcie slajdu' })
  imageUrl: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(160, { message: 'Opis zdjęcia: najwyżej 160 znaków' })
  imageAlt?: string;

  @IsOptional()
  @Matches(POSITION, { message: 'Niepoprawny kadr zdjęcia' })
  imagePosition?: string;

  @IsOptional()
  @Transform(emptyToNull)
  @Matches(IMAGE, { message: 'Niepoprawny adres zdjęcia na telefon' })
  mobileImageUrl?: string | null;

  @IsOptional()
  @Matches(POSITION, { message: 'Niepoprawny kadr zdjęcia na telefon' })
  mobileImagePosition?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsDateString({}, { message: 'Niepoprawna data rozpoczęcia' })
  startsAt?: string | null;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsDateString({}, { message: 'Niepoprawna data zakończenia' })
  endsAt?: string | null;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateHeroSlideDto extends PartialType(CreateHeroSlideDto) {}
