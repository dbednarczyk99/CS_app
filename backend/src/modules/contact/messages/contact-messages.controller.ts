import { Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { Public } from '../../auth/auth.decorators';
import { ContactMessageDto } from './dto/contact-message.dto';
import { ContactMessagesService } from './contact-messages.service';

@Controller('contact/messages')
export class ContactMessagesController {
  constructor(private readonly service: ContactMessagesService) {}

  @Public()
  @Post()
  send(
    @Body() dto: ContactMessageDto,
    @Ip() ip: string,
    // strona przekazuje formularz przez swój serwer – adres klienta w X-Forwarded-For
    @Headers('x-forwarded-for') forwardedFor?: string,
  ) {
    const clientIp = forwardedFor?.split(',')[0]?.trim() || ip;
    return this.service.send(dto, clientIp);
  }
}
