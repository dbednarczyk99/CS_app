import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InstagramController } from './instagram.controller';
import { InstagramService } from './instagram.service';

@Module({
  controllers: [InstagramController],
  providers: [InstagramService, PrismaService],
})
export class InstagramModule {}
