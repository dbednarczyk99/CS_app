import { Module } from '@nestjs/common';
import { BreadVanService } from './bread-van.service';
import { BreadVanController } from './bread-van.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [BreadVanService, PrismaService],
  controllers: [BreadVanController],
})
export class BreadVanModule {}
