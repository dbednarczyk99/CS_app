import { IsString, Max, Min } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @Min(5)
  title: string;

  @IsString()
  @Max(500)
  @Min(20)
  shortDescription: string;

  @IsString()
  @Max(5000)
  @Min(20)
  content: string;
}
