import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

@Module({
  providers: [NewsletterService, PrismaService],
  controllers: [NewsletterController],
  // wysyłka wpisów z bloga (BlogService)
  exports: [NewsletterService],
})
export class NewsletterModule {}
