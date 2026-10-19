import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import { ContentService } from './content.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';

/**
 * Treści strony: GET /content (strona – wszystkie sekcje), /content/hero (strona – aktywne slajdy);
 * panel: opis sekcji z wartościami, zapis i przywracanie tekstów domyślnych, slajdy karuzeli.
 * Trasy stałe są zadeklarowane przed „:key”.
 */
@Roles(...CONTENT_ROLES)
@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Public()
  @Get()
  all() {
    return this.service.all();
  }

  @Public()
  @Get('hero')
  activeSlides() {
    return this.service.activeSlides();
  }

  /* --- panel: sekcje --- */

  @Get('sections')
  sections(@Query('page') page?: string) {
    return this.service.sections(page);
  }

  /* --- panel: slajdy karuzeli --- */

  @Get('hero-slides')
  slides() {
    return this.service.slides();
  }

  @Get('hero-slides/:id')
  slide(@Param('id') id: string) {
    return this.service.slide(id);
  }

  @Post('hero-slides')
  createSlide(@Body() dto: CreateHeroSlideDto) {
    return this.service.createSlide(dto);
  }

  @Patch('hero-slides/:id')
  updateSlide(@Param('id') id: string, @Body() dto: UpdateHeroSlideDto) {
    return this.service.updateSlide(id, dto);
  }

  @Delete('hero-slides/:id')
  removeSlide(@Param('id') id: string) {
    return this.service.removeSlide(id);
  }

  /* --- panel: zapis sekcji --- */

  @Put(':key')
  save(@Param('key') key: string, @Body() body: unknown) {
    return this.service.save(key, body);
  }

  @Delete(':key')
  reset(@Param('key') key: string) {
    return this.service.reset(key);
  }
}
