import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { CreateContactInfoDto } from './dto/create-contact-info.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller('contact')
export class ContactInfoController {
  constructor(private readonly service: ContactInfoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // CONTACT INFO
  @Post()
  create(@Body() body: CreateContactInfoDto) {
    return this.service.createContact(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateContactInfoDto) {
    return this.service.updateContact(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deleteContact(id);
  }

  // LOCATION
  @Post('location')
  addLocation(@Body() body: CreateLocationDto) {
    return this.service.addLocation(body);
  }

  @Patch('location/:id')
  updateLocation(@Param('id') id: string, @Body() body: UpdateLocationDto) {
    return this.service.updateLocation(id, body);
  }

  @Delete('location/:id')
  deleteLocation(@Param('id') id: string) {
    return this.service.deleteLocation(id);
  }

  // MEDIA
  @Post('media')
  addMedia(@Body() body: CreateMediaDto) {
    return this.service.addMedia(body);
  }

  @Patch('media/:id')
  editMedia(@Param('id') id: string, @Body() body: UpdateMediaDto) {
    return this.service.editMedia(id, body);
  }

  @Delete('media/:id')
  deleteMedia(@Param('id') id: string) {
    return this.service.deleteMedia(id);
  }
}
