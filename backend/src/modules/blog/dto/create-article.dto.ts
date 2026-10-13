import { IsString, MaxLength, MinLength } from 'class-validator';

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
}
