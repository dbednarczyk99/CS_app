import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ArticleImages, BlogItem } from '@prisma/client';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateArticleImageDto } from './dto/create-article-image.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  //ARTICLE
  findAll(): Prisma.PrismaPromise<BlogItem[]> {
    return this.prisma.blogItem.findMany({
      include: { images: true },
    });
  }

  findOne(id: string): Prisma.PrismaPromise<BlogItem | null> {
    return this.prisma.blogItem.findUnique({
      where: { id },
      include: { images: true },
    });
  }

  create(dto: CreateArticleDto): Prisma.PrismaPromise<BlogItem> {
    return this.prisma.blogItem.create({ data: dto });
  }

  remove(id: string): Prisma.PrismaPromise<BlogItem> {
    return this.prisma.blogItem.delete({ where: { id } });
  }

  edit(id: string, data: UpdateArticleDto): Prisma.PrismaPromise<BlogItem> {
    return this.prisma.blogItem.update({ where: { id }, data });
  }

  //ARTICLE IMAGE
  addImage(dto: CreateArticleImageDto): Prisma.PrismaPromise<ArticleImages> {
    return this.prisma.articleImages.create({ data: dto });
  }

  removeImage(id: string): Prisma.PrismaPromise<ArticleImages> {
    return this.prisma.articleImages.delete({ where: { id } });
  }
}
