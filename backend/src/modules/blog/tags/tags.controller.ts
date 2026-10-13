import { Controller, Get, Query, Param } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private prisma: TagsService) {}

  @Get()
  findAll(@Query('q') q?: string) {
    return this.prisma.findAllTags(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.findOneTag(id);
  }
}
