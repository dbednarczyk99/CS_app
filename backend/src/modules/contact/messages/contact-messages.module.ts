import { Module } from '@nestjs/common';
import { ContactMessagesController } from './contact-messages.controller';
import { ContactMessagesService } from './contact-messages.service';

@Module({
  providers: [ContactMessagesService],
  controllers: [ContactMessagesController],
})
export class ContactMessagesModule {}
