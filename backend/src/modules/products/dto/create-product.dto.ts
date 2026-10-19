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

class CreateProductImageInlineDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @MinLength(5)
  description: string;

  @IsBoolean()
  isSeasonal: boolean; // wymagane

  /** sezonowy: czy teraz dostępny (domyślnie tak) */
  @IsOptional()
  @IsBoolean()
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
  isActive: boolean; // wymagane

  @IsOptional()
  @IsBoolean()
  isReservable?: boolean;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageInlineDto)
  images: CreateProductImageInlineDto[]; // wymagane
}
