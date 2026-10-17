import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto/announcement.dto';

@Roles(...CONTENT_ROLES)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly service: AnnouncementsService) {}

  // GET /announcements/active – dla strony (trasa stała przed ':id')
  @Public()
  @Get('active')
  active() {
    return this.service.active();
  }

  /* --- panel admina --- */

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
