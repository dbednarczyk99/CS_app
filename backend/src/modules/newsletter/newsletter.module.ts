import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';

@Module({
  providers: [NewsletterService, PrismaService],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
