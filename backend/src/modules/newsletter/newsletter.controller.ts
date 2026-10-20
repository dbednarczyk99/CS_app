import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Ip,
  Param,
  Post,
} from '@nestjs/common';
import { CONTENT_ROLES, Public, Roles } from '../auth/auth.decorators';
import {
  NewsletterPreviewDto,
  SubscribeDto,
  TokenDto,
} from './dto/newsletter.dto';
import { NewsletterService } from './newsletter.service';

@Roles(...CONTENT_ROLES)
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  /* --- publiczne (strona) --- */

  @Public()
  @Post('subscribe')
  subscribe(
    @Body() dto: SubscribeDto,
    @Ip() ip: string,
    // strona przekazuje zapis przez swój serwer – adres klienta w X-Forwarded-For
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    return this.service.subscribe(
      dto,
      forwardedFor?.split(',')[0]?.trim() || ip,
    );
  }

  // POST (przycisk na stronie), nie GET – skanery poczty otwierają linki i potwierdzałyby zapis same
  @Public()
  @Post('confirm')
  confirm(@Body() dto: TokenDto) {
    return this.service.confirm(dto.token);
  }

  @Public()
  @Post('unsubscribe')
  unsubscribe(@Body() dto: TokenDto) {
    return this.service.unsubscribe(dto.token);
  }

  /* --- panel admina --- */

  // liczba subskrybentów – dla obu ról (formularz wpisu pokazuje, do ilu osób pójdzie newsletter)
  @Get('stats')
  stats() {
    return this.service.stats();
  }

  // podgląd e-maila z wersji roboczej wpisu (formularz w panelu) – dla obu ról
  @Post('preview')
  @HttpCode(200)
  preview(@Body() dto: NewsletterPreviewDto) {
    return this.service.preview({
      ...dto,
      isPublished: dto.isPublished ?? true,
    });
  }

  // lista adresów (dane osobowe) – administrator i marketing (role z klasy)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
