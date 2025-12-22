import { Module } from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoController } from './contact-info.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ContactInfoService, PrismaService],
  controllers: [ContactInfoController],
})
export class ContactInfoModule {}
