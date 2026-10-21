import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../auth/auth.decorators';
import { ClientIp } from '../../auth/client-ip';
import { ContactMessageDto } from './dto/contact-message.dto';
import { ContactMessagesService } from './contact-messages.service';

@Controller('contact/messages')
export class ContactMessagesController {
  constructor(private readonly service: ContactMessagesService) {}

  @Public()
  @Post()
  // strona przekazuje formularz przez swój serwer – adres klienta potwierdzony sekretem (ClientIp)
  send(@Body() dto: ContactMessageDto, @ClientIp() ip: string) {
    return this.service.send(dto, ip);
  }
}
