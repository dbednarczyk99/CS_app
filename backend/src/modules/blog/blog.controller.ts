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
import { Public, Roles, BLOG_ROLES } from '../auth/auth.decorators';

@Roles(...BLOG_ROLES)
@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAllArticles();
  }

  /* --- panel: wszystkie wpisy, także tylko do newslettera (trasy stałe przed ':id') --- */

  @Get('admin/all')
  findAllForAdmin() {
    return this.service.findAllArticles(false);
  }

  @Get('admin/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.service.findOneArticle(id, false);
  }

  @Public()
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
