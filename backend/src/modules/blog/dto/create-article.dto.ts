import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

  // nazwy tagów (string) lub obiekty { name }
  @IsOptional()
  @IsArray()
  tags?: (string | { name: string })[];
}
