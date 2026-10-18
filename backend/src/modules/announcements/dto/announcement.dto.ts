import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
// puste pole z panelu = brak wartości
const emptyToNull = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() === '' ? null : value;

export class CreateAnnouncementDto {
  @Transform(trim)
  @IsString()
  @Length(3, 160, { message: 'Treść komunikatu: 3–160 znaków' })
  message: string;

  @Transform(emptyToNull)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  // #newsletter – otwiera na stronie okienko zapisu do newslettera
  @Matches(/^(\/\S*|https?:\/\/\S+|#newsletter)$/, {
    message:
      'Link musi zaczynać się od „/” (strona piekarni) albo „https://”, ewentualnie „#newsletter”',
  })
  linkUrl?: string | null;

  @Transform(emptyToNull)
  @IsOptional()
  @IsString()
  @MaxLength(40, { message: 'Napis na przycisku: najwyżej 40 znaków' })
  linkLabel?: string | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Transform(emptyToNull)
  @IsOptional()
  @IsDateString({}, { message: 'Niepoprawna data rozpoczęcia' })
  startsAt?: string | null;

  @Transform(emptyToNull)
  @IsOptional()
  @IsDateString({}, { message: 'Niepoprawna data zakończenia' })
  endsAt?: string | null;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
