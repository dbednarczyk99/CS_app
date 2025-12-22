import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateArticleImageDto } from './dto/create-article-image.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  // ARTICLE
  @Get()
  findAllArticles() {
    return this.service.findAll();
  }

  @Get(':id')
  findOneArticle(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  createArticle(@Body() dto: CreateArticleDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  editArticle(@Param('id') id: string, @Body() dto: CreateArticleDto) {
    return this.service.edit(id, dto);
  }

  @Delete(':id')
  removeArticle(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ARTICLE IMAGE
  @Post(':articleId/images')
  addArticleImage(
    @Param('articleId') articleId: string,
    @Body() dto: CreateArticleImageDto,
  ) {
    return this.service.addImage(articleId, dto);
  }

  @Delete('images/:id')
  removeArticleImage(@Param('id') id: string) {
    return this.service.removeImage(id);
  }
}
