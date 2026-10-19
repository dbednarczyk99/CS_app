import {
  IsString,
  IsNumber,
  IsUUID,
  IsBoolean,
  MinLength,
  ValidateNested,
  IsArray,
  IsInt,
  IsOptional,
  Matches,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

const DAY = /^\d{4}-\d{2}-\d{2}$/;
// puste pole daty w panelu = brak ograniczenia
const emptyToNull = ({ value }: { value: unknown }) =>
  value === '' ? null : value;

class UpdateProductImageDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateProductDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @MinLength(5)
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isSeasonal?: boolean;

  @IsBoolean()
  @IsOptional()
  inSeason?: boolean;

  /** etykiety z listy w panelu (Nowość, Bestseller, własne) – pełny zestaw przy zapisie */
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  labelIds?: string[];

  /** promocja: etykieta „Promocja” w okresie od–do (puste daty = bez ograniczenia) */
  @IsOptional()
  @IsBoolean()
  isPromo?: boolean;

  /** cena promocyjna (opcjonalna) – musi być niższa od zwykłej */
  @IsOptional()
  @IsNumber()
  @Min(0.01, { message: 'Cena promocyjna musi być większa od zera' })
  promoPrice?: number | null;

  @IsOptional()
  @Transform(emptyToNull)
  @Matches(DAY, { message: 'Niepoprawna data rozpoczęcia promocji' })
  promoFrom?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @Matches(DAY, { message: 'Niepoprawna data zakończenia promocji' })
  promoTo?: string | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isReservable?: boolean;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductImageDto)
  @IsOptional()
  images?: UpdateProductImageDto[]; // pełny nowy zestaw zdjęć przy PATCH

  /** planowanie (YYYY-MM-DD): od tego dnia produkt sam się włączy (aktywny, a sezonowy – w sezonie); puste = brak */
  @IsOptional()
  @Transform(emptyToNull)
  @Matches(DAY, { message: 'Niepoprawna data „Dostępny od”' })
  availableFrom?: string | null;

  /** planowanie (YYYY-MM-DD): od tego dnia produkt sam się wyłączy (sezonowy – poza sezon, zwykły – ukryty) */
  @IsOptional()
  @Transform(emptyToNull)
  @Matches(DAY, { message: 'Niepoprawna data „Niedostępny od”' })
  unavailableFrom?: string | null;
}
