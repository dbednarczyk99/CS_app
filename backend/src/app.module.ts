import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';

import { DebugController } from './debug.controller';
import { UploadController } from './modules/upload/upload.controller';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.module';
import { TagsModule } from './modules/blog/tags/tags.module';
import { BreadVanModule } from './modules/bread-van/bread-van.module';
import { ContactInfoModule } from './modules/contact/contact-info/contact-info.module';
import { LocationsModule } from './modules/contact/locations/locations.module';
import { MailModule } from './modules/mail/mail.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { RevalidateModule } from './modules/revalidate/revalidate.module';
import { ContactMessagesModule } from './modules/contact/messages/contact-messages.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ContentModule } from './modules/content/content.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
        // pliki z /uploads to tylko zdjęcia: przeglądarka nie zgaduje typu i nie uruchomi w nich żadnego skryptu
        setHeaders: (res) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'none'; sandbox",
          );
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
      },
    }),

    ProductsModule,
    AuthModule,
    BlogModule,
    TagsModule,
    BreadVanModule,
    ContactInfoModule,
    LocationsModule,
    MailModule,
    StatsModule,
    ReservationsModule,
    RevalidateModule,
    ContactMessagesModule,
    AnnouncementsModule,
    ContentModule,
    SettingsModule,
    NewsletterModule,
  ],
  controllers: [UploadController, DebugController],
})
export class AppModule {}
