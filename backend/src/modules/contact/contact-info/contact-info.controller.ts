import {
  Controller,
  Get,
  Patch,
  Body,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ContactInfoService } from './contact-info.service';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Public, Roles, CONTENT_ROLES } from '../../auth/auth.decorators';

@Roles(...CONTENT_ROLES)
@Controller('contact')
export class ContactInfoController {
  constructor(private readonly service: ContactInfoService) {}

  /*   ------------------         CONTACT         ------------------   */
  // GET /contact
  @Public()
  @Get('info')
  findAll() {
    return this.service.findAll();
  }

  // GET /contact/info/:id
  @Public()
  @Get('info/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // PATCH /contact/info/:id
  @Patch('info/:id')
  updateContact(@Param('id') id: string, @Body() body: UpdateContactInfoDto) {
    return this.service.updateContact(id, body);
  }

  // DELETE /contact/info/:id
  @Delete('info/:id')
  deleteContact(@Param('id') id: string) {
    return this.service.deleteContact(id);
  }

  // POST /contact/info
  @Post('info')
  createContact(@Body() body: UpdateContactInfoDto) {
    return this.service.createContact(body);
  }

  /*   ------------------         SOCIAL MEDIA         ------------------   */
  // GET /contact/media
  @Public()
  @Get('media')
  getAllMedia() {
    return this.service.getAllMedia();
  }

  // GET /contact/media/:id
  @Public()
  @Get('media/:id')
  getMediaById(@Param('id') id: string) {
    return this.service.getMediaById(id);
  }

  // POST /contact/media
  @Post('media')
  addMedia(@Body() body: CreateMediaDto) {
    return this.service.addMedia(body);
  }

  // PATCH /contact/media/:id
  @Patch('media/:id')
  editMedia(@Param('id') id: string, @Body() body: UpdateMediaDto) {
    return this.service.editMedia(id, body);
  }

  // DELETE /contact/media/:id
  @Delete('media/:id')
  deleteMedia(@Param('id') id: string) {
    return this.service.deleteMedia(id);
  }
}
