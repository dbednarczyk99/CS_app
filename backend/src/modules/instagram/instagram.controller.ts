import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import { InstagramService } from './instagram.service';

class SaveInstagramDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  /** nowy klucz dostępu; pusty – usunięcie */
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  token?: string;
}

/** Instagram na stronie: posty dla strony, ustawienia i stan dla panelu (marketing i administrator) */
@Roles(...CONTENT_ROLES)
@Controller('instagram')
export class InstagramController {
  constructor(private readonly service: InstagramService) {}

  @Public()
  @Get()
  feed() {
    return this.service.publicFeed();
  }

  @Get('admin')
  state() {
    return this.service.adminState();
  }

  @Put('admin')
  save(@Body() dto: SaveInstagramDto) {
    return this.service.save(dto);
  }

  @Post('admin/refresh')
  async refresh() {
    await this.service.refresh();
    return this.service.adminState();
  }
}
