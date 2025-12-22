import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Patch,
} from '@nestjs/common';
import { BreadVanService } from './bread-van.service';
import { UpdateBreadVanDto } from './dto/update-bread-van.dto';
import { CreateBreadVanDto } from './dto/create-bread-van.dto';

@Controller('bread-van')
export class BreadVanController {
  constructor(private readonly service: BreadVanService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: CreateBreadVanDto) {
    return this.service.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() body: UpdateBreadVanDto) {
    return this.service.edit(id, body);
  }
}
