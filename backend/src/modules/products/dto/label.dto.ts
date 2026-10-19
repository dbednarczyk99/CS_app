import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

// wygląd etykiety na stronie (style: web/src/lib/products.ts – BADGE_STYLE; panel: labels.tsx)
export const LABEL_COLORS = ['gold', 'cream', 'dark', 'green', 'red'] as const;

export class CreateLabelDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2, { message: 'Nazwa etykiety musi mieć co najmniej 2 znaki' })
  @MaxLength(30, { message: 'Nazwa etykiety może mieć najwyżej 30 znaków' })
  name: string;

  @IsOptional()
  @IsIn(LABEL_COLORS)
  color?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateLabelDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2, { message: 'Nazwa etykiety musi mieć co najmniej 2 znaki' })
  @MaxLength(30, { message: 'Nazwa etykiety może mieć najwyżej 30 znaków' })
  name?: string;

  @IsOptional()
  @IsIn(LABEL_COLORS)
  color?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
