import { IsString, IsUUID } from 'class-validator';

export class CreateArticleImageDto {
  @IsString()
  imgUrl: string;

  @IsUUID()
  articleId: string;
}
