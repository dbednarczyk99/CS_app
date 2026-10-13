import { Controller, Get, Query, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Public, Roles, BLOG_ROLES } from '../../auth/auth.decorators';

@Roles(...BLOG_ROLES)
@Controller('tags')
export class TagsController {
  constructor(private prisma: TagsService) {}

  @Public()
  @Get()
  findAll(@Query('q') q?: string) {
    return this.prisma.findAllTags(q);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.findOneTag(id);
  }
}
