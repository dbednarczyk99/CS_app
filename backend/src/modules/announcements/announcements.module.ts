import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';

@Module({
  providers: [AnnouncementsService, PrismaService],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
