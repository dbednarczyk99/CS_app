import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  providers: [ContentService, PrismaService],
  controllers: [ContentController],
})
export class ContentModule {}
