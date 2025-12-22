import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleImageDto } from './create-article-image.dto';

export class UpdateArticleImageDto extends PartialType(CreateArticleImageDto) {}
