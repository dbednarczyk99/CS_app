import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/location.dto';
import { UpdateLocationDto } from './dto/location.dto';
import { Public, Roles, CONTENT_ROLES } from '../../auth/auth.decorators';

@Roles(...CONTENT_ROLES)
@Controller('contact/locations')
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: CreateLocationDto) {
    return this.service.create(body);
  }

  // „Odśwież ocenę teraz” w formularzu piekarni
  @Post(':id/refresh-rating')
  refreshRating(@Param('id') id: string) {
    return this.service.refreshRatingNow(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateLocationDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
