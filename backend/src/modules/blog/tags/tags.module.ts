import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { PrismaService } from '../../../prisma/prisma.service';
import { TagsService } from './tags.service';

@Module({
  controllers: [TagsController],
  providers: [TagsService, PrismaService],
})
export class TagsModule {}
