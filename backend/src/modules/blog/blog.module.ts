import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { NewsletterModule } from '../newsletter/newsletter.module';

@Module({
  imports: [NewsletterModule],
  providers: [BlogService, PrismaService],
  controllers: [BlogController],
})
export class BlogModule {}
