import {
  IsBoolean,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
  IsDateString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class ArticleImageInlineDto {
  @IsString()
  imgUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;
}

export class CreateArticleDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MaxLength(500)
  @MinLength(20)
  shortDescription: string;

  @IsString()
  @MaxLength(5000)
  @MinLength(20)
  content: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticleImageInlineDto)
  images?: ArticleImageInlineDto[];

  /** zdjęcie w podglądzie linku przy udostępnianiu; puste = okładka wpisu */
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && !value.trim() ? null : value,
  )
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @MaxLength(500)
  @Matches(/^(\/[^\s]*|https?:\/\/[^\s]+)$/, {
    message: 'Niepoprawny adres zdjęcia do udostępniania',
  })
  shareImageUrl?: string | null;

  /** widoczny na stronie (false = tylko newsletter) */
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  /** wysłać wpis do zapisanych w newsletterze (domyślnie tak; wysyłka tylko raz) */
  @IsOptional()
  @IsBoolean()
  sendAsNewsletter?: boolean;

  // nazwy tagów (string) lub obiekty { name }
  @IsOptional()
  @IsArray()
  tags?: (string | { name: string })[];

  /** zaplanowana publikacja na stronie i wysyłka newslettera (ISO); puste = od razu */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (value === '' ? null : value))
  @IsDateString({}, { message: 'Niepoprawna data publikacji' })
  publishAt?: string | null;
}
