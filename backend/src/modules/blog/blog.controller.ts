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
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  findAll() {
    return this.service.findAllArticles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneArticle(id);
  }

  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.service.createArticle(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.service.updateArticle(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.deleteArticle(id);
  }
}
