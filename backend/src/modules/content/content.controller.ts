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
  Req,
} from '@nestjs/common';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import type { StaffRequest } from '../auth/auth.guard';
import { ContentService } from './content.service';
import { CreateHeroSlideDto, UpdateHeroSlideDto } from './dto/hero-slide.dto';

/**
 * Treści strony: GET /content (strona – wszystkie sekcje), /content/hero (strona – aktywne slajdy);
 * panel: opis sekcji z wartościami, zapis, historia wersji, przywracanie tekstów domyślnych, slajdy karuzeli.
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

  @Get('hero-slides/:id/history')
  slideHistory(@Param('id') id: string) {
    return this.service.slideHistory(id);
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
  updateSlide(
    @Param('id') id: string,
    @Body() dto: UpdateHeroSlideDto,
    @Req() req: StaffRequest,
  ) {
    return this.service.updateSlide(id, dto, req.user?.sub);
  }

  @Delete('hero-slides/:id')
  removeSlide(@Param('id') id: string) {
    return this.service.removeSlide(id);
  }

  /* --- panel: sekcje – zapis, historia, teksty domyślne --- */

  @Get(':key/revisions')
  revisions(@Param('key') key: string) {
    return this.service.sectionRevisions(key);
  }

  @Put(':key')
  save(
    @Param('key') key: string,
    @Body() body: unknown,
    @Req() req: StaffRequest,
  ) {
    return this.service.save(key, body, req.user?.sub);
  }

  @Delete(':key')
  reset(@Param('key') key: string, @Req() req: StaffRequest) {
    return this.service.reset(key, req.user?.sub);
  }
}
